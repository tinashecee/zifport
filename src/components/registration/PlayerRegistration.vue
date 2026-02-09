<template>
  <div class="registration-form">
    <h2 class="form-title">Player Registration</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="playerName">Full Name *</label>
          <input 
            type="text" 
            id="playerName" 
            class="form-input" 
            v-model="form.name"
            placeholder="Enter player's full name" 
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="playerDob">Date of Birth *</label>
          <input 
            type="date" 
            id="playerDob" 
            class="form-input" 
            v-model="form.dob"
            required
          >
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="playerPosition">Position *</label>
          <select id="playerPosition" class="form-select" v-model="form.position" required>
            <option value="">Select Position</option>
            <option value="GK">Goalkeeper</option>
            <option value="DF">Defender</option>
            <option value="MF">Midfielder</option>
            <option value="FW">Forward</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="playerClub">Club *</label>
          <input 
            type="text" 
            id="playerClub" 
            class="form-input" 
            v-model="form.club"
            placeholder="Enter club name" 
            required
          >
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="playerNationality">Nationality *</label>
          <select id="playerNationality" class="form-select" v-model="form.nationality" required>
            <option value="">Select Nationality</option>
            <option value="Zimbabwean">Zimbabwean</option>
            <option value="Dual">Dual Nationality</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="playerStatus">Eligibility Status *</label>
          <select id="playerStatus" class="form-select" v-model="form.status" required>
            <option value="">Select Status</option>
            <option value="eligible">Eligible</option>
            <option value="pending">Pending Documents</option>
            <option value="ineligible">Ineligible</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="playerEmail">Email</label>
          <input 
            type="email" 
            id="playerEmail" 
            class="form-input" 
            v-model="form.contact.email"
            placeholder="player@example.com"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="playerPhone">Phone</label>
          <input 
            type="tel" 
            id="playerPhone" 
            class="form-input" 
            v-model="form.contact.phone"
            placeholder="+263 XXX XXX XXX"
          >
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="playerAddress">Address</label>
        <textarea 
          id="playerAddress" 
          class="form-input" 
          v-model="form.contact.address"
          rows="3"
          placeholder="Enter address"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="playerAvailability">Availability *</label>
        <select id="playerAvailability" class="form-select" v-model="form.availability" required>
          <option value="">Select Availability</option>
          <option value="available">Available</option>
          <option value="injured">Injured</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Player registered successfully!
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          <span class="hover-underline-animation">{{ submitting ? 'Registering...' : 'Register Player' }}</span>
          <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
            <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
          </svg>
        </button>
        <button type="button" class="btn btn-secondary" @click="resetForm">
          <span class="hover-underline-animation">Reset Form</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
            <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { usePlayersStore } from '@/stores/players'

const playersStore = usePlayersStore()

const form = reactive({
  name: '',
  dob: '',
  position: '',
  club: '',
  nationality: '',
  status: '',
  availability: '',
  contact: {
    email: '',
    phone: '',
    address: ''
  }
})

const error = ref('')
const success = ref(false)
const submitting = ref(false)

const resetForm = () => {
  form.name = ''
  form.dob = ''
  form.position = ''
  form.club = ''
  form.nationality = ''
  form.status = ''
  form.availability = ''
  form.contact.email = ''
  form.contact.phone = ''
  form.contact.address = ''
  error.value = ''
  success.value = false
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  submitting.value = true

  try {
    const playerData = {
      ...form,
      stats: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }
    }

    playersStore.addPlayer(playerData)
    success.value = true
    
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (err) {
    error.value = 'Failed to register player. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.registration-form {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.form-title {
  color: var(--dark-green);
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-gray);
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border 0.3s;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary-green);
  outline: none;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-green);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--dark-green);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--dark-gray);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
