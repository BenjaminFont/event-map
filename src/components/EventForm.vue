<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEventStore } from '../stores/eventStore'
import { useImageUpload } from '../composables/useImageUpload'
import {
  EVENT_TYPES,
  EVENT_STATUSES,
  AUDIENCE_TYPES,
  type EventType,
  type EventStatus,
  type AudienceType,
  type Feedback
} from '../types/event'
import ImageUpload from './ImageUpload.vue'

const store = useEventStore()
const { uploadImages, uploading } = useImageUpload()

const form = ref({
  title: '',
  date: '',
  endDate: '',
  locationName: '',
  lat: 0,
  lng: 0,
  eventType: 'Talk' as EventType,
  eventName: '',
  description: '',
  reference: '',
  images: [] as string[],
  status: 'planned' as EventStatus,
  hoursInvested: 0,
  company: '',
  audience: 'external' as AudienceType,
  feedback: [] as Feedback[]
})

const pendingFiles = ref<File[]>([])
const isSubmitting = ref(false)

// Feedback form
const newFeedback = ref({ text: '', author: '', company: '' })

const isEditing = computed(() => !!store.editingEvent)

watch(() => store.editingEvent, event => {
  if (event) {
    form.value = {
      title: event.title,
      date: event.date,
      endDate: event.endDate || '',
      locationName: event.location.name,
      lat: event.location.lat,
      lng: event.location.lng,
      eventType: event.eventType,
      eventName: event.eventName,
      description: event.description || '',
      reference: event.reference || '',
      images: [...event.images],
      status: event.status || 'planned',
      hoursInvested: event.hoursInvested || 0,
      company: event.company || '',
      audience: event.audience || 'external',
      feedback: event.feedback ? [...event.feedback] : []
    }
  }
}, { immediate: true })

watch(() => store.newMarkerPosition, position => {
  if (position) {
    form.value.lat = position.lat
    form.value.lng = position.lng
  }
}, { immediate: true })

function close() {
  store.closeForm()
  resetForm()
}

function resetForm() {
  form.value = {
    title: '',
    date: '',
    endDate: '',
    locationName: '',
    lat: 0,
    lng: 0,
    eventType: 'Talk',
    eventName: '',
    description: '',
    reference: '',
    images: [],
    status: 'planned',
    hoursInvested: 0,
    company: '',
    audience: 'external',
    feedback: []
  }
  pendingFiles.value = []
  newFeedback.value = { text: '', author: '', company: '' }
}

function handleFilesSelected(files: File[]) {
  pendingFiles.value = [...pendingFiles.value, ...files]
}

function removeExistingImage(index: number) {
  form.value.images.splice(index, 1)
}

function removePendingFile(index: number) {
  pendingFiles.value.splice(index, 1)
}

function addFeedback() {
  if (newFeedback.value.text && newFeedback.value.author) {
    form.value.feedback.push({
      text: newFeedback.value.text,
      author: newFeedback.value.author,
      company: newFeedback.value.company || undefined
    })
    newFeedback.value = { text: '', author: '', company: '' }
  }
}

function removeFeedback(index: number) {
  form.value.feedback.splice(index, 1)
}

