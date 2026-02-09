<template>
  <div class="player-stats">
    <h3 class="stats-title">Player Statistics</h3>
    <div v-if="player" class="stats-container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-futbol"></i>
          </div>
          <div class="stat-value">{{ player.stats?.gamesPlayed || 0 }}</div>
          <div class="stat-label">Games Played</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-futbol"></i>
          </div>
          <div class="stat-value">{{ player.stats?.goals || 0 }}</div>
          <div class="stat-label">Goals</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-handshake"></i>
          </div>
          <div class="stat-value">{{ player.stats?.assists || 0 }}</div>
          <div class="stat-label">Assists</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon yellow-card">
            <i class="fas fa-square"></i>
          </div>
          <div class="stat-value">{{ player.stats?.yellowCards || 0 }}</div>
          <div class="stat-label">Yellow Cards</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon red-card">
            <i class="fas fa-square"></i>
          </div>
          <div class="stat-value">{{ player.stats?.redCards || 0 }}</div>
          <div class="stat-label">Red Cards</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-percentage"></i>
          </div>
          <div class="stat-value">{{ goalsPerGame }}</div>
          <div class="stat-label">Goals per Game</div>
        </div>
      </div>
    </div>
    <div v-else class="no-stats">
      <p>Select a player to view statistics</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: {
    type: Object,
    default: null
  }
})

const goalsPerGame = computed(() => {
  if (!props.player?.stats?.gamesPlayed || props.player.stats.gamesPlayed === 0) {
    return '0.00'
  }
  return (props.player.stats.goals / props.player.stats.gamesPlayed).toFixed(2)
})
</script>

<style scoped>
.player-stats {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.stats-title {
  color: var(--dark-green);
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: var(--light-gray);
  border-radius: 8px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-green);
  margin-bottom: 10px;
}

.stat-icon.yellow-card {
  color: var(--yellow);
}

.stat-icon.red-card {
  color: #dc3545;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--medium-gray);
  font-weight: 600;
}

.no-stats {
  text-align: center;
  padding: 40px;
  color: var(--medium-gray);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
