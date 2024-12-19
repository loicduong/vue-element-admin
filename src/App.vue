<script setup lang="ts">
import type { WatermarkProps } from 'element-plus'
import GlobalBuildDesc from '@/layouts/modules/global-build-desc/index.vue'
import { getEnvVariable } from '@/utils/env'
import { uiLocales } from './locales/ui'
import { useAppStore } from './store/modules/app'
import { useThemeStore } from './store/modules/theme'

defineOptions({ name: 'App' })

const appStore = useAppStore()
const themeStore = useThemeStore()

const locale = computed(() => uiLocales[appStore.locale])

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermark.text,
    cross: true,
    fontSize: 16,
    lineHeight: 16,
    gap: [100, 120],
    rotate: -15,
    zIndex: 9999,
  }
})

const buildDesc = computed(() => `${getEnvVariable('VITE_BUILD_PREFIX')}${BUILD_DESC}`)
</script>

<template>
  <ElConfigProvider :locale="locale">
    <AppProvider>
      <ElWatermark v-if="themeStore.watermark.visible" v-bind="watermarkProps">
        <RouterView class="bg-layout" />
      </ElWatermark>
      <RouterView v-else class="bg-layout" />
      <GlobalBuildDesc v-if="Boolean(buildDesc)" :data="buildDesc" />
    </AppProvider>
  </ElConfigProvider>
</template>

<style scoped></style>
