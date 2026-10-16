<template>
  <div class="card-block d-flex align-items-center justify-content-between">
    <div
      class="border rounded p-2 flex-grow-1 me-3 d-flex align-items-center bg-light"
      style="min-height: 46px"
    >
      <span v-if="winners.length === 0" class="text-muted small">Winners</span>
      <WinnerItem
        v-for="winner in winners"
        :key="winner.id"
        :name="winner.firstName + ' ' + winner.lastName"
        @remove="$emit('remove-winner', winner.id)"
      />
    </div>
    <BaseButton
      variant="info"
      :disabled="winners.length >= 3 || totalParticipants === 0 || allAreWinners"
      @click="$emit('new-winner')"
    >
      New winner
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { User as Participant } from '@/entities/user'
import WinnerItem from './WinnerItem.vue'
import { BaseButton } from '@/shared/ui'
import { computed } from 'vue'

const props = defineProps<{
  winners: Participant[]
  totalParticipants: number
}>()

defineEmits(['new-winner', 'remove-winner'])

const allAreWinners = computed(
  () => props.winners.length === props.totalParticipants && props.totalParticipants > 0,
)
</script>
