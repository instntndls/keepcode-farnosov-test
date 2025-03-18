<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  label?: string
  placeholder?: string
  modelValue: string
  maxlength?: number
  errorMessage?: string
  isPassword?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const inputType = ref(props.isPassword ? 'password' : 'text')
const togglePassword = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const charCount = computed(() => props.modelValue.length)
const isLimitExceeded = computed(() => props.maxlength && charCount.value >= props.maxlength)
</script>

<template>
  <div class="input-container" :class="{ error: errorMessage }">
    <label v-if="label" class="label text-small">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="inputType"
        :placeholder="placeholder"
        :model-value="modelValue"
        :maxlength="maxlength"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="input-field"/>
      <button v-if="isPassword" type="button" class="toggle-password" @click="togglePassword">
        <img
          v-if="inputType !== 'text'"
          src="/src/assets/icons/off-password.svg"
          alt="Hide password"
          class="logo"
        />
        <img v-else src="/src/assets/icons/on-password.svg" alt="Show password" class="logo" />
      </button>
    </div>
    <div class="input-meta">
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
      <span v-if="maxlength" class="char-count" :class="{ 'limit-exceeded': isLimitExceeded }">
        {{ charCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 72px;
  border-radius: 3px;

  &.error .input-field {
    border-color: #ff7461;
  }

  .label {
    padding: 0 24px;
    color: var(--color-gray);
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .input-field {
    width: 100%;
    padding-right: 40px;
    border: none;
    border-radius: 38px;
    font-size: 16px;
    outline: none;
    padding: 0 28px;
    height: 72px;
    color: var(--color-dark);
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    line-height: 28px;

    &::placeholder {
      color: var(--color-gray);
      font-family: 'Montserrat', sans-serif;
      font-weight: 300;
      font-size: 18px;
      line-height: 28px;
    }

    &:focus,
    &:hover {
      box-shadow: inset 0 0 0 2px var(--color-green);
    }
  }

  .toggle-password {
    height: fit-content;
    top: 40%;
    position: absolute;
    right: 24px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  .input-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 0 24px;
    color: var(--color-gray);
  }

  .error-message {
    color: #ff7461;
    font-size: 12px;
  }

  .char-count {
    margin-left: auto;
    font-size: 12px;

    &.limit-exceeded {
      color: #ff7461;
    }
  }
}
</style>