async function submit() {
  if (!form.value.title || !form.value.date || !form.value.eventName) {
    alert('Please fill in required fields: Title, Date, and Event Name')
    return
  }

  isSubmitting.value = true

  try {
    const eventData = {
      title: form.value.title,
      date: form.value.date,
      endDate: form.value.endDate || undefined,
      location: {
        name: form.value.locationName,
        lat: form.value.lat,
        lng: form.value.lng
      },
      eventType: form.value.eventType,
      eventName: form.value.eventName,
      description: form.value.description || undefined,
      reference: form.value.reference || undefined,
      images: form.value.images,
      status: form.value.status,
      hoursInvested: form.value.hoursInvested || undefined,
      company: form.value.company || undefined,
      audience: form.value.audience,
      feedback: form.value.feedback.length > 0 ? form.value.feedback : undefined
    }

    let eventId: string

    if (isEditing.value && store.editingEvent) {
      eventId = store.editingEvent.id
      await store.updateEvent(eventId, eventData)
    } else {
      eventId = await store.createEvent(eventData)
    }

    if (pendingFiles.value.length > 0) {
      const uploadedUrls = await uploadImages(pendingFiles.value, eventId)
      await store.updateEvent(eventId, {
        images: [...eventData.images, ...uploadedUrls]
      })
    }

    close()
  } catch (e) {
    alert('Error saving event: ' + (e as Error).message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="form-overlay" @click.self="close">
    <div class="event-form">
      <div class="form-header">
        <h2>{{ isEditing ? 'Edit Event' : 'New Event' }}</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Talk title"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date *</label>
            <input
              id="date"
              v-model="form.date"
              type="date"
              required
            />
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="eventType">Event Type *</label>
            <select id="eventType" v-model="form.eventType" required>
              <option v-for="type in EVENT_TYPES" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" v-model="form.status" required>
              <option v-for="status in EVENT_STATUSES" :key="status" :value="status">
                {{ status === 'completed' ? 'Completed' : 'Planned' }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="eventName">Event Name *</label>
          <input
            id="eventName"
            v-model="form.eventName"
            type="text"
            required
            placeholder="e.g., Codecentric Video Day"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="audience">Audience *</label>
            <select id="audience" v-model="form.audience" required>
              <option v-for="type in AUDIENCE_TYPES" :key="type" :value="type">
                {{ type === 'internal' ? 'Internal' : 'External' }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="hoursInvested">Hours Invested</label>
            <input
              id="hoursInvested"
              v-model.number="form.hoursInvested"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="company">Company / Cooperation</label>
          <input
            id="company"
            v-model="form.company"
            type="text"
            placeholder="e.g., Hermes, BMW"
          />
        </div>

        <div class="form-group">
          <label for="locationName">Location Name</label>
          <input
            id="locationName"
            v-model="form.locationName"
            type="text"
            placeholder="e.g., Solingen Office"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="lat">Latitude</label>
            <input
              id="lat"
              v-model.number="form.lat"
              type="number"
              step="any"
              placeholder="51.1657"
            />
          </div>
          <div class="form-group">
            <label for="lng">Longitude</label>
            <input
              id="lng"
              v-model.number="form.lng"
              type="number"
              step="any"
              placeholder="7.0673"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            placeholder="Optional description"
          />
        </div>

        <div class="form-group">
          <label for="reference">Reference URL</label>
          <input
            id="reference"
            v-model="form.reference"
            type="url"
            placeholder="https://youtube.com/..."
          />
        </div>

        <div class="form-group">
          <label>Images</label>
          <ImageUpload @files-selected="handleFilesSelected" />

          <div v-if="form.images.length > 0" class="existing-images">
            <div v-for="(img, idx) in form.images" :key="img" class="image-preview">
              <img :src="img" :alt="`Image ${idx + 1}`" />
              <button type="button" class="remove-btn" @click="removeExistingImage(idx)">&times;</button>
            </div>
          </div>

          <div v-if="pendingFiles.length > 0" class="pending-files">
            <div v-for="(file, idx) in pendingFiles" :key="file.name + idx" class="file-preview">
              <span>{{ file.name }}</span>
              <button type="button" class="remove-btn" @click="removePendingFile(idx)">&times;</button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Feedback</label>
          <div v-if="form.feedback.length > 0" class="feedback-list">
            <div v-for="(fb, idx) in form.feedback" :key="idx" class="feedback-item">
              <p class="feedback-text">"{{ fb.text }}"</p>
              <p class="feedback-author">- {{ fb.author }} {{ fb.company ? `(${fb.company})` : '' }}</p>
              <button type="button" class="remove-btn small" @click="removeFeedback(idx)">&times;</button>
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

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="close">Cancel</button>
          <button type="submit" class="btn btn-submit" :disabled="isSubmitting || uploading">
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.event-form {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.form-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3B82F6;
}

textarea {
  resize: vertical;
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

.remove-btn.small {
  width: 20px;
  height: 20px;
  font-size: 14px;
  position: static;
}

.file-preview .remove-btn {
  position: static;
  width: 20px;
  height: 20px;
  font-size: 14px;
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #3B82F6;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #2563EB;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
