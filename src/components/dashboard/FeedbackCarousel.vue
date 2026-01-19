<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Feedback } from '../../types/event'

const props = defineProps<{
  feedbackItems: Feedback[]
}>()

const currentIndex = ref(0)

const currentFeedback = computed(() => {
  if (props.feedbackItems.length === 0) return null
  return props.feedbackItems[currentIndex.value]
})

const totalItems = computed(() => props.feedbackItems.length)

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function next() {
  if (currentIndex.value < props.feedbackItems.length - 1) {
    currentIndex.value++
  }
}
</script>

<template>
  <div class="feedback-carousel">
    <div class="carousel-header">
      <h3>Feedback</h3>
      <div v-if="totalItems > 0" class="navigation">
        <button class="nav-btn" :disabled="currentIndex === 0" @click="prev">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span class="counter">{{ currentIndex + 1 }} / {{ totalItems }}</span>
        <button class="nav-btn" :disabled="currentIndex === totalItems - 1" @click="next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="currentFeedback" class="feedback-content">
      <p class="quote">"{{ currentFeedback.text }}"</p>
      <p class="author">
        - {{ currentFeedback.author }}
        <span v-if="currentFeedback.company">({{ currentFeedback.company }})</span>
      </p>
    </div>

    <div v-else class="empty-state">
      <p>No feedback yet</p>
    </div>
  </div>
</template>

<style scoped>
.feedback-carousel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.carousel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6B7280;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background: #F3F4F6;
  color: #374151;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.counter {
  font-size: 0.85rem;
  color: #6B7280;
  min-width: 50px;
  text-align: center;
}

.feedback-content {
  flex: 1;
}

.quote {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 12px;
}

.author {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  font-size: 0.9rem;
}
</style>
