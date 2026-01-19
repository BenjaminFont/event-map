<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleFiles(Array.from(files))
    target.value = ''
  }
}

function handleFiles(files: File[]) {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (imageFiles.length > 0) {
    emit('files-selected', imageFiles)
  }
}

function openFilePicker() {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="upload-zone"
    :class="{ dragging: isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFilePicker"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      hidden
      @change="handleFileInput"
    />
    <div class="upload-content">
      <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>Drag & drop images here or click to select</p>
    </div>
  </div>
</template>

<style scoped>
.upload-zone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover,
.upload-zone.dragging {
  border-color: #3B82F6;
  background: #f0f7ff;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  width: 40px;
  height: 40px;
  color: #9CA3AF;
  margin-bottom: 10px;
}

.upload-zone:hover .upload-icon,
.upload-zone.dragging .upload-icon {
  color: #3B82F6;
}

p {
  margin: 0;
  color: #6B7280;
  font-size: 0.9rem;
}
</style>
