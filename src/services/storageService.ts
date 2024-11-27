import sharp from 'sharp';
import fs from 'fs/promises';
import { unlink } from 'fs';

interface ProcessedImage {
  data: Buffer;
  info: sharp.OutputInfo;
}

/**
 * Service that reads and returns an image suitable for an OCR task
 * @param imagePath - The path where to read the image
 * @returns Promise<ProcessedImage> The processed image for OCR
 * @throws Error if image processing fails or file doesn't exist
 */
async function getOcrImage(imagePath: string): Promise<ProcessedImage> {
  try {
    // Verify file exists before processing
    await fs.access(imagePath);
    
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata) {
      throw new Error('Failed to read image metadata');
    }

    // If image has alpha channel (transparency)
    if (metadata.hasAlpha) {
      return await image
        .removeAlpha()
        .ensureAlpha()
        .composite([
          {
            input: Buffer.from([255, 255, 255, 255]),
            raw: {
              width: 1,
              height: 1,
              channels: 4
            },
            tile: true,
            blend: 'dest-over'
          }
        ])
        .toColorspace('srgb')
        .toBuffer({ resolveWithObject: true });
    }

    // If image doesn't have alpha channel
    return await image
      .toColorspace('srgb')
      .toBuffer({ resolveWithObject: true });
  } catch (error: unknown) {
    console.error('Error processing OCR image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process OCR image: ${error.message}`);
    }
    throw new Error('Failed to process OCR image: Unknown error');
  }
}

/**
 * Service that reads and returns an image suitable for Object/KeyPoints detection
 * @param imagePath - The path where to read the image
 * @returns Promise<ProcessedImage> The processed image for prediction
 * @throws Error if image processing fails or file doesn't exist
 */
async function getPredictImage(imagePath: string): Promise<ProcessedImage> {
  try {
    // Verify file exists before processing
    await fs.access(imagePath);
    
    const image = sharp(imagePath);
    return await image
      .toColorspace('srgb')
      .toBuffer({ resolveWithObject: true });
  } catch (error) {
    console.error('Error processing predict image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process predict image: ${error.message}`);
    }
    throw new Error('Failed to process predict image: Unknown error');
  }
}

/**
 * Service that returns the images for OCR and Object/KeyPoints detection tasks
 * @param path - The local path where the image is downloaded
 * @returns Promise<[ProcessedImage, ProcessedImage]> Tuple of processed images for OCR and predictions
 * @throws Error if image processing fails or file operations fail
 */
async function getOcrAndPredictImages(
  path: string
): Promise<[ProcessedImage, ProcessedImage]> {
  try {
    // Verify file exists before processing
    await fs.access(path);

    const [ocrImg, predictImg] = await Promise.all([
      getOcrImage(path),
      getPredictImage(path)
    ]);

    try {
      // Remove temporary file using fs.promises instead of callback
      await fs.unlink(path);
    } catch (unlinkError) {
      console.warn(`Failed to remove temporary file ${path}:`, unlinkError);
      // Continue execution even if file deletion fails
    }

    return [ocrImg, predictImg];
  } catch (error) {
    console.error('Error processing images:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process images: ${error.message}`);
    }
    throw new Error('Failed to process images: Unknown error');
  }
}

export const storageService = {
  getOcrImage,
  getPredictImage,
  getOcrAndPredictImages,
};
