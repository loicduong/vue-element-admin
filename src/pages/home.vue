<script setup lang="ts">
import CardData from '@/components/modules/home/card-data.vue'
import CreativityBanner from '@/components/modules/home/creativity-banner.vue'
import HeaderBanner from '@/components/modules/home/header-banner.vue'
import LineChart from '@/components/modules/home/line-chart.vue'
import PieChart from '@/components/modules/home/pie-chart.vue'
import ProjectNews from '@/components/modules/home/project-news.vue'
import { useAppStore } from '@/store/modules/app'

definePage({
  meta: {
    icon: 'mdi:monitor-dashboard',
    order: 1,
  },
})

const appStore = useAppStore()

const gap = computed(() => (appStore.isMobile ? 0 : 16))
</script>

<template>
  <ElSpace direction="vertical" fill class="pb-0" :size="0">
    <HeaderBanner class="mb-16px" />
    <CardData class="mb-16px" />
    <ElRow :gutter="gap">
      <ElCol :lg="14" :sm="24" class="mb-16px">
        <ElCard class="card-wrapper">
          <LineChart />
        </ElCard>
      </ElCol>
      <ElCol :lg="10" :sm="24" class="mb-16px">
        <ElCard class="card-wrapper">
          <PieChart />
        </ElCard>
      </ElCol>
    </ElRow>
    <ElRow :gutter="gap">
      <ElCol :lg="14" :sm="24" class="mb-16px">
        <ProjectNews />
      </ElCol>
      <ElCol :lg="10" :sm="24" class="mb-16px">
        <CreativityBanner />
      </ElCol>
    </ElRow>
  </ElSpace>
</template>

<style scoped></style>
