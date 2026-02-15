<template>
  <div class="modal" v-if="isOpen" @click.self="close">
    <div class="modal-content edit-referee-modal">
      <span class="close-modal" @click="close" aria-label="Close">&times;</span>
      <div class="modal-header">
        <h2>Edit Referee</h2>
        <p>{{ referee ? `${referee.first_name || ''} ${referee.last_name || ''}`.trim() || 'Update referee details' : '' }}</p>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit" v-if="referee">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name *</label>
            <input type="text" class="form-input" v-model="form.first_name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name *</label>
            <input type="text" class="form-input" v-model="form.last_name" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date of Birth</label>
            <input type="date" class="form-input" v-model="form.date_of_birth">
          </div>
          <div class="form-group">
            <label class="form-label">License Level *</label>
            <select class="form-select" v-model="form.license_level" required>
              <option value="FIFA">FIFA</option>
              <option value="CAF Elite">CAF Elite</option>
              <option value="CAF A">CAF A</option>
              <option value="CAF B">CAF B</option>
              <option value="Local">Local</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Years of Experience</label>
            <input type="number" class="form-input" v-model.number="form.years_of_experience" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Matches Officiated</label>
            <input type="number" class="form-input" v-model.number="form.matches_officiated" min="0">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">International Matches</label>
            <input type="number" class="form-input" v-model.number="form.international_matches" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="form.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Availability</label>
            <select class="form-select" v-model="form.availability">
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" v-model="form.email" placeholder="referee@example.com">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-input" v-model="form.phone" placeholder="+263 ...">
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <textarea class="form-input form-textarea" v-model="form.address" rows="2"></textarea>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Photo / Image URL</label>
          <input type="url" class="form-input" v-model="form.photo_url" placeholder="https://...">
          <img v-if="form.photo_url" :src="form.photo_url" class="photo-preview" alt="Preview" @error="$event.target.style.display='none'">
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="modal-btns">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span class="hover-underline-animation">{{ submitting ? 'Saving...' : 'Save Changes' }}</span>
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
import { refereesAPI } from '@/services/api'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  referee: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const error = ref('')
const successMessage = ref('')
const submitting = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  date_of_birth: '',
  nationality: 'Zimbabwean',
  license_level: 'Local',
  years_of_experience: 0,
  matches_officiated: 0,
  international_matches: 0,
  status: 'active',
  availability: 'available',
  email: '',
  phone: '',
  address: '',
  photo_url: ''
})

function fillForm(r) {
  if (!r) return
  form.first_name = r.first_name ?? ''
  form.last_name = r.last_name ?? ''
  form.date_of_birth = r.date_of_birth ? String(r.date_of_birth).slice(0, 10) : ''
  form.nationality = r.nationality ?? 'Zimbabwean'
  form.license_level = r.license_level ?? 'Local'
  form.years_of_experience = r.years_of_experience ?? 0
  form.matches_officiated = r.matches_officiated ?? 0
  form.international_matches = r.international_matches ?? 0
  form.status = r.status ?? 'active'
  form.availability = r.availability ?? 'available'
  form.email = r.email ?? ''
  form.phone = r.phone ?? ''
  form.address = r.address ?? ''
  form.photo_url = r.photo_url ?? ''
}

watch(() => [props.isOpen, props.referee], () => {
  if (props.isOpen && props.referee) {
    fillForm(props.referee)
    error.value = ''
    successMessage.value = ''
  }
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      date_of_birth: form.date_of_birth || null,
      nationality: form.nationality,
      license_level: form.license_level,
      years_of_experience: form.years_of_experience ?? 0,
      matches_officiated: form.matches_officiated ?? 0,
      international_matches: form.international_matches ?? 0,
      status: form.status,
      availability: form.availability,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      photo_url: form.photo_url?.trim() || null
    }
    const data = await refereesAPI.update(props.referee.id, payload)
    const updated = data.referee ?? data
    emit('saved', updated)
    successMessage.value = 'Saved successfully!'
    submitting.value = false
    setTimeout(() => {
      emit('close')
    }, 1200)
  } catch (err) {
    error.value = err?.message || 'Failed to update referee'
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
}

.modal-content.edit-referee-modal {
  background: white;
  padding: 32px;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  margin-bottom: 20px;
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
}

.modal-header p {
  font-family: 'Inter', sans-serif;
  color: #4a5568;
  font-size: 0.9rem;
  margin-top: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 520px) {
  .form-row { grid-template-columns: 1fr; }
}

.modal-form .form-group {
  margin-bottom: 14px;
}

.form-label {
  font-family: 'Inter', sans-serif;
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a2b4f;
}

.form-input,
.form-select,
.form-textarea {
  font-family: 'Inter', sans-serif;
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.form-textarea { resize: vertical; min-height: 60px; }

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--primary-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1);
}

.error-message {
  color: #dc3545;
  background: #fef2f2;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.success-message {
  color: #166534;
  background: #dcfce7;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  margin-bottom: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.photo-preview {
  display: block;
  margin-top: 8px;
  max-width: 120px;
  max-height: 120px;
  object-fit: cover;
  border-radius: var(--border-radius);
  border: 2px solid #e5e7eb;
}

.modal-btns {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-btns .btn { flex: 1; }

.close-modal {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 1.4rem;
  cursor: pointer;
  color: #718096;
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

