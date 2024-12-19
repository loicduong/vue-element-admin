<script setup lang="ts">
import { $t } from '@/locales'

defineOptions({ name: 'LangSwitch' })

interface Props {
  /** Current language */
  lang: App.I18n.LangType
  /** Language options */
  langOptions: App.I18n.LangOption[]
  /** Show tooltip */
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), { showTooltip: true })

type Emits = { (e: 'changeLang', lang: App.I18n.LangType): void }

const emit = defineEmits<Emits>()

const tooltipContent = computed(() => {
  if (!props.showTooltip)
    return ''

  return $t('icon.lang')
})

const changeLang = (lang: App.I18n.LangType) => (emit('changeLang', lang))
</script>

<template>
  <ElDropdown trigger="click">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="{ key, label } in langOptions"
          :key="key"
          :value="key"
          class="mx-4px my-1px"
          :class="{ 'is-active': key === lang }"
          @click="changeLang(key)"
        >
          {{ label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped></style>
