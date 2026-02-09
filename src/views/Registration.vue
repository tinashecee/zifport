<template>
  <div class="registration-view">
    <div class="container">
      <h1 class="page-title">Registration Portal</h1>
      
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'player' }"
          @click="activeTab = 'player'"
        >
          <i class="fas fa-user"></i> Player Registration
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'coach' }"
          @click="activeTab = 'coach'"
        >
          <i class="fas fa-user-tie"></i> Coach Registration
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'referee' }"
          @click="activeTab = 'referee'"
        >
          <i class="fas fa-whistle"></i> Referee Registration
        </button>
      </div>

      <div class="tab-content">
        <PlayerRegistration v-if="activeTab === 'player'" />
        <CoachRegistration v-if="activeTab === 'coach'" />
        <RefereeRegistration v-if="activeTab === 'referee'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PlayerRegistration from '@/components/registration/PlayerRegistration.vue'
import CoachRegistration from '@/components/registration/CoachRegistration.vue'
import RefereeRegistration from '@/components/registration/RefereeRegistration.vue'

const activeTab = ref('player')
</script>

<style scoped>
.registration-view {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.page-title {
  text-align: center;
  color: var(--dark-green);
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 15px 30px;
  background-color: white;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab-btn:hover {
  background-color: rgba(30, 126, 52, 0.1);
}

.tab-btn.active {
  background-color: var(--primary-green);
  color: white;
}

.tab-content {
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .tab-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
