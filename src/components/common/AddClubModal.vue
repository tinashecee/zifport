<template>
  <div class="modal" v-if="isOpen" @click.self="close">
    <div class="modal-content add-club-modal">
      <span class="close-modal" @click="close" aria-label="Close">&times;</span>
      <div class="modal-header">
        <h2>Add New Club</h2>
        <p>Register a club to assign to players</p>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="clubName">Name *</label>
            <input
              id="clubName"
              type="text"
              class="form-input"
              v-model="form.name"
              placeholder="e.g. Dynamos FC"
              maxlength="255"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="clubAbbr">Abbreviation</label>
            <input
              id="clubAbbr"
              type="text"
              class="form-input"
              v-model="form.abbreviation"
              placeholder="e.g. DFC"
              maxlength="10"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="clubCity">City</label>
            <input
              id="clubCity"
              type="text"
              class="form-input"
              v-model="form.city"
              placeholder="e.g. Harare"
              maxlength="100"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="clubCountry">Country *</label>
            <select
              id="clubCountry"
              class="form-select"
              v-model="form.country"
              required
            >
              <option value="">Select country</option>
              <option v-for="c in countriesList" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="clubFounded">Founded Year</label>
          <input
            id="clubFounded"
            type="number"
            class="form-input"
            v-model.number="form.founded_year"
            placeholder="e.g. 1963"
            min="1800"
            :max="currentYear"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="clubLogo">Logo URL</label>
          <input
            id="clubLogo"
            type="url"
            class="form-input"
            v-model="form.logo_url"
            placeholder="https://..."
            maxlength="500"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="clubWebsite">Website</label>
          <input
            id="clubWebsite"
            type="url"
            class="form-input"
            v-model="form.website"
            placeholder="https://..."
            maxlength="255"
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="clubContactEmail">Contact Email</label>
            <input
              id="clubContactEmail"
              type="email"
              class="form-input"
              v-model="form.contact_email"
              placeholder="club@example.com"
              maxlength="255"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="clubContactPhone">Contact Phone</label>
            <input
              id="clubContactPhone"
              type="tel"
              class="form-input"
              v-model="form.contact_phone"
              placeholder="+263 ..."
              maxlength="20"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="clubAddress">Address</label>
          <textarea
            id="clubAddress"
            class="form-input form-textarea"
            v-model="form.address"
            rows="3"
            placeholder="Street, city, postal code"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="modal-btns">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span class="hover-underline-animation">{{ submitting ? 'Saving...' : 'Add Club' }}</span>
            <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
              <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
            </svg>
          </button>
          <button type="button" class="btn btn-secondary" @click="close" :disabled="submitting">
            <span class="hover-underline-animation">Cancel</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
              <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { clubsAPI } from '@/services/api'
import { countries } from '@/data/countries'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'saved'])

const currentYear = new Date().getFullYear()
const countriesList = countries
const error = ref('')
const submitting = ref(false)

const form = reactive({
  name: '',
  abbreviation: '',
  city: '',
  country: 'Zimbabwe',
  founded_year: null,
  logo_url: '',
  website: '',
  contact_email: '',
  contact_phone: '',
  address: ''
})

function resetForm() {
  form.name = ''
  form.abbreviation = ''
  form.city = ''
  form.country = 'Zimbabwe'
  form.founded_year = null
  form.logo_url = ''
  form.website = ''
  form.contact_email = ''
  form.contact_phone = ''
  form.address = ''
  error.value = ''
}

watch(() => props.isOpen, (open) => {
  if (open) resetForm()
})

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      country: form.country.trim() || 'Zimbabwe',
      abbreviation: form.abbreviation.trim() || undefined,
      city: form.city.trim() || undefined,
      founded_year: form.founded_year && form.founded_year >= 1800 ? form.founded_year : undefined,
      logo_url: form.logo_url.trim() || undefined,
      website: form.website.trim() || undefined,
      contact_email: form.contact_email.trim() || undefined,
      contact_phone: form.contact_phone.trim() || undefined,
      address: form.address.trim() || undefined
    }
    const data = await clubsAPI.create(payload)
    const club = data.club
    if (club) {
      emit('saved', club)
      close()
    } else {
      error.value = 'Unexpected response from server'
    }
  } catch (err) {
    error.value = err?.message || 'Failed to add club'
  } finally {
    submitting.value = false
  }
}

function close() {
  if (!submitting.value) emit('close')
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content.add-club-modal {
  background-color: white;
  padding: 40px;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  margin-bottom: 24px;
  text-align: center;
}

.modal-header h2 {
  font-family: 'Poppins', sans-serif;
  color: #1a2b4f;
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.modal-header p {
  font-family: 'Inter', sans-serif;
  color: #4a5568;
  font-size: 0.95rem;
  margin-top: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 520px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.modal-form .form-group {
  margin-bottom: 18px;
}

.form-label {
  font-family: 'Inter', sans-serif;
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a2b4f;
}

.form-input,
.form-select,
.form-textarea {
  font-family: 'Inter', sans-serif;
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--primary-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1);
}

.error-message {
  color: #dc3545;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  margin-bottom: 16px;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.modal-btns {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-btns .btn {
  flex: 1;
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s, background 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal:hover {
  color: #1a2b4f;
  background: #edf2f7;
}
</style>
