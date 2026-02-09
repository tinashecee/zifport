<template>
  <div class="player-card">
    <div class="player-header">
      <div class="player-name">{{ playerName }}</div>
      <div class="player-id">ID: {{ player.zifa_id || `ZIFA-${String(player.id).padStart(5, '0')}` }}</div>
    </div>
    <div class="player-info">
      <div class="info-item">
        <span class="label">Position:</span>
        <span class="player-position">{{ player.position }}</span>
      </div>
      <div class="info-item">
        <span class="label">Club:</span>
        <span>{{ player.club_name || player.club || 'N/A' }}</span>
      </div>
      <div class="info-item">
        <span class="label">Age:</span>
        <span>{{ playerAge }}</span>
      </div>
      <div class="info-item">
        <span class="label">Status:</span>
        <span class="player-status" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>
    <div class="player-actions">
      <button class="action-btn" @click="$emit('view', player.id)">View</button>
      <button class="action-btn" @click="$emit('edit', player.id)">Edit</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayersStore } from '@/stores/players'

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit'])

const playersStore = usePlayersStore()

const playerName = computed(() => {
  if (props.player.first_name && props.player.last_name) {
    return `${props.player.first_name} ${props.player.last_name}`
  }
  return props.player.name || 'Unknown Player'
})

const playerAge = computed(() => {
  if (props.player.age) return props.player.age
  if (props.player.date_of_birth) {
    return playersStore.calculateAge(props.player.date_of_birth)
  }
  if (props.player.dob) {
    return playersStore.calculateAge(props.player.dob)
  }
  return 'N/A'
})

const statusText = computed(() => {
  return props.player.status ? props.player.status.toUpperCase() : 'UNKNOWN'
})

const statusClass = computed(() => {
  if (props.player.status === 'eligible') return 'status-available'
  if (props.player.status === 'pending') return 'status-unknown'
  if (props.player.status === 'ineligible') return 'status-injured'
  return 'status-unknown'
})
</script>

<style scoped>
.player-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 24px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.player-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
}

.player-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--green-light);
}

.player-name {
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--primary-green);
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.player-id {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.player-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.label {
  font-weight: 600;
  color: var(--text-medium);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.player-position {
  display: inline-block;
  padding: 6px 14px;
  background: var(--gold-light);
  color: var(--gold-dark);
  border: 1px solid var(--gold);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.player-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-available {
  background: rgba(76, 175, 80, 0.2);
  color: #81C784;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-injured {
  background: rgba(244, 67, 54, 0.2);
  color: #EF5350;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-unknown {
  background: rgba(255, 193, 7, 0.2);
  color: #FFB74D;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.player-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  padding: 10px 18px;
  background: transparent;
  border: 2px solid var(--gold);
  color: var(--gold);
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
  color: var(--darker-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}
</style>
