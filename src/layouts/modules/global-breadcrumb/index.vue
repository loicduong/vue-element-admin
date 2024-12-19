<script setup lang="ts">
import { useRouterPush } from '@/hooks/common/router'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

defineOptions({ name: 'GlobalBreadcrumb' })

const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKey } = useRouterPush()

interface BreadcrumbContentProps { breadcrumb: App.Global.Menu }

const [
  DefineBreadcrumbContent,
  BreadcrumbContent,
] = createReusableTemplate<BreadcrumbContentProps>()

const handleClickMenu = (key: App.Global.RouteKey) => (routerPushByKey(key))
</script>

<template>
  <ElBreadcrumb v-if="themeStore.header.breadcrumb.visible">
    <DefineBreadcrumbContent v-slot="{ breadcrumb }">
      <div class="i-flex-y-center align-middle">
        <component :is="breadcrumb.icon" v-if="themeStore.header.breadcrumb.showIcon" class="mr-4px text-icon" />
        {{ breadcrumb.label }}
      </div>
    </DefineBreadcrumbContent>

    <ElBreadcrumbItem
      v-for="item in routeStore.breadcrumbs"
      :key="item.key"
    >
      <ElDropdown v-if="item.options?.length" @command="handleClickMenu">
        <BreadcrumbContent :breadcrumb="item" />
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="option in item.options" :key="option.key" :command="option.key">
              {{ option.label }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <RouterLink v-else :to="item.routeKey">
        <BreadcrumbContent :breadcrumb="item" />
      </RouterLink>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped></style>
