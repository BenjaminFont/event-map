<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { signIn, error } = useAuth()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await signIn(email.value, password.value)
    emit('close')
  } catch {
    // Error is handled by useAuth
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-overlay" @click.self="emit('close')">
    <div class="login-form">
      <div class="form-header">
        <h2>Admin Login</h2>
        <button class="close-btn" @click="emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="admin@example.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Password"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.login-form {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
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

label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3B82F6;
}

.error {
  color: #EF4444;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.btn-submit {
  width: 100%;
  padding: 12px 16px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
}

.btn-submit:hover:not(:disabled) {
  background: #2563EB;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
