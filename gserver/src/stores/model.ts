import { defineStore } from 'pinia'
import {
  deleteModel,
  requestList,
  requestRoleList,
  createModel,
  updateModel,
  requestSubTypeList
} from '@/api/model'
import { ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'
import { transTreeData, distinct } from './uitls'

export interface List {
  id: string
  name: string
  path: string
  code: string
  type: string | null
  sub_type: string | null
  file_type: string | null
  project: string
  url: string
  org_ids?: string[]
  x: string
  y: string
  z: string
  created_at?: string
}

export interface ListInner {
  id: string
  name: string
  path: string
  code: string
  type: string | null
  sub_type: string | null
  file_type: string | null
  project: string
  url: string
  org_ids?: Org[]
  x: string
  y: string
  z: string
  created_at?: string
}

export interface Org {
  id: string
  raw: string
  model_set_id: string
}

export interface Role {
  dept_id: string
  dept_name: string
  parent_id: string
}

export interface SubType {
  id: string
  name: string
  type: string
}
export const useStore = defineStore('modelList', () => {
  const { message } = createDiscreteApi(['message'])
  const isFormShow = ref(false)
  const isPreviewShow = ref(false)
  const list = ref<List[]>([])
  const roles = ref<Role[]>([])
  const model = ref<ListInner | null>(null)
  const sub_type_options = ref<string[]>([])
  const sub_name_optinns = ref<SubType[]>([])
  const preview_address = ref<string>('')

  const fetchList = async () => {
    const { data } = await requestList(999, 1)
    list.value = data.content
    return data
  }

  const fetchRole = async () => {
    const { data } = await requestRoleList()
    roles.value = transTreeData(data, 'dept_id', 'parent_id', 'children')

    return roles.value
  }

  const fetchSubTypeList = async () => {
    const { data } = await requestSubTypeList()
    sub_type_options.value = distinct(data, 'type')
    sub_name_optinns.value = data
    return data
  }
  const refresh = () => {
    fetchList()
  }

  const newModel = () => {
    if (!model.value) {
      model.value = {
        id: '',
        name: '',
        path: '',
        code: '',
        type: null,
        sub_type: null,
        file_type: null,
        project: '',
        url: '',
        x: '',
        y: '',
        z: '',
        org_ids: []
      }
    }
  }

  // apis
  const addModel = () => {
    interceptors()
    createModel(model.value)
      .then(() => {
        message.success('新增成功！')
        refresh()
      })
      .catch((err) => {
        message.error('新增失败：' + err)
        refresh()
      })
  }

  const modifyModel = () => {
    interceptors()
    updateModel(model.value)
      .then(() => {
        message.success('修改成功！')
        refresh()
      })
      .catch((err) => {
        message.error('修改失败：' + err)
        refresh()
      })
  }
  const removeModel = (id: string) => {
    interceptors()
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

  // inner
  const interceptors = () => {
    // 业务逻辑：type != 'BIM' ,sub_type = null
    if (model.value) {
      if (model.value?.type != 'BIM') {
        model.value!.sub_type = null
      }
    }
  }

  return {
    list,
    roles,
    model,
    preview_address,
    sub_type_options,
    sub_name_optinns,
    newModel,
    fetchList,
    refresh,
    addModel,
    modifyModel,
    removeModel,
    fetchRole,
    fetchSubTypeList,
    isFormShow,
    isPreviewShow
  }
})
