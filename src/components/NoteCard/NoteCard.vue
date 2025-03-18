<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import Button from '@/components/Button/Button.vue'
import { useTasksStore } from '@/stores/tasks.ts'

interface Props {
  id: number
  text: string
  completed?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['complete', 'fetch'])

const tasksStore = useTasksStore()

const truncatedText = computed(() =>
  props.text.length > 500 ? props.text.slice(0, 500) + '...' : props.text,
)

const loading = ref(false)

const noteBodyClass = computed(() => ({
  'note-body': true,
  completed: props.completed,
}))

const handleDeleteTask = (taskId: number) => {
  loading.value = true
  try {
    tasksStore.deleteTask(taskId)
    emit('fetch')
    loading.value = false
  } catch (error) {
    loading.value = false
    alert('Ошибка при удалении задачи: ' + error)
  }
}

onMounted(() => {
  loading.value = false
})

onUnmounted(() => {
  loading.value = false
})
</script>

<template>
  <article class="note-card" role="article" aria-label="Note card">
    <div :class="noteBodyClass" role="document">
      <p class="text-normal note-text">{{ truncatedText }}</p>
    </div>
    <div class="note-footer" role="contentinfo">
      <Button
        :loading="loading"
        @click="handleDeleteTask(props.id)"
        label="Удалить"
        icon="/src/assets/icons/close.svg"
        aria-label="Delete note"
        role="button"
      ></Button>
      <Button
        v-if="!completed"
        @click="emit('complete')"
        label="Завершить"
        icon="/src/assets/icons/close.svg"
        aria-label="Delete note"
        role="button"
      ></Button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.note-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 72px;
  height: fit-content;
  box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  overflow: hidden;
}

.note-body {
  display: flex;
  flex-direction: column;
  max-height: 336px;
  background: var(--color-green-light);
  align-items: flex-start;

  &.completed {
    background: var(--color-green-dark);
  }
}

.note-text {
  margin: 0;
  padding: 20px 28px 28px 28px;
  display: -webkit-box;
  -webkit-line-clamp: 9;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.note-footer {
  display: flex;
  height: fit-content;
  justify-content: flex-end;
  padding: 8px;
  align-items: center;
  background: var(--color-green-light);
}
</style>
