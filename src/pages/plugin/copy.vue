<script setup lang="ts">
definePage({ meta: { icon: 'mdi:clipboard-outline' } })

const { copy, isSupported } = useClipboard()

const source = ref('')

async function handleCopy() {
  if (!isSupported) {
    window.$message?.error('Your browser does not support the Clipboard API')
    return
  }

  if (!source.value) {
    window.$message?.error('Please enter the content to be copied')
    return
  }

  await copy(source.value)
  window.$message?.success(`Copy successful: ${source.value}`)
}
</script>

<template>
  <div class="h-full">
    <ElCard header="Text Copy" class="h-full card-wrapper">
      <ElInput v-model="source" placeholder="Please enter the content to be copied">
        <template #append>
          <ElButton type="primary" @click="handleCopy">
            Copy
          </ElButton>
        </template>
      </ElInput>
    </ElCard>
  </div>
</template>
