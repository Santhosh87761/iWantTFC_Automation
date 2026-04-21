import sharp from 'sharp';

export async function preprocessImage(
  inputPath: string,
  outputPath: string
) {
  await sharp(inputPath)
    .resize(1000)
    .grayscale()
    .normalize()
    .sharpen()
    .toFile(outputPath);
}

export const imageHelper = {
  preprocessImage
};
