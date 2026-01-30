<script setup lang="ts">
import { ref } from 'vue'
import type { Feedback } from '../types/event'

defineProps<{
  feedback: Feedback[]
}>()

const emit = defineEmits<{
  (e: 'add', entry: Feedback): void
  (e: 'remove', index: number): void
}>()

const newFeedback = ref({ text: '', author: '', company: '' })

function addFeedback() {
  if (newFeedback.value.text && newFeedback.value.author) {
    emit('add', {
      text: newFeedback.value.text,
      author: newFeedback.value.author,
      company: newFeedback.value.company || undefined
    })
    newFeedback.value = { text: '', author: '', company: '' }
  }
}
</script>

<template>
  <div class="form-group">
    <label>Feedback</label>
    <div v-if="feedback.length > 0" class="feedback-list">
      <div v-for="(fb, idx) in feedback" :key="idx" class="feedback-item">
        <p class="feedback-text">"{{ fb.text }}"</p>
        <p class="feedback-author">- {{ fb.author }} {{ fb.company ? `(${fb.company})` : '' }}</p>
        <button type="button" class="remove-btn small" @click="$emit('remove', idx)">&times;</button>
      </div>
    </div>
    <div class="add-feedback">
      <textarea
        v-model="newFeedback.text"
        rows="2"
        placeholder="Feedback text..."
      />
      <div class="feedback-inputs">
        <input
          v-model="newFeedback.author"
          type="text"
          placeholder="Author name"
        />
        <input
          v-model="newFeedback.company"
          type="text"
          placeholder="Company (optional)"
        />
        <button type="button" class="btn btn-add-feedback" @click="addFeedback">Add</button>
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

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3B82F6;
}

textarea {
  resize: vertical;
}

.feedback-list {
  margin-bottom: 12px;
}

.feedback-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  position: relative;
}

.feedback-text {
  margin: 0 0 4px;
  font-size: 0.9rem;
  font-style: italic;
}

.feedback-author {
  margin: 0;
  font-size: 0.8rem;
  color: #6B7280;
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

.remove-btn.small {
  width: 20px;
  height: 20px;
  font-size: 14px;
  position: static;
}

.feedback-item .remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.add-feedback {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
}

.btn-add-feedback {
  background: #E5E7EB;
  color: #374151;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-add-feedback:hover {
  background: #D1D5DB;
}
</style>
