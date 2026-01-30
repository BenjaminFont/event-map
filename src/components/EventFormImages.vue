<script setup lang="ts">
import ImageUpload from './ImageUpload.vue'

defineProps<{
  images: string[]
  pendingFiles: File[]
}>()

defineEmits<{
  (e: 'files-selected', files: File[]): void
  (e: 'remove-image', index: number): void
  (e: 'remove-pending-file', index: number): void
}>()
</script>

<template>
  <div class="form-group">
    <label>Images</label>
    <ImageUpload @files-selected="$emit('files-selected', $event)" />

    <div v-if="images.length > 0" class="existing-images">
      <div v-for="(img, idx) in images" :key="img" class="image-preview">
        <img :src="img" :alt="`Image ${idx + 1}`" />
        <button type="button" class="remove-btn" @click="$emit('remove-image', idx)">&times;</button>
      </div>
    </div>

    <div v-if="pendingFiles.length > 0" class="pending-files">
      <div v-for="(file, idx) in pendingFiles" :key="file.name + idx" class="file-preview">
        <span>{{ file.name }}</span>
        <button type="button" class="remove-btn" @click="$emit('remove-pending-file', idx)">&times;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.existing-images,
.pending-files {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview {
  position: relative;
  width: 80px;
  height: 80px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.85rem;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #EF4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview .remove-btn {
  position: static;
  width: 20px;
  height: 20px;
  font-size: 14px;
}
</style>
