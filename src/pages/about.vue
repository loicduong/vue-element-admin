<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import pkg from '~/package.json'

definePage({
  meta: {
    icon: 'fluent:book-information-24-regular',
    order: 10,
  },
})

const appStore = useAppStore()

const column = computed(() => (appStore.isMobile ? 1 : 2))

interface PkgJson {
  name: string
  version: string
  dependencies: PkgVersionInfo[]
  devDependencies: PkgVersionInfo[]
  engines?: {
    pnpm?: string
    node?: string
  }
}

interface PkgVersionInfo {
  name: string
  version: string
}

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple
  return {
    name: $name,
    version: $version,
  }
}

const pkgJson: PkgJson = {
  name,
  version,
  engines: {
    pnpm: pkg.engines?.pnpm,
    node: pkg.engines?.node,
  },
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item)),
}

const latestBuildTime = BUILD_TIME

const website = 'https://v-naive-admin.vercel.app'
</script>

<template>
  <ElSpace direction="vertical" fill :size="16">
    <ElCard :header="$t('page.about.title')" class="card-wrapper">
      <p>{{ $t('page.about.introduction') }}</p>
    </ElCard>
    <ElCard :header="$t('page.about.projectInfo.title')" class="card-wrapper">
      <ElDescriptions border :column="column">
        <ElDescriptionsItem :label="$t('page.about.projectInfo.version')">
          <ElTag type="primary">
            {{ pkgJson.version }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <ElTag type="primary">
            {{ latestBuildTime }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.about.projectInfo.node')">
          <ElTag type="primary">
            {{ pkgJson?.engines?.node }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.about.projectInfo.pnpm')">
          <ElTag type="primary">
            {{ pkgJson?.engines?.pnpm }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.githubLink') }}
          </a>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a class="text-primary" :href="website" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
    <ElCard class="card-wrapper">
      <template #header>
        <span class="mr-2">{{ $t('page.about.prdDep') }}</span>
        <ElTag type="info" round :bordered="false" size="small">
          {{ pkgJson.dependencies.length }}
        </ElTag>
      </template>
      <ElDescriptions border :column="column">
        <ElDescriptionsItem
          v-for="item in pkgJson.dependencies"
          :key="item.name"
          :label="item.name"
        >
          <a
            v-if="!item.version.includes('workspace')"
            :href="`https://www.npmjs.com/package/${item.name}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.version }}
          </a>
          <template v-else>
            {{ item.version }}
          </template>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
    <ElCard class="card-wrapper">
      <template #header>
        <span class="mr-2">{{ $t('page.about.devDep') }}</span>
        <ElTag type="info" round :bordered="false" size="small">
          {{ pkgJson.devDependencies.length }}
        </ElTag>
      </template>
      <ElDescriptions border :column="column">
        <ElDescriptionsItem
          v-for="item in pkgJson.devDependencies"
          :key="item.name"
          :label="item.name"
        >
          <a
            v-if="!item.version.includes('workspace')"
            :href="`https://www.npmjs.com/package/${item.name}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.version }}
          </a>
          <template v-else>
            {{ item.version }}
          </template>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
