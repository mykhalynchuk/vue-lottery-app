<template>
  <div class="container py-4" style="max-width: 900px">
    <WinnersBlock
      :winners="winnerObjects"
      :total-participants="participants.length"
      @new-winner="pickRandomWinner"
      @remove-winner="removeWinner"
    />

    <RegistrationForm :existing-emails="participants.map((p) => p.email)" @save="addParticipant" />

    <ParticipantsTable
      :participants="processedParticipants"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="handleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
    >
      <template #search>
        <SearchBar @filter-by-name="filterQuery = $event" />
      </template>
    </ParticipantsTable>

    <!-- Delete Confirmation Modal -->
    <ModalWindow :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #header>Підтвердження видалення</template>
      <p>
        Ви дійсно бажаєте видалити учасника <strong>{{ selectedParticipant?.name }}</strong
        >, {{ selectedParticipant?.email }}?
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </ModalWindow>

    <!-- Edit Modal -->
    <ModalWindow :is-open="isEditModalOpen" @close="isEditModalOpen = false">
      <template #header>Редагувати дані</template>
      <form @submit.prevent="confirmEdit" v-if="editForm">
        <BaseInput label="Name" v-model="editForm.name" required />
        <BaseInput type="date" label="Date of Birth" v-model="editForm.dob" required />
        <BaseInput label="Email" v-model="editForm.email" required />
        <BaseInput label="Phone number" v-model="editForm.phone" required />
        <div class="d-flex justify-content-end mt-3">
          <BaseButton type="submit" variant="primary">Оновити дані</BaseButton>
        </div>
      </form>
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Participant } from './types'
import WinnersBlock from './components/WinnersBlock.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import SearchBar from './components/SearchBar.vue'
import ModalWindow from './components/ui/ModalWindow.vue'
import BaseButton from './components/ui/BaseButton.vue'
import BaseInput from './components/ui/BaseInput.vue'

// Стан застосунку
const participants = ref<Participant[]>([])
const winnersIds = ref<string[]>([])

// Відновлення з localStorage
onMounted(() => {
  const saved = localStorage.getItem('lottery_participants')
  if (saved) participants.value = JSON.parse(saved)

  const savedWinners = localStorage.getItem('lottery_winners')
  if (savedWinners) winnersIds.value = JSON.parse(savedWinners)
})

// Глибоке збереження у localStorage
watch(
  participants,
  (newVal) => {
    localStorage.setItem('lottery_participants', JSON.stringify(newVal))
  },
  { deep: true },
)

watch(
  winnersIds,
  (newVal) => {
    localStorage.setItem('lottery_winners', JSON.stringify(newVal))
  },
  { deep: true },
)

// Обчислювана властивість для відображення переможців
const winnerObjects = computed(() => {
  return winnersIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined)
})

// Додавання
const addParticipant = (pData: Omit<Participant, 'id'>) => {
  participants.value.push({ ...pData, id: crypto.randomUUID() })
}

// Логіка переможців
const pickRandomWinner = () => {
  const available = participants.value.filter((p) => !winnersIds.value.includes(p.id))
  if (available.length > 0 && winnersIds.value.length < 3) {
    const randomIndex = Math.floor(Math.random() * available.length)
    const winner = available[randomIndex]

    // Перевіряємо, чи winner дійсно існує і має id
    if (winner && winner.id) {
      winnersIds.value.push(winner.id)
    }
  }
}

const removeWinner = (id: string) => {
  winnersIds.value = winnersIds.value.filter((wId) => wId !== id)
}

// Сортування та фільтрація (Обчислювана властивість)
const filterQuery = ref('')
const sortKey = ref('name')
const sortDir = ref<'asc' | 'desc'>('asc')

const processedParticipants = computed(() => {
  let result = [...participants.value]

  // 1. Фільтрація
  if (filterQuery.value) {
    const q = filterQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }

  // 2. Сортування
  result.sort((a, b) => {
    const valA = String(a[sortKey.value as keyof Participant]).toLowerCase()
    const valB = String(b[sortKey.value as keyof Participant]).toLowerCase()
    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

// Модалки та дії
const isDeleteModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedParticipant = ref<Participant | null>(null)
const editForm = ref<Participant | null>(null)

const openDeleteModal = (p: Participant) => {
  selectedParticipant.value = p
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (selectedParticipant.value) {
    const id = selectedParticipant.value.id
    participants.value = participants.value.filter((p) => p.id !== id)
    removeWinner(id) // Видаляємо також з переможців, якщо він там був
  }
  isDeleteModalOpen.value = false
}

const openEditModal = (p: Participant) => {
  editForm.value = { ...p }
  isEditModalOpen.value = true
}

const confirmEdit = () => {
  if (editForm.value) {
    // Базова перевірка унікальності email без врахування власного
    const isDuplicate = participants.value.some(
      (p) =>
        p.id !== editForm.value!.id &&
        p.email.toLowerCase() === editForm.value!.email.toLowerCase(),
    )

    if (isDuplicate) {
      alert('Email вже існує!') // Для простоти тут можна залишити або додати помилку у форму
      return
    }

    const index = participants.value.findIndex((p) => p.id === editForm.value!.id)
    if (index !== -1) {
      participants.value[index] = { ...editForm.value }
    }
    isEditModalOpen.value = false
  }
}
</script>
