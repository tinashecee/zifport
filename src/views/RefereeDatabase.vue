<template>
  <div class="referee-database">
    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <h2 class="section-title">Referee Database</h2>
        <div class="search-container">
          <form class="search-form" @submit.prevent="performSearch">
            <div class="form-group">
              <label class="form-label" for="refereeName">Referee Name</label>
              <input 
                type="text" 
                id="refereeName" 
                class="form-input" 
                v-model="filters.name"
                placeholder="Enter referee name"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label" for="level">Referee Level</label>
              <select id="level" class="form-select" v-model="filters.level">
                <option value="">All Levels</option>
                <option value="FIFA">FIFA</option>
                <option value="CAF">CAF</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="availability">Availability</label>
              <select id="availability" class="form-select" v-model="filters.availability">
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <button type="submit" class="search-btn">
              <i class="fas fa-search"></i> Search Referees
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="results-section">
      <div class="container">
        <div v-if="refereesStore.loading" class="loading-message">
          <p>Loading referees...</p>
        </div>
        <div v-else-if="refereesStore.error" class="error-message">
          <p>Error: {{ refereesStore.error }}</p>
        </div>
        <div v-else>
          <h2 class="section-title">Referee Results ({{ filteredReferees.length }})</h2>
          
          <div class="results-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>Referee</th>
                  <th>Level</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="referee in filteredReferees" :key="referee.id">
                  <td>
                    <div class="referee-name">{{ getRefereeName(referee) }}</div>
                    <div class="referee-id">ID: {{ referee.zifa_id || `ZIFA-${String(referee.id).padStart(5, '0')}` }}</div>
                  </td>
                  <td><span class="level-badge">{{ referee.level || 'N/A' }}</span></td>
                  <td>{{ referee.email || 'N/A' }}</td>
                  <td>{{ referee.phone || 'N/A' }}</td>
                  <td>
                    <span class="referee-status" :class="getAvailabilityClass(referee.availability)">
                      {{ getAvailabilityText(referee.availability) }}
                    </span>
                  </td>
                  <td>
                    <span class="referee-status" :class="getStatusClass(referee.status)">
                      {{ referee.status ? referee.status.toUpperCase() : 'UNKNOWN' }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn" @click="viewReferee(referee.id)">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredReferees.length === 0" class="no-results">
            <p>No referees found matching your search criteria.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRefereesStore } from '@/stores/referees'

const router = useRouter()
const refereesStore = useRefereesStore()

const filters = ref({
  name: '',
  level: '',
  availability: ''
})

const getRefereeName = (referee) => {
  if (referee.first_name && referee.last_name) {
    return `${referee.first_name} ${referee.last_name}`
  }
  return referee.name || 'Unknown Referee'
}

const filteredReferees = computed(() => {
  let results = [...refereesStore.referees]

  if (filters.value.name) {
    const nameLower = filters.value.name.toLowerCase()
    results = results.filter(r => {
      const firstName = (r.first_name || '').toLowerCase()
      const lastName = (r.last_name || '').toLowerCase()
      const fullName = `${firstName} ${lastName}`.trim()
      return fullName.includes(nameLower) || firstName.includes(nameLower) || lastName.includes(nameLower)
    })
  }

  if (filters.value.level) {
    results = results.filter(r => r.level === filters.value.level)
  }

  if (filters.value.availability) {
    results = results.filter(r => r.availability === filters.value.availability)
  }

  return results
})

const performSearch = () => {
  // Search is reactive, no need for explicit action
}

const getAvailabilityClass = (availability) => {
  if (availability === 'available') return 'status-available'
  if (availability === 'unavailable') return 'status-unavailable'
  return 'status-unknown'
}

const getAvailabilityText = (availability) => {
  const texts = {
    'available': 'Available',
    'unavailable': 'Unavailable'
  }
  return texts[availability] || 'Unknown'
}

const getStatusClass = (status) => {
  if (status === 'active') return 'status-available'
  return 'status-unknown'
}

const viewReferee = (id) => {
  router.push({ name: 'RefereeProfile', params: { id } })
}

onMounted(async () => {
  await refereesStore.loadReferees()
})
</script>

<style scoped>
.referee-database {
  padding-top: calc(var(--header-height) + 20px);
}

.search-section {
  background-color: white;
  padding: 60px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  color: var(--dark-green);
  font-size: 2.2rem;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  width: 80px;
  height: 4px;
  background-color: var(--primary-green);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.search-container {
  background-color: var(--light-gray);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  max-width: 900px;
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
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-gray);
}

.form-input, .form-select {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border 0.3s;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-green);
  outline: none;
}

.search-btn {
  grid-column: 1 / -1;
  background-color: var(--primary-green);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: var(--dark-green);
}

.results-section {
  padding: 60px 0;
  background-color: var(--light-gray);
}

.loading-message, .error-message {
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
}

.error-message {
  color: #dc3545;
}

.results-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
  padding: 18px 15px;
  text-align: left;
  font-weight: 600;
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
  padding: 15px;
}

.referee-name {
  font-weight: 600;
  color: var(--dark-gray);
}

.referee-id {
  color: var(--medium-gray);
  font-size: 0.9rem;
}

.level-badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: #e8f4ea;
  color: var(--primary-green);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.referee-status {
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

.status-unavailable {
  background-color: #e2e3e5;
  color: #383d41;
}

.status-unknown {
  background-color: #fff3cd;
  color: #856404;
}

.action-btn {
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid var(--primary-green);
  color: var(--primary-green);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: var(--primary-green);
  color: white;
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
}
</style>
