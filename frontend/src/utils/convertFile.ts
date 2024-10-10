import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

interface ConvertFileParams {
  blob: Blob;
  mimeType: string;
  outputExtension: string;
}

const ffmpeg = new FFmpeg();
let isLoaded = false;

const loadFFmpeg = async () => {
  if (!isLoaded) {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      )
    });
    isLoaded = true;
  }
};

export const convertFile = async ({
  blob,
  mimeType,
  outputExtension
}: ConvertFileParams): Promise<Blob> => {
  await loadFFmpeg();
  const fileName = `input.${outputExtension}`;
  const outputFileName = `output.${outputExtension}`;
  const finalMimeType = `${mimeType.split('/')[0]}/${outputExtension}`;

  await ffmpeg.writeFile(fileName, new Uint8Array(await blob.arrayBuffer()));

  await ffmpeg.exec(['-i', fileName, outputFileName]);

  const fileData = await ffmpeg.readFile(outputFileName);
  const data = new Uint8Array(fileData as ArrayBuffer);

  return new Blob([data.buffer], { type: finalMimeType });
};
