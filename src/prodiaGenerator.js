import axios from 'axios';
import { Buffer } from 'node:buffer';

async function generateImageProdia(prompt, model, sampler, seed, neg) {
  console.log('\x1b[32m(Prodia) Creating image for :\x1b[0m', prompt);
  const startTime = Date.now();

  const negative =
    neg ||
    '(nsfw:1.5),verybadimagenegative_v1.3, ng_deepnegative_v1_75t, (ugly face:0.8)...';

  async function createJob() {
    const url = 'https://api.prodia.com/generate';
    const params = {
      new: 'true',
      prompt: encodeURIComponent(prompt),
      model: model,
      negative_prompt: negative,
      steps: '100',
      cfg: '9.5',
      seed: seed
        ? seed.toString()
        : String(Math.floor(Math.random() * 1000000)),
      sampler: sampler,
      upscale: 'True',
      aspect_ratio: 'square',
    };

    try {
      console.log('Creating job with params:', params);
      const response = await axios.get(url, { params });
      console.log('Job creation response:', response.data);
      return response.data.job;
    } catch (error) {
      console.error(
        'Error generating job:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  }

  try {
    const jobId = await createJob();
    const jobUrl = `https://api.prodia.com/job/${jobId}`;
    const headers = { Accept: '*/*' };

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 60; // 1 minute total wait time

      const checkJobStatus = async () => {
        attempts++;

        try {
          const response = await axios.get(jobUrl, { headers });
          console.log(
            `Job status (Attempt ${attempts}):`,
            response.data.status,
          );

          if (response.data.status === 'succeeded') {
            const imageResponse = await axios.get(
              `https://images.prodia.xyz/${jobId}.png?download=1`,
              { responseType: 'arraybuffer' },
            );

            const imgFileObj = Buffer.from(imageResponse.data);
            const duration = (Date.now() - startTime) / 1000;

            console.log(
              `\x1b[34m(Prodia) Finished image creation\x1b[0m\nJob id: ${jobId}  Prompt: "${prompt}" in ${duration} seconds.`,
            );

            resolve(imgFileObj);
          } else if (response.data.status === 'failed') {
            reject(new Error('Image generation failed'));
          } else if (attempts >= maxAttempts) {
            reject(new Error('Image generation timed out'));
          } else {
            setTimeout(checkJobStatus, 1000);
          }
        } catch (error) {
          console.error(
            'Error checking job status:',
            error.response ? error.response.data : error.message,
          );
          if (attempts >= maxAttempts) {
            reject(error);
          } else {
            setTimeout(checkJobStatus, 1000);
          }
        }
      };

      checkJobStatus();
    });
  } catch (error) {
    console.error('Overall image generation error:', error);
    throw error;
  }
}

export { generateImageProdia };
