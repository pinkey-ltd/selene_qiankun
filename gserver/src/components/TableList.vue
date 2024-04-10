<template>
  <n-data-table :columns="columns" :data="store.list" :pagination="pagination" bordered />
</template>

<script setup lang="ts">
import { onMounted, h, ref } from 'vue'
import { useStore } from '@/stores/model';
import type { ListInner } from '@/stores/model';
import { NButton, createDiscreteApi, NDataTable, NDivider } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'


const store = useStore()
const { dialog } = createDiscreteApi(["message", "dialog"])

const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  showSizePicker: true
})

const columns: DataTableColumns<ListInner> = [
  {
    title: '模型名称',
    key: 'name'
  },
  {
    title: '模型编码',
    key: 'code',
  },
  {
    title: '模型类型',
    key: 'type',
  },
  {
    title: '所属项目',
    key: 'project',
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        'div',
        [h(
          NButton,
          {
            size: 'small',
            type: 'info',
            text: true,
            onClick: () => preview(row)
          },
          { default: () => '预览' }),
        h(
          NDivider,
          { vertical: true }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'success',
            text: true,
            onClick: () => edit(row)
          },
          { default: () => '修改' }),
        h(
          NDivider,
          { vertical: true }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            text: true,
            onClick: () => remove(row)
          },
          { default: () => '删除' }),
        ]
      )
    }
  }
]

const edit = (row: ListInner) => {
  store.model = row
  store.isFormShow = true
}
const remove = (row: ListInner) => {
  dialog.error({
    title: '警告',
    content: '确认删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      store.removeModel(row.id)
    }
  })
}
const preview = (row: ListInner) => {
  store.preview_address = row.url
  store.isPreviewShow = true
}

// Mounted
onMounted(() => {
  store.fetchList()
})
</script>