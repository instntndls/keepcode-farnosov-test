<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoteCard from '@/components/NoteCard/NoteCard.vue'
import { useTasksStore } from '@/stores/tasks.ts'

const tasksStore = useTasksStore()

const tasks = ref()
let draggedTaskId: number | null = null // to store the dragged task's id

onMounted(async () => {
  await handleFetchTasks()
})

const handleFetchTasks = async () => {
  try {
    await tasksStore.fetchTasks()
    tasks.value = tasksStore.tasks
  } catch (error) {
    alert('Ошибка при получении задач ' + error)
  }
}
const handleCompleteTask = async (taskId: number) => {
  try {
    await tasksStore.completeTask(taskId)
    await handleFetchTasks()
  } catch (error) {
    alert('Ошибка при завершении задачи ' + error)
  }
}

const handleDragStart = (taskId: number) => {
  draggedTaskId = taskId // Store the id of the task being dragged
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  // Prevent default action (like opening a link)
  if (draggedTaskId !== null) {
    await handleCompleteTask(draggedTaskId)
    console.log('Task dropped:', draggedTaskId)
    draggedTaskId = null // Reset after dropping
  }

}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault() // Allow dropping by preventing the default behavior
}
</script>

<template>
  <div class="container">
    <div class="card-grid">
      <h2 class="label">Новые</h2>
      <NoteCard
        v-for="(task) in tasks?.filter((task: any) => !task.completed)"
        :key="task.id"
        :id="task.id"
        :text="task?.title"
        :draggable="true"
        @dragstart="handleDragStart(task.id)"
        @complete="handleCompleteTask(task.id)"
        @fetch="handleFetchTasks()"
      />
    </div>
    <div class="completed-grid"
         @dragover="handleDragOver"
         @drop="handleDrop">
      <h2 class="label">Завершенные</h2>
      <NoteCard
        v-for="(task) in tasks?.filter((task: any) => task.completed)"
        :key="task.id"
        :id="task.id"
        :text="task?.title"
        :completed="task.completed"
        @fetch="handleFetchTasks()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.label {
  padding: 12px;
  margin: 0;
}

.container {
  width: 100%;
  display: flex;
  padding-top: 20px;
  gap: 24px;

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    gap: 24px;

  }
}

.card-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.completed-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: var(--color-middle);
  border-radius: 12px;

  @media (max-width: 1000px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>
