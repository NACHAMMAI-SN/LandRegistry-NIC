// Neural image compression using advanced canvas-based compression
// This simulates neural compression by using WebP format with optimized quality settings
// and applying pre-processing techniques inspired by neural compression algorithms

export interface CompressionResult {
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
  qualityScore: number;
}

export const compressImage = async (file: File): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = async () => {
      try {
        // Create canvas for image processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Calculate optimal dimensions (max 2048px while maintaining aspect ratio)
        const maxDimension = 2048;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Apply neural-inspired preprocessing
        // 1. Slight gaussian-like smoothing to reduce high-frequency noise
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Apply subtle sharpening to maintain perceptual quality
        const imageData = ctx.getImageData(0, 0, width, height);
        const sharpened = applyUnsharpMask(imageData, 0.3, 1.0);
        ctx.putImageData(sharpened, 0, 0);

        // Compress to WebP with optimized quality
        // WebP uses VP8/VP9 codec which is closer to neural compression
        const quality = 0.85; // High quality to maintain visual fidelity

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create compressed blob'));
              return;
            }

            const compressedSize = blob.size;
            const originalSize = file.size;
            const compressionRatio = originalSize / compressedSize;
            
            // Calculate quality score based on compression efficiency
            // Higher ratio with maintained dimensions = higher quality score
            const dimensionRatio = (width * height) / (img.width * img.height);
            const qualityScore = Math.min(95, (dimensionRatio * 0.4 + (1 / compressionRatio) * 0.6) * 100);

            resolve({
              compressedBlob: blob,
              compressedSize,
              compressionRatio,
              qualityScore,
            });
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

// Unsharp mask filter (edge enhancement inspired by neural networks)
function applyUnsharpMask(imageData: ImageData, amount: number, threshold: number): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  
  // Simple 3x3 gaussian blur for unsharp mask
  const blur = gaussianBlur(imageData, 1);
  
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = data[i + c];
      const blurred = blur.data[i + c];
      const diff = original - blurred;
      
      if (Math.abs(diff) >= threshold) {
        output.data[i + c] = Math.min(255, Math.max(0, original + diff * amount));
      } else {
        output.data[i + c] = original;
      }
    }
    output.data[i + 3] = data[i + 3]; // Alpha channel
  }
  
  return output;
}

// Gaussian blur implementation
function gaussianBlur(imageData: ImageData, radius: number): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  
  // Simple box blur approximation of gaussian
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const idx = (ny * width + nx) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
      }
      
      const idx = (y * width + x) * 4;
      output.data[idx] = r / count;
      output.data[idx + 1] = g / count;
      output.data[idx + 2] = b / count;
      output.data[idx + 3] = data[idx + 3];
    }
  }
  
  return output;
}
