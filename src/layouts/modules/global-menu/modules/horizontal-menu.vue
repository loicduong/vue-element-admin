<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'
import { useRouterPush } from '@/hooks/common/router'
import { useRouteStore } from '@/store/modules/route'
import { useMenu } from '../../../context'
import MenuItem from '../components/menu-item.vue'

defineOptions({ name: 'HorizontalMenu' })

const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const { selectedKey } = useMenu()
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="selectedKey"
      @select="val => routerPushByKeyWithMetaQuery(val as App.Global.RouteKey)"
    >
      <MenuItem v-for="item in routeStore.menus" :key="item.key" :item="item" :index="item.key" />
    </ElMenu>
  </Teleport>
</template>

<style scoped></style>
