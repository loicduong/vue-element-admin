<script lang="ts" setup>
defineOptions({ name: 'CustomIconSelect' })

interface Props {
  /** Selected icon */
  value: string
  /** List of icons */
  icons: string[]
  /** Icon for when nothing is selected */
  emptyIcon?: string
}

const props = withDefaults(defineProps<Props>(), { emptyIcon: 'mdi:apps' })

interface Emits { (e: 'update:value', val: string): void }

const emit = defineEmits<Emits>()

const modelValue = computed({
  get() {
    return props.value
  },
  set(val: string) {
    emit('update:value', val)
  },
})

const selectedIcon = computed(() => modelValue.value || props.emptyIcon)

const searchValue = ref('')

const iconsList = computed(() => props.icons.filter(v => v.includes(searchValue.value)))

function handleChange(iconItem: string) {
  modelValue.value = iconItem
}
</script>

<template>
  <ElPopover placement="bottom-end" trigger="click" width="334" :show-arrow="false">
    <div>
      <ElInput v-model="searchValue" placeholder="Search icon" />
    </div>
    <div v-if="iconsList.length > 0" class="grid grid-cols-9 h-auto overflow-auto">
      <span v-for="iconItem in iconsList" :key="iconItem" @click="handleChange(iconItem)">
        <SvgIcon
          :icon="iconItem"
          class="m-2px cursor-pointer border-1px border-#d9d9d9 p-5px text-30px"
          :class="{ 'border-primary': modelValue === iconItem }"
        />
      </span>
    </div>
    <ElEmpty v-else class="w-306px" description="You can't find anything" />
    <template #reference>
      <ElInput v-model:value="modelValue" readonly placeholder="Click to select the icon">
        <template #suffix>
          <SvgIcon :icon="selectedIcon" class="p-5px text-30px" />
        </template>
      </ElInput>
    </template>
  </ElPopover>
</template>

<style lang="scss" scoped></style>
