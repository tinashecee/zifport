<template>
  <div class="referee-profile">
    <div v-if="loading" class="loading container">
      <p>Loading referee...</p>
    </div>
    
    <div v-else-if="error" class="error container">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="$router.push('/referees')">
        <span class="hover-underline-animation">Back to Referees</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
          <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
        </svg>
      </button>
    </div>

    <div v-else-if="referee" class="profile-content">
        <button class="back-btn" @click="$router.back()">
          <i class="fas fa-arrow-left"></i> Back
        </button>

        <!-- Referee Header -->
        <div class="referee-header">
          <div class="container">
            <div class="referee-basic-info">
              <div class="referee-image-container">
                <img 
                  v-if="referee.photo_url" 
                  :src="referee.photo_url" 
                  :alt="refereeName"
                  class="referee-photo"
                />
                <div v-else class="referee-photo-placeholder">
                  <i class="fas fa-whistle"></i>
                </div>
              </div>
              <div class="referee-details">
                <h1>{{ refereeName }}</h1>
                <div class="referee-nationality">
                  <i class="fas fa-flag"></i> {{ referee.nationality || 'Zimbabwean' }}
                  <span class="badge-zifa">{{ refereeZifaId }}</span>
                </div>
                <div class="referee-badges">
                  <span class="badge-license">{{ refereeLicenseLevel }}</span>
                  <span class="status-badge" :class="getStatusClass(referee.status)">
                    {{ referee.status ? referee.status.toUpperCase() : 'ACTIVE' }}
                  </span>
                  <span v-if="refereeAge !== 'N/A'" class="referee-age">
                    <i class="fas fa-birthday-cake"></i> Age: {{ refereeAge }}
                  </span>
                </div>
                <div class="referee-availability">
                  <span class="availability-badge" :class="getAvailabilityClass(referee.availability)">
                    {{ getAvailabilityText(referee.availability) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Bar -->
        <div class="container">
          <div class="referee-stats-bar">
          <div class="stat-item">
            <div class="stat-value">{{ referee.years_of_experience || 0 }}</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ referee.matches_officiated || 0 }}</div>
            <div class="stat-label">Matches Officiated</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ referee.international_matches || 0 }}</div>
            <div class="stat-label">International Matches</div>
          </div>
          <div v-if="referee.license_expiry_date" class="stat-item">
            <div class="stat-value">{{ formatDateShort(referee.license_expiry_date) }}</div>
            <div class="stat-label">License Expiry</div>
          </div>
          </div>
        </div>

        <!-- Referee Tabs -->
        <div class="container">
          <div class="referee-tabs">
          <ul class="nav-tabs-zifa">
            <li class="nav-tab-item active">
              <button class="nav-tab-link" @click="activeTab = 'overview'">
                <i class="fas fa-user-circle"></i> Overview
              </button>
            </li>
            <li class="nav-tab-item">
              <button class="nav-tab-link" @click="activeTab = 'experience'">
                <i class="fas fa-briefcase"></i> Experience
              </button>
            </li>
            <li class="nav-tab-item">
              <button class="nav-tab-link" @click="activeTab = 'documents'">
                <i class="fas fa-file-alt"></i> Documents & Qualifications
              </button>
            </li>
          </ul>

          <div class="tab-content">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-pane">
              <div class="info-cards-grid">
                <div class="info-card">
                  <h4>Personal Information</h4>
                  <div class="info-item">
                    <span class="info-label">Full Name</span>
                    <span class="info-value">{{ refereeName }}</span>
                  </div>
                  <div class="info-item" v-if="referee.date_of_birth">
                    <span class="info-label">Date of Birth</span>
                    <span class="info-value">{{ formatDate(referee.date_of_birth) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nationality</span>
                    <span class="info-value">{{ referee.nationality || 'Zimbabwean' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">License Level</span>
                    <span class="info-value">{{ refereeLicenseLevel }}</span>
                  </div>
                  <div class="info-item" v-if="referee.license_number">
                    <span class="info-label">License Number</span>
                    <span class="info-value">{{ referee.license_number }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Status & Availability</h4>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">{{ referee.status || 'active' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Availability</span>
                    <span class="info-value">{{ getAvailabilityText(referee.availability) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Years of Experience</span>
                    <span class="info-value">{{ referee.years_of_experience || 0 }} years</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Total Matches</span>
                    <span class="info-value">{{ referee.matches_officiated || 0 }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">International Matches</span>
                    <span class="info-value">{{ referee.international_matches || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <h4>Contact Information</h4>
                <div class="info-item" v-if="referee.email">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ referee.email }}</span>
                </div>
                <div class="info-item" v-if="referee.phone">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ referee.phone }}</span>
                </div>
                <div class="info-item" v-if="referee.address">
                  <span class="info-label">Address</span>
                  <span class="info-value">{{ referee.address }}</span>
                </div>
              </div>
            </div>

            <!-- Experience Tab -->
            <div v-if="activeTab === 'experience'" class="tab-pane">
              <div class="info-card">
                <h4>Refereeing Experience</h4>
                <div class="info-item">
                  <span class="info-label">Years of Experience</span>
                  <span class="info-value">{{ referee.years_of_experience || 0 }} years</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total Matches Officiated</span>
                  <span class="info-value">{{ referee.matches_officiated || 0 }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">International Matches</span>
                  <span class="info-value">{{ referee.international_matches || 0 }}</span>
                </div>
                <div class="info-item" v-if="referee.bio">
                  <span class="info-label">Biography</span>
                  <span class="info-value">{{ referee.bio }}</span>
                </div>
                <div class="info-item" v-if="referee.notes">
                  <span class="info-label">Notes</span>
                  <span class="info-value">{{ referee.notes }}</span>
                </div>
              </div>
            </div>

            <!-- Documents Tab -->
            <div v-if="activeTab === 'documents'" class="tab-pane">
              <div class="info-cards-grid">
                <div class="info-card">
                  <h4>License Information</h4>
                  <div class="info-item">
                    <span class="info-label">License Level</span>
                    <span class="info-value">{{ refereeLicenseLevel }}</span>
                  </div>
                  <div class="info-item" v-if="referee.license_number">
                    <span class="info-label">License Number</span>
                    <span class="info-value">{{ referee.license_number }}</span>
                  </div>
                  <div class="info-item" v-if="referee.license_expiry_date">
                    <span class="info-label">License Expiry Date</span>
                    <span class="info-value">{{ formatDate(referee.license_expiry_date) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">{{ referee.status || 'active' }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Document Status</h4>
                  <div class="info-item">
                    <span class="info-label">Photo</span>
                    <span class="info-value">
                      <i v-if="referee.photo_url" class="fas fa-check text-success"></i>
                      <i v-else class="fas fa-times text-danger"></i>
                      {{ referee.photo_url ? 'Uploaded' : 'Not Uploaded' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found container">
      <h2>Referee not found</h2>
      <p>The referee you're looking for doesn't exist.</p>
      <button class="btn btn-primary" @click="$router.push('/referees')">
        <span class="hover-underline-animation">Browse Referees</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
          <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRefereesStore } from '@/stores/referees'
import { refereesAPI } from '@/services/api'

const route = useRoute()
const refereesStore = useRefereesStore()
const referee = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('overview')

const refereeName = computed(() => {
  if (!referee.value) return ''
  if (referee.value.first_name && referee.value.last_name) {
    return `${referee.value.first_name} ${referee.value.last_name}`
  }
  return referee.value.name || 'Unknown Referee'
})

const refereeZifaId = computed(() => {
  if (!referee.value) return ''
  return referee.value.zifa_id || `ZIFA-${String(referee.value.id).padStart(5, '0')}`
})

const refereeLicenseLevel = computed(() => {
  if (!referee.value) return 'N/A'
  return referee.value.license_level || referee.value.level || 'N/A'
})

const refereeAge = computed(() => {
  if (!referee.value) return 'N/A'
  if (referee.value.date_of_birth) {
    const birthDate = new Date(referee.value.date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  return 'N/A'
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusClass = (status) => {
  if (status === 'active') return 'status-available'
  if (status === 'inactive') return 'status-unknown'
  if (status === 'suspended') return 'status-injured'
  return 'status-unknown'
}

const getAvailabilityClass = (availability) => {
  if (availability === 'available') return 'status-available'
  if (availability === 'limited') return 'status-unknown'
  if (availability === 'unavailable') return 'status-injured'
  return 'status-unknown'
}

const getAvailabilityText = (availability) => {
  const texts = {
    'available': 'Available',
    'limited': 'Limited',
    'unavailable': 'Unavailable'
  }
  return texts[availability] || 'Unknown'
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const data = await refereesAPI.getById(route.params.id)
    referee.value = data.referee || data
  } catch (err) {
    error.value = err.message || 'Failed to load referee'
    console.error('Error loading referee:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.referee-profile {
  padding: 0;
  min-height: calc(100vh - 200px);
  background-color: #f5f5f5;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: 1rem;
  cursor: pointer;
  margin: 20px 0 0 20px;
  padding: 8px 0;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
}

.back-btn:hover {
  text-decoration: underline;
  transform: translateX(-5px);
}

/* Referee Header */
.referee-header {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 60px 0 30px;
  position: relative;
}

.referee-basic-info {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.referee-image-container {
  flex-shrink: 0;
}

.referee-photo {
  width: 200px;
  height: 280px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.referee-photo-placeholder {
  width: 200px;
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.referee-details {
  flex: 1;
  min-width: 250px;
}

.referee-details h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: white;
}

.referee-nationality {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge-zifa {
  background-color: var(--primary-green);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 10px;
}

.referee-badges {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.badge-license {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.status-badge.status-available {
  background-color: rgba(76, 175, 80, 0.8);
}

.status-badge.status-pending {
  background-color: rgba(255, 193, 7, 0.8);
}

.status-badge.status-injured {
  background-color: rgba(244, 67, 54, 0.8);
}

.referee-age {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.referee-availability {
  margin-top: 15px;
}

.availability-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  display: inline-block;
}

.availability-badge.status-available {
  background-color: rgba(76, 175, 80, 0.8);
}

.availability-badge.status-unknown {
  background-color: rgba(255, 193, 7, 0.8);
}

.availability-badge.status-injured {
  background-color: rgba(244, 67, 54, 0.8);
}

/* Quick Stats Bar */
.referee-stats-bar {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin: -30px auto 30px;
  max-width: 1200px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-green);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--medium-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Referee Tabs */
.referee-tabs {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  margin: 30px auto;
  max-width: 1200px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.nav-tabs-zifa {
  display: flex;
  border-bottom: 3px solid var(--light-gray);
  background: var(--light-gray);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-tab-item {
  flex: 1;
}

.nav-tab-link {
  width: 100%;
  color: var(--medium-gray);
  font-weight: 600;
  padding: 15px 25px;
  border: none;
  background: transparent;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
}

.nav-tab-link:hover {
  color: var(--primary-green);
  background: rgba(30, 126, 52, 0.05);
}

.nav-tab-item.active .nav-tab-link {
  color: var(--primary-green);
  background: white;
  border-bottom: 3px solid var(--primary-green);
}

.tab-content {
  padding: 30px;
}

.tab-pane {
  display: block;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  border-left: 4px solid var(--primary-green);
}

.info-card h4 {
  color: var(--dark-green);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--light-gray);
  font-size: 1.3rem;
  font-weight: 600;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--medium-gray);
  font-size: 0.9rem;
}

.info-value {
  color: #333;
  font-weight: 500;
  text-align: right;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 60px 20px;
}

.loading p, .error h2, .not-found h2 {
  color: var(--dark-gray);
  margin-bottom: 15px;
}

.error p, .not-found p {
  color: var(--medium-gray);
  margin-bottom: 30px;
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

.btn-primary:hover {
  background-color: var(--dark-green);
}

@media (max-width: 768px) {
  .referee-basic-info {
    flex-direction: column;
    text-align: center;
  }

  .referee-details h1 {
    font-size: 2rem;
  }

  .referee-stats-bar {
    grid-template-columns: repeat(2, 1fr);
    margin: -20px 20px 20px;
  }

  .nav-tabs-zifa {
    flex-direction: column;
  }

  .nav-tab-link {
    justify-content: flex-start;
    padding: 12px 20px;
  }

  .info-cards-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .info-value {
    text-align: left;
  }

  .tab-content {
    padding: 20px;
  }
}
</style>
