import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { isDevMode } from './useDevMode'
import { ref, computed } from 'vue'
import type { UserRole } from '../types/event'

const currentUser = ref<User | null>(null)
const loading = ref(true)
const userRole = ref<UserRole | null>(null)

// Dev mode: reactive role for toggling
const devRole = ref<UserRole>('admin')

async function fetchUserRole(uid: string): Promise<UserRole> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return 'admin'
    }
  } catch {
    // If fetch fails, default to readonly
  }
  return 'readonly'
}

// Dev mode: auto-login with mock user
if (isDevMode) {
  currentUser.value = {
    email: 'dev@local.test',
    uid: 'dev-user-123'
  } as User
  userRole.value = devRole.value
  loading.value = false
} else {
  onAuthStateChanged(auth, async user => {
    currentUser.value = user
    if (user) {
      userRole.value = await fetchUserRole(user.uid)
    } else {
      userRole.value = null
    }
    loading.value = false
  })
}

export function useAuth() {
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => {
    if (isDevMode) return devRole.value === 'admin'
    return userRole.value === 'admin'
  })

  function setDevRole(role: UserRole) {
    devRole.value = role
    userRole.value = role
  }

  async function signIn(email: string, password: string): Promise<void> {
    error.value = null

    // Dev mode: accept any credentials
    if (isDevMode) {
      currentUser.value = {
        email: email || 'dev@local.test',
        uid: 'dev-user-123'
      } as User
      userRole.value = devRole.value
      return
    }

    try {
      loading.value = true
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      loading.value = false
      error.value = (e as Error).message
      throw e
    }
  }

  async function signOut(): Promise<void> {
    error.value = null

    // Dev mode: just clear user
    if (isDevMode) {
      currentUser.value = null
      userRole.value = null
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
    isAdmin,
    userRole,
    devRole,
    isDevMode: isDevMode,
    setDevRole,
    signIn,
    signOut
  }
}
