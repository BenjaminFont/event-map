import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'
import { ref } from 'vue'

export function useImageUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)

  async function uploadImage(file: File, eventId: string): Promise<string> {
    uploading.value = true
    error.value = null
    progress.value = 0

    try {
      const filename = `${Date.now()}-${file.name}`
      const imageRef = storageRef(storage, `events/${eventId}/${filename}`)

      await uploadBytes(imageRef, file)
      progress.value = 100

      const url = await getDownloadURL(imageRef)
      return url
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      uploading.value = false
    }
  }

  async function uploadImages(files: File[], eventId: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const url = await uploadImage(file, eventId)
      urls.push(url)
    }
    return urls
  }

  async function deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = storageRef(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    }
  }

  return {
    uploading,
    error,
    progress,
    uploadImage,
    uploadImages,
    deleteImage
  }
}
