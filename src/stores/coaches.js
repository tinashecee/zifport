import { defineStore } from 'pinia'
import { ref } from 'vue'
import { coachesAPI } from '@/services/api'

export const useCoachesStore = defineStore('coaches', () => {
  const coaches = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadCoaches = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await coachesAPI.getAll()
      coaches.value = Array.isArray(data) ? data : (data.coaches || [])
    } catch (err) {
      error.value = err.message
      console.error('Error loading coaches:', err)
      coaches.value = []
    } finally {
      loading.value = false
    }
  }

  const addCoach = async (coachData) => {
    loading.value = true
    error.value = null
    try {
      const newCoach = await coachesAPI.create(coachData)
      await loadCoaches() // Reload to get updated list
      return newCoach
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCoach = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedCoach = await coachesAPI.update(id, updates)
      await loadCoaches() // Reload to get updated list
      return updatedCoach
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCoach = async (id) => {
    loading.value = true
    error.value = null
    try {
      await coachesAPI.delete(id)
      await loadCoaches() // Reload to get updated list
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCoachById = (id) => {
    return coaches.value.find(c => c.id === id)
  }

  return {
    coaches,
    loading,
    error,
    loadCoaches,
    addCoach,
    updateCoach,
    deleteCoach,
    getCoachById
  }
})
