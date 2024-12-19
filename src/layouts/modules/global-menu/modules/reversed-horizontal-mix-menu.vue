<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useRouterPush } from '@/hooks/common/router'
import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { SimpleScrollbar } from '@sa/materials'
import { useMenu, useMixMenuContext } from '../../../context'
import MenuItem from '../components/menu-item.vue'

defineOptions({ name: 'ReversedHorizontalMixMenu' })

const route = useRoute()
const appStore = useAppStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()
const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren,
} = useMixMenuContext()
const { selectedKey } = useMenu()

function handleSelectMixMenu(key: App.Global.RouteKey) {
  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key)
  }
}

const expandedKeys = ref<string[]>([])

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  { immediate: true },
)
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      mode="horizontal"
      :ellipsis="false"
      :default-active="activeFirstLevelMenuKey"
      @select="val => handleSelectMixMenu(val as App.Global.RouteKey)"
    >
      <MenuItem v-for="item in firstLevelMenus" :key="item.key" :item="item" :index="item.key" />
    </ElMenu>
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :ellipsis="false"
        :default-active="selectedKey"
        :collapse="appStore.siderCollapse"
        @select="val => routerPushByKeyWithMetaQuery(val as App.Global.RouteKey)"
      >
        <MenuItem v-for="item in childLevelMenus" :key="item.key" :item="item" :index="item.key" />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
