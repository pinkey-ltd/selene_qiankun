<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NButton, NInput, NSelect, NFlex, NLayout } from 'naive-ui'
import { useStore } from '@/stores/model';

import TableList from '@/components/TableList.vue'
import Form from '@/components/ModelForm.vue'
import RoleForm from '@/components/RoleForm.vue'
import Preview from '@/components/ModelPreview.vue'
import { computed, ref } from 'vue';

const store = useStore()

const typeOptions = ['BIM', 'GIS', 'BackgroundModel'].map(
  (v) => ({
    label: v,
    value: v
  })
)

const name = ref<string>('')
const code = ref<string>('')
const type = ref<string | null>(null)
const openEdit = () => {
  store.isFormShow = true
}
const openRoleEdit = () => {
  store.isRoleFormShow = true
}
const search = () => {
  let params: Map<string, string> = new Map()
  if (name.value != '') {
    params.set('name', name.value)
  }
  if (code.value != '') {
    params.set('code', code.value)
  }
  if (type.value) {
    params.set('type', type.value)
  }
  store.fetchListByX(params)
}
const enableRoleEdit = computed(() =>
  store.selectedRowIDs.length > 0)
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="{ common: { fontWeightStrong: '600' } }">
    <n-layout position="absolute" style="top: 32px; bottom: 32px">
      <n-flex justify="space-around" size="large">
        <section class="section">
          <n-flex justify="space-between">
            <n-flex justify="space-between">
              <n-input v-model:value="name" style="width: 200px" placeholder="请输入名称……" />
              <n-input v-model:value="code" style="width: 200px" placeholder="请输入模型编码……" />
              <n-select v-model:value="type" style="width: 200px" placeholder="请选择模型类型" :options="typeOptions"
                clearable />
              <n-button @click="search" type="primary">搜索</n-button>
            </n-flex>
            <n-flex justify="space-between">
              <n-button @click="openRoleEdit()" type="info" :disabled="!enableRoleEdit">批量修改权限</n-button>
              <n-button @click="openEdit()" type="success">上传模型</n-button></n-flex>
          </n-flex>
          <div class="content" style="margin-top: 12px;">
            <TableList />
          </div>
        </section>
      </n-flex>
    </n-layout>
    <Form v-if="store.isFormShow" />
    <RoleForm v-if="store.isRoleFormShow" />
    <Preview v-if="store.isPreviewShow" />
  </n-config-provider>
</template>
