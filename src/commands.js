/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const GENERATE_IMAGE = {
  name: 'generate_image',
  description: 'Generate an image based on your prompt.',
  options: [
    {
      type: 3, // STRING type for prompt
      name: 'prompt',
      description: 'The prompt for the image generation',
      required: true,
    },
    {
      type: 3, // STRING type for model
      name: 'model',
      description: 'Select the model for image generation',
      required: true,
      choices: [
        {
          name: '🎨 Analog V1',
          value: 'analog-diffusion-1.0.ckpt [9ca13f02]',
        },
        {
          name: '🖼️ Anything V3',
          value: 'anythingv3_0-pruned.ckpt [2700c435]',
        },
        {
          name: '🌄 Anything V4.5',
          value: 'anything-v4.5-pruned.ckpt [65745d25]',
        },
        {
          name: '🍊 AbyssOrangeMix V3',
          value: 'AOM3A3_orangemixs.safetensors [9600da17]',
        },
        {
          name: '🧠 Deliberate V2',
          value: 'deliberate_v2.safetensors [10ec4b29]',
        },
        {
          name: '💭 Dreamlike V1',
          value: 'dreamlike-diffusion-1.0.safetensors [5c9fd6e0]',
        },
        {
          name: '🌌 Dreamlike V2',
          value: 'dreamlike-diffusion-2.0.safetensors [fdcf65e7]',
        },
        {
          name: '🌠 Dreamshaper 5',
          value: 'dreamshaper_5BakedVae.safetensors [a3fbf318]',
        },
        {
          name: '⭐ Dreamshaper 6',
          value: 'dreamshaper_6BakedVae.safetensors [114c8abb]',
        },
        {
          name: "🌈 Elldreth's Vivid",
          value: 'elldreths-vivid-mix.safetensors [342d9d26]',
        },
        {
          name: '🎶 Lyriel V1.5',
          value: 'lyriel_v15.safetensors [65d547c5]',
        },
        {
          name: '🎧 Lyriel V1.6',
          value: 'lyriel_v16.safetensors [68fceea2]',
        },
        {
          name: '🤖 MechaMix V1.0',
          value: 'mechamix_v10.safetensors [ee685731]',
        },
        {
          name: '🦸‍♀️ MeinaMix V9',
          value: 'meinamix_meinaV9.safetensors [2ec66ab0]',
        },
        {
          name: '🚀 Openjourney V4',
          value: 'openjourney_V4.ckpt [ca2f377f]',
        },
        {
          name: '👩‍🎨 Portrait V1',
          value: 'portrait+1.0.safetensors [1400e684]',
        },
        {
          name: '🌍 Realistic Vision V1.4',
          value: 'Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]',
        },
        {
          name: '🌟 Realistic Vision V2.0',
          value: 'Realistic_Vision_V2.0.safetensors [79587710]',
        },
        {
          name: '🎬 ReV Animated V1.2.2',
          value: 'revAnimated_v122.safetensors [3f4fefd9]',
        },
        {
          name: '🎵 Riffusion V1',
          value: 'riffusion-model-v1.ckpt [3aafa6fe]',
        },
        {
          name: '💫 Stable Diffusion V1.4',
          value: 'sdv1_4.ckpt [7460a6fa]',
        },
        {
          name: '🌍 Stable Diffusion V1.5',
          value: 'v1-5-pruned-emaonly.ckpt [81761151]',
        },
        {
          name: "🦄 Shonin's Beautiful People V1.0",
          value: 'shoninsBeautiful_v10.safetensors [25d8c546]',
        },
        {
          name: "🪐 TheAlly's Mix II",
          value: 'theallys-mix-ii-churned.safetensors [5d9225a4]',
        },
        {
          name: '⏳ Timeless V1',
          value: 'timeless-1.0.ckpt [7c4971d4]',
        },
      ],
    },
    {
      type: 3, // STRING type for sampler
      name: 'sampler',
      description: 'Select the sampler for image generation',
      required: true,
      choices: [
        { name: '🌀 Euler', value: 'Euler' },
        { name: '🔄 Euler a', value: 'Euler a' },
        { name: '🔂 Heun', value: 'Heun' },
        { name: '🔹 DPM++ 2M Karras', value: 'DPM++ 2M Karras' },
        { name: '🔸 DPM++ SDE Karras', value: 'DPM++ SDE Karras' },
        { name: '🔁 DDIM', value: 'DDIM' },
      ],
    },
    {
      type: 4, // INTEGER type for seed
      name: 'seed',
      description: 'The seed for randomization (optional)',
      required: false,
    },
    {
      type: 3, // STRING type for negative prompt
      name: 'neg_prompt',
      description: 'Negative prompt for image generation (optional)',
      required: false,
    },
  ],
};
