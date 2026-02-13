<template>
  <div class="player-database">
    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <h2 class="section-title">Player Search Database</h2>
        <div class="search-container">
          <form class="search-form" @submit.prevent="performSearch">
            <div class="form-group">
              <label class="form-label" for="playerName">Player Name</label>
              <input 
                type="text" 
                id="playerName" 
                class="form-input" 
                v-model="filters.name"
                placeholder="Enter player name"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label" for="club">Club</label>
              <select id="club" class="form-select" v-model="filters.club">
                <option value="">All Clubs</option>
                <option v-for="club in uniqueClubs" :key="club" :value="club">{{ club }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="position">Position</label>
              <select id="position" class="form-select" v-model="filters.position">
                <option value="">All Positions</option>
                <option value="GK">Goalkeeper</option>
                <option value="DF">Defender</option>
                <option value="MF">Midfielder</option>
                <option value="FW">Forward</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="status">Eligibility Status</label>
              <select id="status" class="form-select" v-model="filters.status">
                <option value="">All Statuses</option>
                <option value="eligible">Eligible</option>
                <option value="pending">Pending Documents</option>
                <option value="ineligible">Ineligible</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="availability">Availability</label>
              <select id="availability" class="form-select" v-model="filters.availability">
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="injured">Injured</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <button type="submit" class="search-btn">
              <i class="fas fa-search"></i> Search Players
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="results-section">
      <div class="container">
        <h2 class="section-title">Player Results ({{ filteredPlayers.length }})</h2>
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'table' }"
            @click="viewMode = 'table'"
          >
            <i class="fas fa-table"></i> Table View
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'cards' }"
            @click="viewMode = 'cards'"
          >
            <i class="fas fa-th"></i> Card View
          </button>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="results-container">
          <table class="results-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Position</th>
                <th>Club</th>
                <th>Age</th>
                <th>Nationality</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in filteredPlayers" :key="player.id">
                <td>
                  <div class="player-name">{{ getPlayerName(player) }}</div>
                  <div class="player-club">ID: {{ player.zifa_id || `ZIFA-${String(player.id).padStart(5, '0')}` }}</div>
                </td>
                <td><span class="player-position">{{ player.position }}</span></td>
                <td>{{ player.club_name || player.club || 'N/A' }}</td>
                <td>{{ player.age || getPlayerAge(player) }}</td>
                <td>{{ player.nationality || 'Zimbabwean' }}</td>
                <td>
                  <span class="player-status" :class="getStatusClass(player.status)">
                    {{ player.status ? player.status.toUpperCase() : 'UNKNOWN' }}
                  </span>
                </td>
                <td>
                  <span class="player-status" :class="getAvailabilityClass(player.availability)">
                    {{ getAvailabilityText(player.availability) }}
                  </span>
                </td>
                <td>
                  <button class="action-btn" @click="viewPlayer(player.id)">View</button>
                  <button class="action-btn" @click="editPlayer(player.id)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card View -->
        <div v-if="viewMode === 'cards'" class="cards-container">
          <div class="cards-grid">
            <PlayerCard 
              v-for="player in filteredPlayers" 
              :key="player.id"
              :player="player"
              @view="viewPlayer"
              @edit="editPlayer"
            />
          </div>
        </div>

        <div v-if="filteredPlayers.length === 0" class="no-results">
          <p>No players found matching your search criteria.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayersStore } from '@/stores/players'
import PlayerCard from '@/components/common/PlayerCard.vue'

const router = useRouter()
const playersStore = usePlayersStore()

const filters = ref({
  name: '',
  club: '',
  position: '',
  status: '',
  availability: ''
})

const viewMode = ref('table')

const uniqueClubs = computed(() => {
  const clubs = [...new Set(playersStore.players.map(p => p.club_name || p.club).filter(Boolean))]
  return clubs.sort()
})

const filteredPlayers = computed(() => {
  return playersStore.searchPlayers(filters.value)
})

const performSearch = () => {
  // Search is reactive, no need for explicit action
}

const getPlayerName = (player) => {
  if (player.first_name && player.last_name) {
    return `${player.first_name} ${player.last_name}`
  }
  return player.name || 'Unknown Player'
}

const getPlayerAge = (player) => {
  if (player.age) return player.age
  if (player.date_of_birth) {
    return playersStore.calculateAge(player.date_of_birth)
  }
  if (player.dob) {
    return playersStore.calculateAge(player.dob)
  }
  return 'N/A'
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

const viewPlayer = (id) => {
  router.push(`/player/${id}`)
}

const editPlayer = (id) => {
  router.push({ path: `/player/${id}`, query: { edit: '1' } })
}

onMounted(async () => {
  await playersStore.loadPlayers()
})
</script>

<style scoped>
.search-section {
  background-color: white;
  padding: 80px 0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 48px;
  color: #1a2b4f;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
  display: inline-block;
  width: 100%;
}

.section-title:after {
  content: '';
  position: absolute;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--gold) 100%);
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.search-container {
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  padding: 32px;
  box-shadow: var(--card-shadow);
  max-width: 1000px;
  margin: 0 auto;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-family: 'Inter', sans-serif;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #1a2b4f;
}

.form-input, .form-select {
  font-family: 'Inter', sans-serif;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1);
}

.search-btn {
  font-family: 'Inter', sans-serif;
  grid-column: 1 / -1;
  background-color: var(--primary-green);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 126, 52, 0.2);
}

.search-btn:hover {
  background-color: var(--dark-green);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30, 126, 52, 0.3);
}

.results-section {
  padding: 60px 0;
  background-color: var(--light-gray);
}

.view-toggle {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.toggle-btn {
  font-family: 'Inter', sans-serif;
  padding: 10px 20px;
  background-color: white;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover,
.toggle-btn.active {
  background-color: var(--primary-green);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 126, 52, 0.2);
}

.results-container {
  overflow-x: auto;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.results-table thead {
  background-color: white;
  color: var(--text-dark);
  position: relative;
}

.results-table thead::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--gold) 100%);
}

.results-table th {
  font-family: 'Poppins', sans-serif;
  padding: 18px 15px;
  text-align: left;
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  font-size: 0.95rem;
  color: #1a2b4f;
  background-color: white;
}

.results-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.results-table tbody tr:hover {
  background-color: rgba(30, 126, 52, 0.05);
}

.results-table td {
  font-family: 'Inter', sans-serif;
  padding: 15px;
  font-size: 1rem;
  font-weight: 400;
  color: #4a5568;
}

.player-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  color: #1a2b4f;
}

.player-club {
  font-family: 'Inter', sans-serif;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 400;
}

.player-position {
  display: inline-block;
  padding: 4px 10px;
  background-color: #e8f4ea;
  color: var(--primary-green);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.player-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-available {
  background-color: #d4edda;
  color: #155724;
}

.status-injured {
  background-color: #f8d7da;
  color: #721c24;
}

.status-unavailable {
  background-color: #e2e3e5;
  color: #383d41;
}

.status-unknown {
  background-color: #fff3cd;
  color: #856404;
}

.action-btn {
  font-family: 'Inter', sans-serif;
  padding: 8px 16px;
  background-color: transparent;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 8px;
}

.action-btn:hover {
  background-color: var(--primary-green);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 126, 52, 0.2);
}

.cards-container {
  margin-top: 30px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--medium-gray);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
