<template>
  <n-data-table :columns="columns" :data="store.list" :pagination="pagination" bordered />
</template>

<script setup lang="ts">
import { onMounted, h, ref } from 'vue'
import { useStore } from '@/stores/model';
import type { List } from '@/stores/model';
import { NButton, createDiscreteApi, NDataTable, NDivider } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'


const store = useStore()
const { dialog } = createDiscreteApi(["message", "dialog"])

const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  showSizePicker: true
})

const columns: DataTableColumns<List> = [
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

const edit = (row: List) => {
  console.log(row)
}
const remove = (row: List) => {
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

// Mounted
onMounted(() => {
  store.fetchList()
})
</script>