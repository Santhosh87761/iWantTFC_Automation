import Tesseract from 'tesseract.js';

export async function extractTextFromImage(
  imagePath: string
): Promise<string> {

  const result = await Tesseract.recognize(imagePath, 'eng');

  return result.data.text
    .replace(/\n/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();
}

export const orcHelper = {
  extractTextFromImage
};

