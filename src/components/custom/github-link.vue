<script setup lang="ts">
import WebSiteLink from './web-site-link.vue'

defineOptions({ name: 'GithubLink' })

interface Props {
  /** github link */
  link: string
}

defineProps<Props>()
</script>

<template>
  <WebSiteLink label="GitHub address: " :link="link" />
</template>

<style scoped></style>
