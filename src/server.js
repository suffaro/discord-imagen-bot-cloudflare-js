import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { GENERATE_IMAGE } from './commands.js';
import { generateImageProdia } from './prodiaGenerator.js';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    switch (interaction.data.name.toLowerCase()) {
      case GENERATE_IMAGE.name.toLowerCase(): {
        // Acknowledge the interaction and defer the response
        const initialResponse = new JsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        // Process the image generation asynchronously
        const generateImageTask = async () => {
          const { prompt, model, sampler, seed, neg_prompt } =
            interaction.data.options.reduce((acc, option) => {
              acc[option.name] = option.value;
              return acc;
            }, {});

          try {
            const imageBuffer = await generateImageProdia(
              prompt,
              model,
              sampler,
              seed,
              neg_prompt,
            );

            const formData = new FormData();
            formData.append(
              'file',
              new Blob([imageBuffer]),
              'generated_image.png',
            );

            await fetch(
              `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}`,
              {
                method: 'POST',
                body: JSON.stringify({
                  content: `Image generated for prompt: "${prompt}"`,
                  attachments: [
                    {
                      id: 0,
                      filename: 'generated_image.png',
                    },
                  ],
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );
          } catch (error) {
            console.error('Error generating image:', error);
            await fetch(
              `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  content: `Failed to generate image. Error: ${error.message}`,
                }),
              },
            );
          }
        };

        generateImageTask(); // Fire the async task
        return initialResponse; // Return the deferred response
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;
