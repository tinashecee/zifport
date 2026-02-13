<template>
  <div class="registration-form">
    <h2 class="form-title">Referee Registration</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="refereeName">Full Name *</label>
          <input 
            type="text" 
            id="refereeName" 
            class="form-input" 
            v-model="form.name"
            placeholder="Enter referee's full name" 
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="refereeLicense">License Level *</label>
          <select id="refereeLicense" class="form-select" v-model="form.licenseLevel" required>
            <option value="">Select License Level</option>
            <option value="FIFA">FIFA Referee</option>
            <option value="CAF Elite">CAF Elite</option>
            <option value="CAF A">CAF A</option>
            <option value="CAF B">CAF B</option>
            <option value="Local">Local License</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="refereeExperience">Years of Experience *</label>
          <input 
            type="number" 
            id="refereeExperience" 
            class="form-input" 
            v-model.number="form.experience"
            placeholder="Enter years of experience" 
            min="0"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="refereeAvailability">Availability *</label>
          <select id="refereeAvailability" class="form-select" v-model="form.availability" required>
            <option value="">Select Availability</option>
            <option value="available">Available</option>
            <option value="limited">Limited Availability</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="refereeEmail">Email *</label>
          <input 
            type="email" 
            id="refereeEmail" 
            class="form-input" 
            v-model="form.contact.email"
            placeholder="referee@example.com"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="refereePhone">Phone *</label>
          <input 
            type="tel" 
            id="refereePhone" 
            class="form-input" 
            v-model="form.contact.phone"
            placeholder="+263 XXX XXX XXX"
            required
          >
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="refereeCertifications">Certifications & Qualifications</label>
        <textarea 
          id="refereeCertifications" 
          class="form-input" 
          v-model="form.certifications"
          rows="4"
          placeholder="List certifications, courses, and qualifications (one per line)"
        ></textarea>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Referee registered successfully!
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
      <i class="fas fa-whistle" style="margin-right: 8px;"></i>
      <span class="hover-underline-animation">{{ submitting ? 'Registering...' : 'Register Referee' }}</span>
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
import { useRefereesStore } from '@/stores/referees'

const refereesStore = useRefereesStore()

const form = reactive({
  name: '',
  licenseLevel: '',
  experience: 0,
  availability: '',
  contact: {
    email: '',
    phone: ''
  },
  certifications: ''
})

const error = ref('')
const success = ref(false)
const submitting = ref(false)

const resetForm = () => {
  form.name = ''
  form.licenseLevel = ''
  form.experience = 0
  form.availability = ''
  form.contact.email = ''
  form.contact.phone = ''
  form.certifications = ''
  error.value = ''
  success.value = false
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  submitting.value = true

  try {
    refereesStore.addReferee(form)
    success.value = true
    
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (err) {
    error.value = 'Failed to register referee. Please try again.'
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
