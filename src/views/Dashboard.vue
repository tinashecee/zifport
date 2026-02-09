<template>
  <div class="dashboard-view">
    <div class="container">
      <UserDashboard />
      
      <div class="dashboard-sections">
        <div class="section">
          <PlayerStats :player="selectedPlayer" />
        </div>
        
        <div class="section">
          <PlayerAvailability :filter="availabilityFilter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserDashboard from '@/components/dashboard/UserDashboard.vue'
import PlayerStats from '@/components/dashboard/PlayerStats.vue'
import PlayerAvailability from '@/components/dashboard/PlayerAvailability.vue'

const router = useRouter()
const authStore = useAuthStore()

const selectedPlayer = ref(null)
const availabilityFilter = ref('all')

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/')
}
</script>

<style scoped>
.dashboard-view {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.section {
  width: 100%;
}

@media (max-width: 992px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
  }
}
</style>
