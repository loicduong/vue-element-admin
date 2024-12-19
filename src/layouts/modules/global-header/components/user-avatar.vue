<script setup lang="ts">
import { useSvgIcon } from '@/hooks/common/icon'
import { useRouterPush } from '@/hooks/common/router'
import { $t } from '@/locales'
import { useAuthStore } from '@/store/modules/auth'

defineOptions({ name: 'UserAvatar' })

const authStore = useAuthStore()
const { routerPushByKey, toLogin } = useRouterPush()
const { SvgIconVNode } = useSvgIcon()

const loginOrRegister = () => (toLogin())

type DropdownKey = '/user-center' | 'logout'

type DropdownOption = {
  key: DropdownKey
  label: string
  icon?: () => VNode
}

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: '/user-center',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 }),
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 }),
    },
  ]

  return opts
})

function logout() {
  window.$messageBox
    ?.confirm($t('common.logoutConfirm'), $t('common.tip'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning',
    })
    .then(() => {
      authStore.resetStore()
    })
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout()
  }
  else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key as App.Global.RouteKey)
  }
}
</script>

<template>
  <ElButton v-if="!authStore.isLogin" text @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </ElButton>

  <ElDropdown class="px-14px" trigger="click" @command="handleDropdown">
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="{ key, label, icon } in options"
          :key="key"
          class="mx-4px my-1px rounded-6px"
          :icon="icon"
          :command="key"
        >
          {{ label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
    <div class="flex items-center">
      <SvgIcon icon="ph:user-circle" class="mr-5px text-icon-large" />
      <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
    </div>
  </ElDropdown>
</template>

<style scoped></style>
