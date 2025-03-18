<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '@/components/Button/Button.vue'
import Input from '@/components/Input/Input.vue'
import ModalWindow from '@/components/ModalWindow/ModalWindow.vue'
import { useTasksStore } from '@/stores/tasks.ts'
import TextField from '@/components/TextField/TextField.vue'
import HomeView from '@/views/HomeView.vue'
const tasksStore = useTasksStore()

const fetchTasks = () => tasksStore.fetchTasks()

const isCreateModalOpen = ref(false)
const errorMessage = ref()

const newTaskTitle = ref('')
const loading = ref(false)

const checkEmpty = () => {
  if (newTaskTitle.value === '') {
    errorMessage.value = 'Заполните поле названия задачи'
    return false
  } else {
    errorMessage.value = ''
    return true
  }
}

const handleCreateTask = async () => {
  if (checkEmpty()) {
    loading.value = true
    try {
      await tasksStore.addTask(newTaskTitle.value)
      newTaskTitle.value = ''
      await fetchTasks()
      isCreateModalOpen.value = false
      loading.value = false
    } catch (error) {
      loading.value = false
      errorMessage.value = error
    }
  }

}
</script>

<template>
  <div class="app" role="main">
    <HomeView />
  </div>

  <Button class="add-button" @click="isCreateModalOpen = true" round aria-label="Add task">
    <img src="/src/assets/icons/add.svg" alt="Add" />
  </Button>

  <ModalWindow
    :error-message="errorMessage"
    :isOpen="isCreateModalOpen"
    title="Добавление задачи"
    @close="isCreateModalOpen = false"
    role="dialog"
    aria-labelledby="create-task-title"
    aria-describedby="create-task-description"
  >
    <div class="modal-content">
      <Input
        v-model="newTaskTitle"
        label="Название задачи"
        placeholder="Введите название"
        :maxlength="100"
        aria-required="true"
      />
      <div>
        <Button
          :loading="loading"
          class="modal-btn"
          label="Добавить"
          @click="handleCreateTask()"
          aria-label="Add task"
        />
      </div>
    </div>
  </ModalWindow>
</template>

<style scoped lang="scss">
.app {
  position: relative;
}

.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  box-shadow: 0px 15px 46px -10px rgba(0, 0, 0, 1);
}

.modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.modal-btn {
  margin-left: auto;
  margin-top: -12px;
}

@media (min-width: 1600px) {
  .app {
    padding: 0 7vw;
  }
}

@media (max-width: 1600px) {
  .add-button {
    right: 8px;
  }
  .app {
    padding: 0 4vw;
  }
}

@media (max-width: 640px) {
  .modal-btn {
    width: 100%;
  }
}
</style>
