import axios from 'axios';
import FormData from 'form-data';
import logger from './logger.js';
import errorTransformer from './errorTransformer.js';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

async function generateImage(prompt) {
  try {
    const payload = {
      prompt,
      output_format: 'webp'
    };
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: 'image/*'
        }
      }
    );
    if (response.status === 200) {
      return Buffer.from(response.data);
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    logger.error(`Error in image generation`, {
      error: errorTransformer(error)
    });
    return null;
  }
}

export default generateImage;
