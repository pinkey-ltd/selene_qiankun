<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NButton, NInput, NSelect, NFlex } from 'naive-ui'
import { useStore } from '@/stores/model';

import TableList from '@/components/TableList.vue'
import Form from '@/components/ModelForm.vue'
import Preview from '@/components/ModelPreview.vue'
import { ref } from 'vue';

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
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <div class="container is-fluid">
      <section class="section">
        <n-flex justify="space-between">
          <n-flex justify="space-between">
            <n-input v-model:value="name" style="width: 200px" placeholder="请输入名称……" />
            <n-input v-model:value="code" style="width: 200px" placeholder="请输入模型编码……" />
            <n-select v-model:value="type" style="width: 200px" placeholder="请选择模型类型" :options="typeOptions"
              clearable />
            <n-button @click="search" type="primary">搜索</n-button>
          </n-flex>
          <n-button @click="openEdit()" type="info">上传模型</n-button>
        </n-flex>
        <div class="content" style="margin-top: 12px;">
          <TableList />
        </div>
      </section>
    </div>
    <Form v-if="store.isFormShow" />
    <Preview v-if="store.isPreviewShow" />
  </n-config-provider>
</template>
