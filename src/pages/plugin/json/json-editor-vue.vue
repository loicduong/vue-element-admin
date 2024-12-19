<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

definePage({ meta: { icon: 'mdi:code-json' } })

interface JsonValue {
  bigint?: string
  boolean?: boolean
  string?: string
  number?: number
  color?: string
  null?: null
  time?: number
  array?: number[]
  object?: Record<string, unknown>
  [key: string]: unknown
}

interface JsonData {
  value: JsonValue | number | string | undefined
  mode?: InstanceType<typeof JsonEditorVue>['mode']
  readOnly?: boolean
}

const data = reactive<JsonData>({
  value: {
    bigint: '124124124124124124124',
    boolean: true,
    string: 'Hello World',
    number: 123.456,
    color: '#b0a4e3',
    null: null,
    time: 1575599819000,
    array: [1, 2],
    object: {
      a: 'b',
      c: 'd',
    },
  },
  mode: 'text' as InstanceType<typeof JsonEditorVue>['mode'],
  readOnly: false,
})
</script>

<template>
  <div class="overflow-hidden">
    <ElCard
      header="JSON Editor Vue"
      body-class="overflow-y-hidden overflow-x-auto"
      class="h-full card-wrapper"
    >
      <GithubLink link="https://github.com/cloydlau/json-editor-vue" class="mb-4" />
      <div class="mb-4 flex gap-2">
        <ElButton @click="data.value = Math.random()">
          Set value to string
        </ElButton>
        <ElButton @click="data.value = { abc: Math.random() }">
          Set value to JSON
        </ElButton>
        <ElButton @click="data.value && typeof data.value === 'object' && (data.value.number = Math.random())">
          Change property
        </ElButton>
        <ElButton @click="data.value = undefined">
          Clear
        </ElButton>
        <ElButton @click="data.mode = data.mode === 'text' ? 'tree' : 'text'">
          Toggle Mode
        </ElButton>
        <ElButton @click="data.readOnly = !data.readOnly">
          Toggle read-only
        </ElButton>
      </div>
      <JsonEditorVue
        v-model="data.value"
        :mode="data.mode"
        :read-only="data.readOnly"
        class="mb-4"
      />
      <ElDescriptions :column="1">
        <ElDescriptionsItem label="Mode">
          {{ data.mode }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Value">
          {{ JSON.stringify(data.value) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Type">
          {{ typeof data.value }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </div>
</template>
