import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { isDevMode } from './useDevMode'
import { ref, computed } from 'vue'

const currentUser = ref<User | null>(null)
const loading = ref(true)

// Dev mode: auto-login with mock user
if (isDevMode) {
  currentUser.value = {
    email: 'dev@local.test',
    uid: 'dev-user-123'
  } as User
  loading.value = false
} else {
  onAuthStateChanged(auth, user => {
    currentUser.value = user
    loading.value = false
  })
}

export function useAuth() {
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!currentUser.value)

  async function signIn(email: string, password: string): Promise<void> {
    error.value = null

    // Dev mode: accept any credentials
    if (isDevMode) {
      currentUser.value = {
        email: email || 'dev@local.test',
        uid: 'dev-user-123'
      } as User
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    }
  }

  async function signOut(): Promise<void> {
    error.value = null

    // Dev mode: just clear user
    if (isDevMode) {
      currentUser.value = null
      return
    }

    try {
      await firebaseSignOut(auth)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    }
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    isDevMode: isDevMode,
    signIn,
    signOut
  }
}
