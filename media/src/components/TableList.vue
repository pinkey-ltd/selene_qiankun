<template>
  <n-data-table :columns="columns" :data="store.list" bordered />
</template>

<script setup lang="ts">
import { onMounted, h } from 'vue'
import { useStore } from '@/stores/play';
import { NButton, createDiscreteApi, NDataTable, NDivider } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import type { List } from '@/stores/model';


const store = useStore()
const { message, dialog } = createDiscreteApi(["message", "dialog"])

const columns: DataTableColumns<List> = [
  {
    title: '#',
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: '名称',
    key: 'Name'
  },
  {
    title: '上传时间',
    key: 'UpdatedAt',
    render(row) {
      return customDate(row.UpdatedAt)
    }
  },
  {
    title: '状态',
    key: 'Status',
    render(row) {
      return customStatus(row.Status)
    }
  },
  {
    title: '备注',
    key: 'Comments'
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
          { default: () => '编辑' }),
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
// Method
const preview = (row: List) => {
  if (row.Url == "") {
    console.log("Error: ", row)
    message.error(`播放` + row.Name + `错误`)
  } else {
    store.setUrl(row.Url)
  }
  // TDDO show play component

}

const edit = (row: List) => {

}
const remove = (row: List) => {
  dialog.error({
    title: '警告',
    content: '确认删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      store.removeVideo(row.ID)
    }
  })


}
const customDate = (input: string) => {
  return input.slice(0, 10) + " " + input.slice(11, 19)
}
const customStatus = (input: string) => {
  let res = '不可用'
  switch (input) {
    case 'OK':
      res = '可用'
      break;
    case 'loading':
      res = '处理中'
      break;
  }
  return res
}
// Mount
onMounted(() => {
  store.fetchList()
})
</script>