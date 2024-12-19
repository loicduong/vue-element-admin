<script lang="ts" setup>
import type { Options } from 'typeit'
import type { El } from 'typeit/dist/types'
import TypeIt from 'typeit'

definePage({ meta: { icon: 'mdi:typewriter' } })

const textRef = shallowRef<El>()

function init() {
  if (!textRef.value)
    return

  const options: Options = {
    strings: 'VueElementAdmin is a fresh, elegant, visually appealing, and powerful backend management template.',
    lifeLike: true,
    speed: 120,
    loop: true,
  }

  const initTypeIt = new TypeIt(textRef.value, options)

  initTypeIt.go()
}

onMounted(() => (init()))
</script>

<template>
  <div>
    <ElCard header="Typewriter Plugin" class="h-full card-wrapper">
      <ElSpace direction="vertical">
        <GithubLink link="https://github.com/alexmacarthur/typeit" />
        <WebSiteLink label="Document address: " link="https://www.typeitjs.com/docs/vanilla/usage/" />
      </ElSpace>
      <ElDivider content-position="left">
        Basic Example
      </ElDivider>
      <span ref="textRef" class="text-18px" />
    </ElCard>
  </div>
</template>

<style scoped></style>
