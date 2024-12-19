<script setup lang="ts">
import { useLoading } from '@sa/hooks'
import VuePdfEmbed from 'vue-pdf-embed'

definePage({ meta: { icon: 'mdi:file-link-outline' } })

const { loading, endLoading } = useLoading(true)

const pdfRef = shallowRef<InstanceType<typeof VuePdfEmbed> | null>(null)
const source = `https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf`

const showAllPages = ref(false)
const currentPage = ref<undefined | number>(1)
const pageCount = ref(1)

function onPdfRendered() {
  endLoading()

  if (pdfRef.value?.doc) {
    pageCount.value = pdfRef.value.doc.numPages
  }
}

const showAllPagesChange = () => (currentPage.value = showAllPages.value ? undefined : 1)

const rotations = [0, 90, 180, 270]
const currentRotation = ref(0)

const handleRotate = () => (currentRotation.value = (currentRotation.value + 1) % 4)

const handlePrint = async () => (await pdfRef.value?.print(undefined, 'test.pdf', true))

const handleDownload = async () => (await pdfRef.value?.download('test.pdf'))
</script>

<template>
  <div class="overflow-hidden">
    <ElCard header="PDF Link Preview" class="h-full card-wrapper" body-class="overflow-hidden">
      <div class="h-[calc(100%-30px)] flex-col-stretch">
        <GithubLink link="https://github.com/hrynko/vue-pdf-embed" />
        <WebSiteLink
          label="Document address: "
          link="https://www.npmjs.com/package/vue-pdf-embed"
        />
        <div class="flex-y-center justify-end gap-12px">
          <ElCheckbox v-model="showAllPages" @change="showAllPagesChange">
            Show all pages
          </ElCheckbox>
          <ButtonIcon tooltip-content="旋转90度" @click="handleRotate">
            <icon-material-symbols-light:rotate-90-degrees-ccw-outline-rounded />
          </ButtonIcon>
          <ButtonIcon tooltip-content="打印" @click="handlePrint">
            <icon-mdi:printer />
          </ButtonIcon>
          <ButtonIcon tooltip-content="下载" @click="handleDownload">
            <icon-charm:download />
          </ButtonIcon>
        </div>
        <ElScrollbar class="flex-1-hidden">
          <ElSkeleton v-if="loading" class="mt-12px" :rows="12" />
          <VuePdfEmbed
            ref="pdfRef"
            class="overflow-auto container"
            :class="{ 'h-0': loading }"
            :rotation="rotations[currentRotation]"
            :page="currentPage"
            :source="source"
            @rendered="onPdfRendered"
          />
        </ElScrollbar>
        <div class="flex-y-center justify-between">
          <div v-if="showAllPages" class="text-18px font-medium">
            Total {{ pageCount }} pages
          </div>
          <ElPagination
            v-else
            key="pdf-page"
            layout="prev, pager, next"
            background
            :page-count="pageCount"
            @current-change="currentPage = $event"
          />
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped></style>
