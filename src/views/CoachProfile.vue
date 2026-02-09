<template>
  <div class="coach-profile">
    <div v-if="loading" class="loading container">
      <p>Loading coach...</p>
    </div>
    
    <div v-else-if="error" class="error container">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="$router.push('/coaches')">
        <span class="hover-underline-animation">Back to Coaches</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
          <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
        </svg>
      </button>
    </div>

    <div v-else-if="coach" class="profile-content">
        <button class="back-btn" @click="$router.back()">
          <i class="fas fa-arrow-left"></i> Back
        </button>

        <!-- Coach Header -->
        <div class="coach-header">
          <div class="container">
            <div class="coach-basic-info">
              <div class="coach-image-container">
                <img 
                  v-if="coach.photo_url" 
                  :src="coach.photo_url" 
                  :alt="coachName"
                  class="coach-photo"
                />
                <div v-else class="coach-photo-placeholder">
                  <i class="fas fa-user-tie"></i>
                </div>
              </div>
              <div class="coach-details">
                <h1>{{ coachName }}</h1>
                <div class="coach-nationality">
                  <i class="fas fa-flag"></i> {{ coach.nationality || 'Zimbabwean' }}
                  <span class="badge-zifa">{{ coachZifaId }}</span>
                </div>
                <div class="coach-badges">
                  <span class="badge-license">{{ coach.license_level || 'N/A' }}</span>
                  <span class="status-badge" :class="getStatusClass(coach.status)">
                    {{ coach.status ? coach.status.toUpperCase() : 'ACTIVE' }}
                  </span>
                  <span v-if="coachAge !== 'N/A'" class="coach-age">
                    <i class="fas fa-birthday-cake"></i> Age: {{ coachAge }}
                  </span>
                </div>
                <div v-if="coach.club_name || coach.club" class="coach-club-info">
                  <div class="club-badge-placeholder">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h5>{{ coach.club_name || coach.club }}</h5>
                    <small v-if="coach.team_type">{{ coach.team_type }} Team</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Bar -->
        <div class="container">
          <div class="coach-stats-bar">
          <div class="stat-item">
            <div class="stat-value">{{ coach.years_of_experience || 0 }}</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ coach.license_level || 'N/A' }}</div>
            <div class="stat-label">License Level</div>
          </div>
          <div v-if="coach.license_expiry_date" class="stat-item">
            <div class="stat-value">{{ formatDateShort(coach.license_expiry_date) }}</div>
            <div class="stat-label">License Expiry</div>
          </div>
          </div>
        </div>

        <!-- Coach Tabs -->
        <div class="container">
          <div class="coach-tabs">
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
                    <span class="info-value">{{ coachName }}</span>
                  </div>
                  <div class="info-item" v-if="coach.date_of_birth">
                    <span class="info-label">Date of Birth</span>
                    <span class="info-value">{{ formatDate(coach.date_of_birth) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nationality</span>
                    <span class="info-value">{{ coach.nationality || 'Zimbabwean' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">License Level</span>
                    <span class="info-value">{{ coach.license_level || 'N/A' }}</span>
                  </div>
                  <div class="info-item" v-if="coach.license_number">
                    <span class="info-label">License Number</span>
                    <span class="info-value">{{ coach.license_number }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Current Assignment</h4>
                  <div class="info-item">
                    <span class="info-label">Club</span>
                    <span class="info-value">{{ coach.club_name || coach.club || 'N/A' }}</span>
                  </div>
                  <div class="info-item" v-if="coach.team_type">
                    <span class="info-label">Team Type</span>
                    <span class="info-value">{{ coach.team_type }}</span>
                  </div>
                  <div class="info-item" v-if="coach.contract_start_date">
                    <span class="info-label">Contract Start</span>
                    <span class="info-value">{{ formatDate(coach.contract_start_date) }}</span>
                  </div>
                  <div class="info-item" v-if="coach.contract_end_date">
                    <span class="info-label">Contract End</span>
                    <span class="info-value">{{ formatDate(coach.contract_end_date) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">{{ coach.status || 'active' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Availability</span>
                    <span class="info-value">{{ getAvailabilityText(coach.availability) }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <h4>Contact Information</h4>
                <div class="info-item" v-if="coach.email">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ coach.email }}</span>
                </div>
                <div class="info-item" v-if="coach.phone">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ coach.phone }}</span>
                </div>
                <div class="info-item" v-if="coach.address">
                  <span class="info-label">Address</span>
                  <span class="info-value">{{ coach.address }}</span>
                </div>
              </div>
            </div>

            <!-- Experience Tab -->
            <div v-if="activeTab === 'experience'" class="tab-pane">
              <div class="info-card">
                <h4>Coaching Experience</h4>
                <div class="info-item">
                  <span class="info-label">Years of Experience</span>
                  <span class="info-value">{{ coach.years_of_experience || 0 }} years</span>
                </div>
                <div class="info-item" v-if="coach.previous_clubs">
                  <span class="info-label">Previous Clubs</span>
                  <span class="info-value">{{ coach.previous_clubs }}</span>
                </div>
                <div class="info-item" v-if="coach.achievements">
                  <span class="info-label">Achievements</span>
                  <span class="info-value">{{ coach.achievements }}</span>
                </div>
                <div class="info-item" v-if="coach.bio">
                  <span class="info-label">Biography</span>
                  <span class="info-value">{{ coach.bio }}</span>
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
                    <span class="info-value">{{ coach.license_level || 'N/A' }}</span>
                  </div>
                  <div class="info-item" v-if="coach.license_number">
                    <span class="info-label">License Number</span>
                    <span class="info-value">{{ coach.license_number }}</span>
                  </div>
                  <div class="info-item" v-if="coach.license_expiry_date">
                    <span class="info-label">License Expiry Date</span>
                    <span class="info-value">{{ formatDate(coach.license_expiry_date) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">{{ coach.status || 'active' }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Document Status</h4>
                  <div class="info-item">
                    <span class="info-label">Photo</span>
                    <span class="info-value">
                      <i v-if="coach.photo_url" class="fas fa-check text-success"></i>
                      <i v-else class="fas fa-times text-danger"></i>
                      {{ coach.photo_url ? 'Uploaded' : 'Not Uploaded' }}
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
      <h2>Coach not found</h2>
      <p>The coach you're looking for doesn't exist.</p>
      <button class="btn btn-primary" @click="$router.push('/coaches')">
        <span class="hover-underline-animation">Browse Coaches</span>
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
import { useCoachesStore } from '@/stores/coaches'
import { coachesAPI } from '@/services/api'

const route = useRoute()
const coachesStore = useCoachesStore()
const coach = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('overview')

const coachName = computed(() => {
  if (!coach.value) return ''
  if (coach.value.first_name && coach.value.last_name) {
    return `${coach.value.first_name} ${coach.value.last_name}`
  }
  return coach.value.name || 'Unknown Coach'
})

const coachZifaId = computed(() => {
  if (!coach.value) return ''
  return coach.value.zifa_id || `ZIFA-${String(coach.value.id).padStart(5, '0')}`
})

const coachAge = computed(() => {
  if (!coach.value) return 'N/A'
  if (coach.value.date_of_birth) {
    const birthDate = new Date(coach.value.date_of_birth)
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

const getAvailabilityText = (availability) => {
  const texts = {
    'available': 'Available',
    'unavailable': 'Unavailable'
  }
  return texts[availability] || 'Unknown'
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const data = await coachesAPI.getById(route.params.id)
    coach.value = data.coach || data
  } catch (err) {
    error.value = err.message || 'Failed to load coach'
    console.error('Error loading coach:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.coach-profile {
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

/* Coach Header */
.coach-header {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 60px 0 30px;
  position: relative;
}

.coach-basic-info {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.coach-image-container {
  flex-shrink: 0;
}

.coach-photo {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid white;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.coach-photo-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid white;
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.coach-details {
  flex: 1;
  min-width: 250px;
}

.coach-details h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: white;
}

.coach-nationality {
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

.coach-badges {
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

.coach-age {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.coach-club-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.club-badge-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.coach-club-info h5 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
}

.coach-club-info small {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
}

/* Quick Stats Bar */
.coach-stats-bar {
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

/* Coach Tabs */
.coach-tabs {
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
  .coach-basic-info {
    flex-direction: column;
    text-align: center;
  }

  .coach-details h1 {
    font-size: 2rem;
  }

  .coach-stats-bar {
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
