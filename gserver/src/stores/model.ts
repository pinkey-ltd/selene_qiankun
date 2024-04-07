import { defineStore } from 'pinia'
import { deleteModel, requestList, requestRoleList } from '@/api/model'
import { reactive, ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'

export interface List {
  id: string
  name: string
  path: string
  code: string
  type: string | null
  file_type: string | null
  project: string
  url: string
  org_ids?: string[]
  x: string
  y: string
  z: string
  created_at: string
}

export interface Org {
  id: string
  raw: string
  model_set_id: string
}

export const useStore = defineStore('modelList', () => {
  const { message } = createDiscreteApi(['message'])
  const list = ref<List[]>([])
  const roles = ref<any[]>([])

  const fetchList = async () => {
    const { data } = await requestList(999, 1)
    list.value = data.content
    return data
  }

  const fetchRole = async () => {
    const { data } = await requestRoleList()
    roles.value = data
    return data
  }
  const refresh = () => {
    fetchList()
  }
  const currentForm = reactive({
    ID: 0,
    Name: '',
    Comments: ''
  })
  const isFormShow = ref(false)

  const removeModel = (id: string) => {
    deleteModel(id)
      .then(() => {
        message.success('删除成功！')
        refresh()
      })
      .catch((err) => {
        message.error('删除失败：' + err)
        refresh()
      })
  }
  return { list, roles, fetchList, refresh, removeModel, fetchRole, currentForm, isFormShow }
})
