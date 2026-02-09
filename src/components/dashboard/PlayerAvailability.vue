<template>
  <div class="player-availability">
    <h3 class="availability-title">Player Availability</h3>
    <div v-if="players.length > 0" class="availability-list">
      <div 
        v-for="player in players" 
        :key="player.id" 
        class="availability-item"
        :class="getAvailabilityClass(player.availability)"
      >
        <div class="player-info">
          <div class="player-name">{{ player.name }}</div>
          <div class="player-details">{{ player.club }} • {{ player.position }}</div>
        </div>
        <div class="availability-status">
          <span class="status-badge" :class="getAvailabilityClass(player.availability)">
            {{ getAvailabilityText(player.availability) }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="no-availability">
      <p>No players found</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayersStore } from '@/stores/players'

const props = defineProps({
  filter: {
    type: String,
    default: 'all'
  }
})

const playersStore = usePlayersStore()

const players = computed(() => {
  if (props.filter === 'all') {
    return playersStore.players
  }
  return playersStore.players.filter(p => p.availability === props.filter)
})

const getAvailabilityClass = (availability) => {
  const classes = {
    'available': 'status-available',
    'injured': 'status-injured',
    'unavailable': 'status-unavailable'
  }
  return classes[availability] || 'status-unknown'
}

const getAvailabilityText = (availability) => {
  const texts = {
    'available': 'Available',
    'injured': 'Injured',
    'unavailable': 'Unavailable'
  }
  return texts[availability] || 'Unknown'
}
</script>

<style scoped>
.player-availability {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.availability-title {
  color: var(--dark-green);
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.availability-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.availability-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--light-gray);
  border-radius: 8px;
  border-left: 4px solid var(--primary-green);
  transition: transform 0.2s;
}

.availability-item:hover {
  transform: translateX(5px);
}

.availability-item.status-injured {
  border-left-color: #dc3545;
}

.availability-item.status-unavailable {
  border-left-color: var(--medium-gray);
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: 5px;
}

.player-details {
  font-size: 0.9rem;
  color: var(--medium-gray);
}

.availability-status {
  margin-left: 20px;
}

.status-badge {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.status-available {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.status-injured {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.status-unavailable {
  background-color: #e2e3e5;
  color: #383d41;
}

.status-badge.status-unknown {
  background-color: #fff3cd;
  color: #856404;
}

.no-availability {
  text-align: center;
  padding: 40px;
  color: var(--medium-gray);
}

@media (max-width: 768px) {
  .availability-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .availability-status {
    margin-left: 0;
  }
}
</style>
