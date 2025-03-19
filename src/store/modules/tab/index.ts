import { SetupStoreId } from '@/constants/enum'
import { useRouterPush } from '@/hooks/common/router'
import { router } from '@/router'
import { useRouteStore } from '@/store/modules/route'
import { localStg } from '@/utils/storage'
import { defineStore } from 'pinia'
import { useThemeStore } from '../theme'
import {
  extractTabsByAllRoutes,
  filterTabsByIds,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  getTabIdByRoute,
  isTabInTabs,
  updateTabByI18nKey,
  updateTabsByI18nKey,
} from './shared'

export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  const routeStore = useRouteStore()
  const themeStore = useThemeStore()
  const { routerPush } = useRouterPush(false)

  /** Tabs */
  const tabs = ref<App.Global.Tab[]>([])

  /** Get active tab */
  const homeTab = ref<App.Global.Tab>()

  /** Init home tab */
  function initHomeTab() {
    homeTab.value = getDefaultHomeTab(router, routeStore.routeHome)
  }

  /** Get all tabs */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value))

  /** Active tab id */
  const activeTabId = ref<string>('')

  /**
   * Set active tab id
   *
   * @param id Tab id
   */
  function setActiveTabId(id: string) {
    activeTabId.value = id
  }

  /**
   * Init tab store
   *
   * @param currentRoute Current route
   */
  function initTabStore(currentRoute: App.Global.TabRoute) {
    const storageTabs = localStg.get('globalTabs')

    if (themeStore.tab.cache && storageTabs) {
      const extractedTabs = extractTabsByAllRoutes(router, storageTabs)
      tabs.value = updateTabsByI18nKey(extractedTabs)
    }

    addTab(currentRoute)
  }

  /**
   * Add tab
   *
   * @param route Tab route
   * @param active Whether to activate the added tab
   */
  function addTab(route: App.Global.TabRoute, active = true) {
    const tab = getTabByRoute(route)

    const isHomeTab = tab.id === homeTab.value?.id

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab)
    }

    if (active) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * Remove tab
   *
   * @param tabId Tab id
   */
  async function removeTab(tabId: string) {
    const removeTabIndex = tabs.value.findIndex(tab => tab.id === tabId)
    if (removeTabIndex === -1) {
      return
    }

    const isRemoveActiveTab = activeTabId.value === tabId
    const nextTab = tabs.value[removeTabIndex + 1] || homeTab.value

    tabs.value.splice(removeTabIndex, 1)
    if (isRemoveActiveTab && nextTab) {
      await switchRouteByTab(nextTab)
    }
  }

  /** remove active tab */
  async function removeActiveTab() {
    await removeTab(activeTabId.value)
  }

  /**
   * remove tab by route name
   *
   * @param routeName route name
   */
  async function removeTabByRouteName(routeName: App.Global.RouteKey) {
    const tab = findTabByRouteName(routeName, tabs.value)
    if (!tab)
      return

    await removeTab(tab.id)
  }

  /**
   * Clear tabs
   *
   * @param excludes Exclude tab ids
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes]
    const removedTabsIds = tabs.value.map(tab => tab.id).filter(id => !remainTabIds.includes(id))

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value)
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value

    await switchRouteByTab(activeTab)
    update()
  }

  const { routerPushByKey } = useRouterPush()
  /**
   * Replace tab
   *
   * @param key Route key
   * @param options Router push options
   */
  async function replaceTab(key: App.Global.RouteKey, options?: App.Global.RouterPushOptions) {
    const oldTabId = activeTabId.value

    // push new route
    await routerPushByKey(key, options)

    // remove old tab (exclude fixed tab)
    if (!isTabRetain(oldTabId)) {
      await removeTab(oldTabId)
    }
  }

  /**
   * Switch route by tab
   *
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    const fail = await routerPush(tab.fullPath)
    if (!fail) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * Clear left tabs
   *
   * @param tabId
   */
  async function clearLeftTabs(tabId: string) {
    const tabIds = tabs.value.map(tab => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1)
      return

    const excludes = tabIds.slice(index)
    await clearTabs(excludes)
  }

  /**
   * Clear right tabs
   *
   * @param tabId
   */
  async function clearRightTabs(tabId: string) {
    const isHomeTab = tabId === homeTab.value?.id
    if (isHomeTab) {
      clearTabs()
      return
    }

    const tabIds = tabs.value.map(tab => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1)
      return

    const excludes = tabIds.slice(0, index + 1)
    await clearTabs(excludes)
  }

  /**
   * Set new label of tab
   *
   * @default
   * @param label New tab label
   * @param tabId Tab id
   */
  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find(item => item.id === id)
    if (!tab)
      return

    tab.oldLabel = tab.label
    tab.newLabel = label
  }

  /**
   * Reset tab label
   *
   * @default
   * @param tabId Tab id
   */
  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find(item => item.id === id)
    if (!tab)
      return

    tab.newLabel = undefined
  }

  /**
   * Is tab retain
   *
   * @param tabId
   */
  function isTabRetain(tabId: string) {
    if (tabId === homeTab.value?.id)
      return true

    const fixedTabIds = getFixedTabIds(tabs.value)

    return fixedTabIds.includes(tabId)
  }

  /** Update tabs by locale */
  function updateTabsByLocale() {
    tabs.value = updateTabsByI18nKey(tabs.value)

    if (homeTab.value) {
      homeTab.value = updateTabByI18nKey(homeTab.value)
    }
  }

  /** Cache tabs */
  function cacheTabs() {
    if (!themeStore.tab.cache)
      return

    localStg.set('globalTabs', tabs.value)
  }

  // cache tabs when page is closed or refreshed
  useEventListener(window, 'beforeunload', () => {
    cacheTabs()
  })

  return {
    /** All tabs */
    tabs: allTabs,
    activeTabId,
    initHomeTab,
    initTabStore,
    addTab,
    removeTab,
    removeActiveTab,
    removeTabByRouteName,
    replaceTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    switchRouteByTab,
    setTabLabel,
    resetTabLabel,
    isTabRetain,
    updateTabsByLocale,
    getTabIdByRoute,
    cacheTabs,
  }
})
