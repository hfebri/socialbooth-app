export type CompressOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.82,
  mimeType: "image/jpeg",
}

export async function compressDataUrl(dataUrl: string, options: CompressOptions = {}) {
  if (typeof window === "undefined") {
    return dataUrl
  }

  const { maxWidth, maxHeight, quality, mimeType } = { ...DEFAULT_OPTIONS, ...options }

  return new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
      const targetWidth = Math.max(Math.round(image.width * scale), 1)
      const targetHeight = Math.max(Math.round(image.height * scale), 1)

      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight

      const context = canvas.getContext("2d")
      if (!context) {
        reject(new Error("Unable to create 2D context for compression"))
        return
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight)
      try {
        const compressed = canvas.toDataURL(mimeType, quality)
        resolve(compressed)
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Compression failed"))
      }
    }

    image.onerror = () => {
      reject(new Error("Failed to load image for compression"))
    }

    image.src = dataUrl
  })
}
