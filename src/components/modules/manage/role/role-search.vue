<script setup lang="ts">
import { enableStatusOptions } from '@/constants/business'
import { $t } from '@/locales'
import { translateOptions } from '@/utils/common'

defineOptions({ name: 'RoleSearch' })

interface Emits {
  (e: 'reset'): void
  (e: 'search'): void
}

const emit = defineEmits<Emits>()

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true })

const reset = () => (emit('reset'))

const search = () => (emit('search'))
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse :default-expanded-names="['role-search']">
      <ElCollapseItem :title="$t('common.search')" name="role-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.role.roleName')" prop="roleName">
                <ElInput v-model="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.role.roleCode')" prop="roleCode">
                <ElInput v-model="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.role.roleStatus')" prop="status">
                <ElSelect
                  v-model="model.status as string"
                  :placeholder="$t('page.manage.role.form.roleStatus')"
                  clearable
                >
                  <ElOption
                    v-for="{ label, value } in translateOptions(enableStatusOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="24" :sm="24">
              <ElSpace class="w-full justify-end" alignment="end">
                <ElButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </ElButton>
                <ElButton type="primary" plain @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </ElButton>
              </ElSpace>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
