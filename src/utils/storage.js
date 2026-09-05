// Local Storage helpers for StudyMate AI

const STORAGE_KEYS = {
  TASKS: 'studymate_tasks',
  CHAT: 'studymate_chat',
}

export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.error(`Failed to load "${key}" from localStorage:`, err)
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`Failed to save "${key}" to localStorage:`, err)
    return false
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (err) {
    console.error(`Failed to remove "${key}" from localStorage:`, err)
    return false
  }
}

export const Storage = {
  tasks: {
    load: () => loadFromStorage(STORAGE_KEYS.TASKS, []),
    save: (tasks) => saveToStorage(STORAGE_KEYS.TASKS, tasks),
  },
  chat: {
    load: () => loadFromStorage(STORAGE_KEYS.CHAT, []),
    save: (messages) => saveToStorage(STORAGE_KEYS.CHAT, messages),
    clear: () => removeFromStorage(STORAGE_KEYS.CHAT),
  },
}
