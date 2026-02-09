<template>
  <div class="user-dashboard">
    <div class="dashboard-header">
      <h2>Welcome, {{ user?.name || 'User' }}</h2>
      <p class="user-role">Role: <span>{{ userRole }}</span></p>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="card-content">
          <h3>{{ totalPlayers }}</h3>
          <p>Total Players</p>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="card-content">
          <h3>{{ totalCoaches }}</h3>
          <p>Total Coaches</p>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-whistle"></i>
        </div>
        <div class="card-content">
          <h3>{{ totalReferees }}</h3>
          <p>Total Referees</p>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="card-content">
          <h3>{{ availablePlayers }}</h3>
          <p>Available Players</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <router-link to="/registration" class="action-card">
          <i class="fas fa-user-plus"></i>
          <span>Register Player</span>
        </router-link>
        <router-link to="/players" class="action-card">
          <i class="fas fa-search"></i>
          <span>Search Players</span>
        </router-link>
        <router-link to="/registration" class="action-card">
          <i class="fas fa-user-tie"></i>
          <span>Register Coach</span>
        </router-link>
        <router-link to="/registration" class="action-card">
          <i class="fas fa-whistle"></i>
          <span>Register Referee</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePlayersStore } from '@/stores/players'
import { useCoachesStore } from '@/stores/coaches'
import { useRefereesStore } from '@/stores/referees'

const authStore = useAuthStore()
const playersStore = usePlayersStore()
const coachesStore = useCoachesStore()
const refereesStore = useRefereesStore()

const user = computed(() => authStore.user)

const userRole = computed(() => {
  if (!user.value) return 'Guest'
  const roles = {
    'admin': 'Administrator',
    'club': 'Club Administrator',
    'user': 'User'
  }
  return roles[user.value.role] || user.value.role
})

const totalPlayers = computed(() => playersStore.players.length)
const totalCoaches = computed(() => coachesStore.coaches.length)
const totalReferees = computed(() => refereesStore.referees.length)

const availablePlayers = computed(() => {
  return playersStore.players.filter(p => p.availability === 'available').length
})

onMounted(async () => {
  // Load all data when dashboard mounts
  await Promise.all([
    playersStore.loadPlayers(),
    coachesStore.loadCoaches(),
    refereesStore.loadReferees()
  ])
})
</script>

<style scoped>
.user-dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h2 {
  color: var(--dark-green);
  margin-bottom: 10px;
}

.user-role {
  color: var(--medium-gray);
  font-size: 1rem;
}

.user-role span {
  color: var(--primary-green);
  font-weight: 600;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  color: var(--primary-green);
}

.card-content h3 {
  font-size: 2rem;
  color: var(--dark-gray);
  margin-bottom: 5px;
}

.card-content p {
  color: var(--medium-gray);
  font-size: 0.9rem;
}

.quick-actions {
  margin-top: 40px;
}

.quick-actions h3 {
  color: var(--dark-green);
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  text-decoration: none;
  color: var(--dark-gray);
  transition: all 0.3s;
  border-top: 4px solid var(--primary-green);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  color: var(--primary-green);
}

.action-card i {
  font-size: 2.5rem;
  color: var(--primary-green);
  margin-bottom: 15px;
  display: block;
}

.action-card span {
  display: block;
  font-weight: 600;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .dashboard-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
