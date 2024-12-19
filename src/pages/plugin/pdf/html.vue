<script setup lang="ts">
import pagedCss from '@/assets/scss/paged.scss?inline'
import PdfHtmlAction from '@/components/modules/plugin/pdf/html/pdf-html-action.vue'
import PdfHtmlRoot from '@/components/modules/plugin/pdf/html/pdf-html-root.vue'
import { useLoading } from '@sa/hooks'
import { toPng } from 'html-to-image'
import { Handler, Previewer, registerHandlers } from 'pagedjs'

definePage({ meta: { icon: 'ph:file-html' } })

const a = useTemplateRef('root')
const preview = useTemplateRef('preview')
const scrollbar = useTemplateRef('scrollbarRef')

const { loading, endLoading } = useLoading(true)
const {
  loading: btnLoading,
  endLoading: btnEndLoading,
  startLoading: btnStartLoading,
} = useLoading()

const currentPage = ref(1)
const pageTotal = ref(1)

onMounted(async () => {
  class MyHandler extends Handler {
    afterPageLayout(pageElement: any) {
      const splitTables = pageElement.querySelectorAll(
        'table[data-split-from]',
      )

      splitTables.forEach((table: any) => {
        const originalTableId = table.getAttribute('data-split-from')

        const originalTable = document.querySelector(
          `table[data-split-to="${originalTableId}"]`,
        )
        if (!originalTable)
          return

        if (!table.querySelector('colgroup')) {
          const originalColgroup
            = originalTable.querySelector('table colgroup')
          if (originalColgroup) {
            const newColgroup = originalColgroup.cloneNode(true)
            table.insertBefore(newColgroup, table.firstChild)
          }
        }

        if (!table.querySelector('thead')) {
          const originalHeader = originalTable.querySelector('table thead')
          if (originalHeader) {
            const newHeader = originalHeader.cloneNode(true)
            if (table.querySelector('colgroup')) {
              table.querySelector('colgroup').after(newHeader)
            }
            else {
              table.insertBefore(newHeader, table.firstChild)
            }
          }
        }
      })
    }
  }

  registerHandlers(MyHandler)

  const paged = new Previewer()

  const { total } = await paged.preview(a.value?.$el?.innerHTML, [{ content: pagedCss }], preview.value)

  pageTotal.value = total

  endLoading()
})

function downloadPdf(pdfBlob: Blob) {
  const blobUrl = URL.createObjectURL(pdfBlob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = 'invoice.pdf'
  link.click()

  URL.revokeObjectURL(blobUrl)
}

async function handleDownload() {
  btnStartLoading()

  const sheets = Array.from(preview.value?.querySelectorAll('.pagedjs_sheet') || [])
  const worker = new Worker(new URL('@/workers/print-html.ts', import.meta.url), { type: 'module' })

  try {
    const images = await Promise.all(
      sheets.map(sheet => toPng(sheet as HTMLElement, {
        fontEmbedCSS: `
          @font-face {
            font-family: 'Gilroy';
            src: url('/fonts/Gilroy.woff2') format('woff2');
          }
        `,
        pixelRatio: 2.5,
        style: { backgroundColor: '#fff' },
      })),
    )

    const pdfPromise = new Promise<Blob>((resolve) => {
      worker.onmessage = event => resolve(event.data)
    })

    worker.postMessage(images)

    const pdfBlob = await pdfPromise

    downloadPdf(pdfBlob)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    worker.terminate()
    btnEndLoading()
  }
}

function handleScroll() {
  const pages = document.querySelectorAll('.pagedjs_page')
  const containerRect = scrollbar.value?.$el?.getBoundingClientRect()
  const containerMiddle = scrollbar.value?.$el?.offsetHeight / 2

  let current = 1

  pages.forEach((page, index) => {
    const rect = page.getBoundingClientRect()
    const pageTop = rect.top - containerRect.top

    if (pageTop <= containerMiddle) {
      current = index + 1
    }
  })
  currentPage.value = current
}
</script>

<template>
  <div class="overflow-hidden">
    <ElCard header="PDF HTML Preview" class="h-full card-wrapper" body-class="overflow-hidden">
      <div class="h-full flex-col-stretch">
        <GithubLink link="https://github.com/pagedjs/pagedjs" />
        <div class="flex-y-center justify-end gap-12px">
          <ButtonIcon tooltip-content="Download" :loading="btnLoading" @click="handleDownload">
            <icon-charm:download />
          </ButtonIcon>
        </div>
        <ElScrollbar ref="scrollbarRef" class="flex-1-hidden" @scroll="handleScroll">
          <ElSkeleton v-if="loading" class="mt-12px" :rows="12" />

          <PdfHtmlAction v-else v-model="currentPage" :total="pageTotal" />

          <PdfHtmlRoot ref="root" class="hidden" />

          <main ref="preview" class="bg-layout py-5" :class="{ 'h-0 overflow-hidden': loading }" />
        </ElScrollbar>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
:deep(.pagedjs_page) {
  margin: 0 auto;
  background-color: #fff;
}

:deep(.pagedjs_page:not(:last-child)) {
  margin-bottom: 20px;
}

:deep(.pagedjs_page .pagedjs_margin-bottom-center) {
  display: flex;
  align-items: flex-end;
}

:deep(.pagedjs_page .pagedjs_margin-top-center) {
  display: flex;
  align-items: flex-start;
}
</style>
