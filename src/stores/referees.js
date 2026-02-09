import { defineStore } from 'pinia'
import { ref } from 'vue'
import { refereesAPI } from '@/services/api'

export const useRefereesStore = defineStore('referees', () => {
  const referees = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadReferees = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await refereesAPI.getAll()
      referees.value = Array.isArray(data) ? data : (data.referees || [])
    } catch (err) {
      error.value = err.message
      console.error('Error loading referees:', err)
      referees.value = []
    } finally {
      loading.value = false
    }
  }

  const addReferee = async (refereeData) => {
    loading.value = true
    error.value = null
    try {
      const newReferee = await refereesAPI.create(refereeData)
      await loadReferees() // Reload to get updated list
      return newReferee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReferee = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedReferee = await refereesAPI.update(id, updates)
      await loadReferees() // Reload to get updated list
      return updatedReferee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReferee = async (id) => {
    loading.value = true
    error.value = null
    try {
      await refereesAPI.delete(id)
      await loadReferees() // Reload to get updated list
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getRefereeById = (id) => {
    return referees.value.find(r => r.id === id)
  }

  return {
    referees,
    loading,
    error,
    loadReferees,
    addReferee,
    updateReferee,
    deleteReferee,
    getRefereeById
  }
})
