const PREFERENCES_KEY = 'moodbite_preferences'

export function getUserPreferences(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading preferences:', error)
  }

  return []
}

export function saveUserPreference(preference: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = getUserPreferences()
    if (!current.includes(preference)) {
      const updated = [...current, preference]
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
    }
  } catch (error) {
    console.error('Error saving preference:', error)
  }
}

export function clearUserPreferences(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(PREFERENCES_KEY)
  } catch (error) {
    console.error('Error clearing preferences:', error)
  }
}

