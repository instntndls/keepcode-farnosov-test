<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  icon?: string
  round?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['click'])

const buttonClass = computed(() => [
  'base-button',
  { round: props.round, disabled: props.disabled, loading: props.loading },
])


</script>

<template>
  <button :class="buttonClass" :disabled="props.disabled || props.loading" @click="emit('click')">
    <slot v-if="!props.loading" class="icon"></slot>
    <p v-if="props.label && !props.loading " class="text-normal">{{ props.label }}</p>
    <div v-if="props.loading" class="spinner"></div>


  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 56px;
  padding: 0 24px;
  background: var(--color-green-light);
  border: none;
  border-radius: 32px;
  color: white;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  overflow: hidden;

  &.round {
    width: 56px;
    height: 56px;
    justify-content: center;
  }

  &.disabled {
    background: var(--color-gray);
    cursor: not-allowed;
  }

  &.loading {
    pointer-events: none;
  }

  &:hover {
    background: var(--color-green-middle);
  }

  &:active {
    background: var(--color-green-dark);
  }

  .spinner {
    position: absolute;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
}

.text-normal {
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
