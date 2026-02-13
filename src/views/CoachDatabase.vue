<template>
  <div class="coach-database">
    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <h2 class="section-title">Coach Database</h2>
        <div class="search-container">
          <form class="search-form" @submit.prevent="performSearch">
            <div class="form-group">
              <label class="form-label" for="coachName">Coach Name</label>
              <input 
                type="text" 
                id="coachName" 
                class="form-input" 
                v-model="filters.name"
                placeholder="Enter coach name"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label" for="license">License Level</label>
              <select id="license" class="form-select" v-model="filters.license_level">
                <option value="">All Levels</option>
                <option value="A">A License</option>
                <option value="B">B License</option>
                <option value="C">C License</option>
                <option value="D">D License</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="status">Status</label>
              <select id="status" class="form-select" v-model="filters.status">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <button type="submit" class="search-btn">
              <i class="fas fa-search"></i> Search Coaches
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="results-section">
      <div class="container">
        <div v-if="coachesStore.loading" class="loading-message">
          <p>Loading coaches...</p>
        </div>
        <div v-else-if="coachesStore.error" class="error-message">
          <p>Error: {{ coachesStore.error }}</p>
        </div>
        <div v-else>
          <h2 class="section-title">Coach Results ({{ filteredCoaches.length }})</h2>
          
          <div class="results-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>Coach</th>
                  <th>License Level</th>
                  <th>Club</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coach in filteredCoaches" :key="coach.id">
                  <td>
                    <div class="coach-name">{{ getCoachName(coach) }}</div>
                    <div class="coach-id">ID: {{ coach.zifa_id || `ZIFA-${String(coach.id).padStart(5, '0')}` }}</div>
                  </td>
                  <td><span class="license-badge">{{ coach.license_level || 'N/A' }}</span></td>
                  <td>{{ coach.club_name || coach.club || 'N/A' }}</td>
                  <td>{{ coach.email || 'N/A' }}</td>
                  <td>{{ coach.phone || 'N/A' }}</td>
                  <td>
                    <span class="coach-status" :class="getStatusClass(coach.status)">
                      {{ coach.status ? coach.status.toUpperCase() : 'UNKNOWN' }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn" @click="viewCoach(coach.id)">View</button>
                    <button class="action-btn" @click="editCoach(coach.id)">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredCoaches.length === 0" class="no-results">
            <p>No coaches found matching your search criteria.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoachesStore } from '@/stores/coaches'

const router = useRouter()
const coachesStore = useCoachesStore()

const filters = ref({
  name: '',
  license_level: '',
  status: ''
})

const getCoachName = (coach) => {
  if (coach.first_name && coach.last_name) {
    return `${coach.first_name} ${coach.last_name}`
  }
  return coach.name || 'Unknown Coach'
}

const filteredCoaches = computed(() => {
  let results = [...coachesStore.coaches]

  if (filters.value.name) {
    const nameLower = filters.value.name.toLowerCase()
    results = results.filter(c => {
      const firstName = (c.first_name || '').toLowerCase()
      const lastName = (c.last_name || '').toLowerCase()
      const fullName = `${firstName} ${lastName}`.trim()
      return fullName.includes(nameLower) || firstName.includes(nameLower) || lastName.includes(nameLower)
    })
  }

  if (filters.value.license_level) {
    results = results.filter(c => c.license_level === filters.value.license_level)
  }

  if (filters.value.status) {
    results = results.filter(c => c.status === filters.value.status)
  }

  return results
})

const performSearch = () => {
  // Search is reactive, no need for explicit action
}

const getStatusClass = (status) => {
  if (status === 'active') return 'status-available'
  return 'status-unknown'
}

const viewCoach = (id) => {
  router.push({ name: 'CoachProfile', params: { id } })
}

const editCoach = (id) => {
  router.push({ path: `/coach/${id}`, query: { edit: '1' } })
}

onMounted(async () => {
  await coachesStore.loadCoaches()
})
</script>

<style scoped>
.coach-database {
  padding-top: calc(var(--header-height) + 20px);
}

.search-section {
  background-color: white;
  padding: 60px 0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 40px;
  color: #1a2b4f;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
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
  font-family: 'Inter', sans-serif;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #1a2b4f;
}

.form-input, .form-select {
  font-family: 'Inter', sans-serif;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 400;
  transition: border 0.3s;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-green);
  outline: none;
}

.search-btn {
  font-family: 'Inter', sans-serif;
  grid-column: 1 / -1;
  background-color: var(--primary-green);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.coach-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  color: #1a2b4f;
}

.coach-id {
  font-family: 'Inter', sans-serif;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 400;
}

.license-badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: #e8f4ea;
  color: var(--primary-green);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.coach-status {
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

.status-unknown {
  background-color: #fff3cd;
  color: #856404;
}

.action-btn {
  font-family: 'Inter', sans-serif;
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid var(--primary-green);
  color: var(--primary-green);
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
