/**
 * Types for optimized image variants
 */
export interface OptimizedVariants {
    mobile: string;  // 480w
    tablet: string;  // 800w
    desktop: string; // 1200w
}

/**
 * Resizes an image to a specific width and returns it as a WebP Data URI.
 */
const resizeAndConvert = (img: HTMLImageElement, width: number): string => {
    const canvas = document.createElement('canvas');
    const scaleFactor = width / img.width;
    
    // If image is smaller than target, keep original size
    const finalWidth = scaleFactor < 1 ? width : img.width;
    const finalHeight = scaleFactor < 1 ? img.height * scaleFactor : img.height;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Draw and convert
    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
    
    // Return WebP at 80% quality
    return canvas.toDataURL('image/webp', 0.8);
};

/**
 * Main processing function.
 * Takes a File object, generates 3 responsive WebP variants.
 */
export const processImage = (file: File): Promise<OptimizedVariants> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const variants: OptimizedVariants = {
                        mobile: resizeAndConvert(img, 480),
                        tablet: resizeAndConvert(img, 800),
                        desktop: resizeAndConvert(img, 1200)
                    };
                    resolve(variants);
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};