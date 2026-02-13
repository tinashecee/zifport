<template>
  <div class="player-profile">
    <div v-if="loading" class="loading container">
      <p>Loading player...</p>
    </div>
    
    <div v-else-if="error" class="error container">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="$router.push('/players')">
        <span class="hover-underline-animation">Back to Players</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
          <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
        </svg>
      </button>
    </div>

    <div v-else-if="player" class="profile-content">
        <div class="profile-actions">
          <button class="back-btn" @click="$router.back()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-edit-profile" @click="showEditModal = true">
            <i class="fas fa-edit"></i> Edit Player
          </button>
        </div>
        <EditPlayerModal
          :is-open="showEditModal"
          :player="player"
          @close="showEditModal = false"
          @saved="onPlayerSaved"
        />

        <!-- Player Header -->
        <div class="player-header">
          <div class="container">
            <div class="player-basic-info">
              <div class="player-image-container">
                <img 
                  v-if="player.photo_url" 
                  :src="player.photo_url" 
                  :alt="playerName"
                  class="player-photo"
                />
                <div v-else class="player-photo-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div class="player-details">
                <h1>{{ playerName }}</h1>
                <div class="player-nationality">
                  <i class="fas fa-flag"></i> {{ player.nationality || 'Zimbabwean' }}
                  <span v-if="player.dual_nationality"> / {{ player.dual_nationality }}</span>
                  <span class="badge-zifa">{{ playerZifaId }}</span>
                </div>
                <div class="player-badges">
                  <span class="badge-position">{{ player.position }}</span>
                  <span class="status-badge" :class="getStatusClass(player.status)">
                    {{ player.status ? player.status.toUpperCase() : 'PENDING' }}
                  </span>
                  <span class="player-age">
                    <i class="fas fa-birthday-cake"></i> Age: {{ playerAge }}
                  </span>
                </div>
                <div v-if="player.club_name || player.club" class="player-club-info">
                  <div class="club-badge-placeholder">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h5>{{ player.club_name || player.club }}</h5>
                    <small v-if="player.jersey_number">Jersey #{{ player.jersey_number }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Bar -->
        <div class="container">
          <div class="player-stats-bar">
          <div class="stat-item">
            <div class="stat-value">{{ player.international_appearances || 0 }}</div>
            <div class="stat-label">Int'l Caps</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ player.international_goals || 0 }}</div>
            <div class="stat-label">Int'l Goals</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ player.all_time_assists || 0 }}</div>
            <div class="stat-label">Assists</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ player.all_time_goals || 0 }}</div>
            <div class="stat-label">All-Time Goals</div>
          </div>
          <div v-if="player.height_cm" class="stat-item">
            <div class="stat-value">{{ (player.height_cm / 100).toFixed(2) }}m</div>
            <div class="stat-label">Height</div>
          </div>
          <div v-if="player.weight_kg" class="stat-item">
            <div class="stat-value">{{ player.weight_kg }}kg</div>
            <div class="stat-label">Weight</div>
          </div>
          </div>
        </div>

        <!-- Player Tabs -->
        <div class="container">
          <div class="player-tabs">
          <ul class="nav-tabs-zifa">
            <li class="nav-tab-item active">
              <button class="nav-tab-link" @click="activeTab = 'overview'">
                <i class="fas fa-user-circle"></i> Overview
              </button>
            </li>
            <li class="nav-tab-item">
              <button class="nav-tab-link" @click="activeTab = 'stats'">
                <i class="fas fa-chart-line"></i> Statistics
              </button>
            </li>
            <li class="nav-tab-item">
              <button class="nav-tab-link" @click="activeTab = 'documents'">
                <i class="fas fa-file-alt"></i> Documents & Eligibility
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
                    <span class="info-value">{{ playerName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Date of Birth</span>
                    <span class="info-value">{{ formatDate(player.date_of_birth || player.dob) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nationality</span>
                    <span class="info-value">{{ player.nationality || 'Zimbabwean' }}<span v-if="player.dual_nationality">, {{ player.dual_nationality }}</span></span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Preferred Foot</span>
                    <span class="info-value">{{ player.preferred_foot || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Position</span>
                    <span class="info-value">{{ player.position }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Current Club Information</h4>
                  <div class="info-item">
                    <span class="info-label">Club</span>
                    <span class="info-value">{{ player.club_name || player.club || 'N/A' }}</span>
                  </div>
                  <div class="info-item" v-if="player.contract_start_date">
                    <span class="info-label">Contract Start</span>
                    <span class="info-value">{{ formatDate(player.contract_start_date) }}</span>
                  </div>
                  <div class="info-item" v-if="player.contract_end_date">
                    <span class="info-label">Contract End</span>
                    <span class="info-value">{{ formatDate(player.contract_end_date) }}</span>
                  </div>
                  <div class="info-item" v-if="player.jersey_number">
                    <span class="info-label">Jersey Number</span>
                    <span class="info-value">{{ player.jersey_number }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Position</span>
                    <span class="info-value">{{ player.position }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <h4>Contact Information</h4>
                <div class="info-item" v-if="player.email">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ player.email }}</span>
                </div>
                <div class="info-item" v-if="player.phone">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ player.phone }}</span>
                </div>
                <div class="info-item" v-if="player.address">
                  <span class="info-label">Address</span>
                  <span class="info-value">{{ player.address }}</span>
                </div>
                <div class="info-item" v-if="player.emergency_contact_name">
                  <span class="info-label">Emergency Contact</span>
                  <span class="info-value">{{ player.emergency_contact_name }}<span v-if="player.emergency_contact_phone"> - {{ player.emergency_contact_phone }}</span></span>
                </div>
              </div>
            </div>

            <!-- Statistics Tab -->
            <div v-if="activeTab === 'stats'" class="tab-pane">
              <div class="info-cards-grid">
                <div class="info-card">
                  <h4>Career Statistics</h4>
                  <div class="info-item">
                    <span class="info-label">Total Appearances</span>
                    <span class="info-value">{{ player.games_played || 0 }}</span>
                  </div>
                  <div class="info-label mt-3">Club Level</div>
                  <div class="info-item">
                    <span class="info-label">Goals</span>
                    <span class="info-value">{{ player.all_time_goals || 0 }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Assists</span>
                    <span class="info-value">{{ player.all_time_assists || 0 }}</span>
                  </div>
                  <div class="info-label mt-3">International (Zimbabwe)</div>
                  <div class="info-item">
                    <span class="info-label">Caps</span>
                    <span class="info-value">{{ player.international_appearances || 0 }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Goals</span>
                    <span class="info-value">{{ player.international_goals || 0 }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Assists</span>
                    <span class="info-value">{{ player.all_time_assists || 0 }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Disciplinary Record</h4>
                  <div class="info-item">
                    <span class="info-label">Yellow Cards</span>
                    <span class="info-value">{{ player.yellow_cards || 0 }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Red Cards</span>
                    <span class="info-value">{{ player.red_cards || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <h4>Season Statistics</h4>
                <div class="info-item">
                  <span class="info-label">Season Goals</span>
                  <span class="info-value">{{ player.season_goals || 0 }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Season Assists</span>
                  <span class="info-value">{{ player.season_assists || 0 }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Games Played</span>
                  <span class="info-value">{{ player.games_played || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Documents Tab -->
            <div v-if="activeTab === 'documents'" class="tab-pane">
              <div class="info-cards-grid">
                <div class="info-card">
                  <h4>Eligibility Status</h4>
                  <div class="eligibility-alert" :class="player.status === 'eligible' ? 'success' : player.status === 'pending' ? 'warning' : 'danger'">
                    <i class="fas" :class="player.status === 'eligible' ? 'fa-check-circle' : player.status === 'pending' ? 'fa-clock' : 'fa-times-circle'"></i>
                    <strong>{{ player.status ? player.status.toUpperCase() : 'PENDING' }} FOR ZIMBABWE NATIONAL TEAM</strong>
                  </div>
                  <div class="info-item">
                    <span class="info-label">ZIFA ID</span>
                    <span class="info-value">{{ playerZifaId }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">{{ player.status || 'pending' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Availability</span>
                    <span class="info-value">{{ getAvailabilityText(player.availability) }}</span>
                  </div>
                  <div class="info-item" v-if="player.injury_status">
                    <span class="info-label">Injury Status</span>
                    <span class="info-value">{{ player.injury_status }}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h4>Document Status</h4>
                  <div class="info-item">
                    <span class="info-label">Passport</span>
                    <span class="info-value">
                      <i v-if="player.passport_number" class="fas fa-check text-success"></i>
                      <i v-else class="fas fa-times text-danger"></i>
                      {{ player.passport_number ? `Valid (Exp: ${formatDate(player.passport_expiry_date)})` : 'Not Provided' }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Photo</span>
                    <span class="info-value">
                      <i v-if="player.photo_url" class="fas fa-check text-success"></i>
                      <i v-else class="fas fa-times text-danger"></i>
                      {{ player.photo_url ? 'Uploaded' : 'Not Uploaded' }}
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
      <h2>Player not found</h2>
      <p>The player you're looking for doesn't exist.</p>
      <button class="btn btn-primary" @click="$router.push('/players')">
        <span class="hover-underline-animation">Browse Players</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
          <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayersStore } from '@/stores/players'
import { playersAPI } from '@/services/api'
import PlayerStats from '@/components/dashboard/PlayerStats.vue'
import EditPlayerModal from '@/components/common/EditPlayerModal.vue'

const route = useRoute()
const playersStore = usePlayersStore()
const player = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('overview')
const showEditModal = ref(false)

async function loadPlayer() {
  loading.value = true
  error.value = null
  try {
    const data = await playersAPI.getById(route.params.id)
    player.value = data.player || data
  } catch (err) {
    error.value = err.message || 'Failed to load player'
    console.error('Error loading player:', err)
  } finally {
    loading.value = false
  }
}

function onPlayerSaved() {
  showEditModal.value = false
  loadPlayer()
}

const playerName = computed(() => {
  if (!player.value) return ''
  if (player.value.first_name && player.value.last_name) {
    return `${player.value.first_name} ${player.value.last_name}`
  }
  return player.value.name || 'Unknown Player'
})

const playerZifaId = computed(() => {
  if (!player.value) return ''
  return player.value.zifa_id || `ZIFA-${String(player.value.id).padStart(5, '0')}`
})

const playerAge = computed(() => {
  if (!player.value) return 'N/A'
  if (player.value.age) return player.value.age
  if (player.value.date_of_birth) {
    return playersStore.calculateAge(player.value.date_of_birth)
  }
  if (player.value.dob) {
    return playersStore.calculateAge(player.value.dob)
  }
  return 'N/A'
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getStatusClass = (status) => {
  if (status === 'eligible') return 'status-available'
  if (status === 'pending') return 'status-unknown'
  if (status === 'ineligible') return 'status-injured'
  return 'status-unknown'
}

const getAvailabilityClass = (availability) => {
  if (availability === 'available') return 'status-available'
  if (availability === 'injured') return 'status-injured'
  if (availability === 'unavailable') return 'status-unavailable'
  return 'status-unknown'
}

const getAvailabilityText = (availability) => {
  const texts = {
    'available': 'Available',
    'injured': 'Injured',
    'unavailable': 'Unavailable'
  }
  return texts[availability] || 'Unknown'
}

onMounted(() => {
  loadPlayer()
})

watch(() => route.query.edit, (edit) => {
  if (edit === '1' && player.value) showEditModal.value = true
}, { immediate: false })

watch(player, (p) => {
  if (p && route.query.edit === '1') showEditModal.value = true
}, { immediate: true })
</script>

<style scoped>
.player-profile {
  padding: 0;
  min-height: calc(100vh - 200px);
  background-color: #f5f5f5;
}

.profile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 20px 0;
  position: relative;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  text-decoration: underline;
  transform: translateX(-5px);
}

.btn-edit-profile {
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--primary-green);
  color: white;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-edit-profile:hover {
  background: var(--dark-green, #0d5c1f);
}

/* Player Header */
.player-header {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 60px 0 30px;
  position: relative;
}

.player-basic-info {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.player-image-container {
  flex-shrink: 0;
}

.player-photo {
  width: 200px;
  height: 280px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.player-photo-placeholder {
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

.player-details {
  flex: 1;
  min-width: 250px;
}

.player-details h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: white;
}

.player-nationality {
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

.player-badges {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.badge-position {
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

.player-age {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.player-club-info {
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

.player-club-info h5 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
}

.player-club-info small {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
}

/* Quick Stats Bar */
.player-stats-bar {
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

/* Player Tabs */
.player-tabs {
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

.eligibility-alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.eligibility-alert.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.eligibility-alert.warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.eligibility-alert.danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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
  .player-basic-info {
    flex-direction: column;
    text-align: center;
  }

  .player-details h1 {
    font-size: 2rem;
  }

  .player-stats-bar {
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
