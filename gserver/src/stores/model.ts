import { defineStore } from 'pinia'
import {
  deleteModel,
  requestList,
  requestRoleList,
  createModel,
  updateModel,
  requestSubTypeList,
  searchList,
  preloadModel,
  multiUpdateModel
} from '@/api/model'
import { computed, ref } from 'vue'
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
  is_publish?: boolean
  created_at?: string
  wbs_id?: string
  comments?: string
}

export interface MultiUpdateReq {
  ids: string[]
  org_ids?: string[]
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
  is_publish?: boolean
  created_at?: string
  wbs_id?: string
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
  ID: string
  name: string
  type: string
  stake_sign: string
  stake_start_k: string
  stake_start_m: string
  stake_end_k: string
  stake_end_m: string
}
export const useStore = defineStore('modelList', () => {
  const { message } = createDiscreteApi(['message'])
  const isFormShow = ref(false)
  const isRoleFormShow = ref(false)
  const isPreviewShow = ref(false)
  const list = ref<List[]>([])
  const roles = ref<Role[]>([])
  const model = ref<ListInner | null>(null)
  const multiModifyRoleModel = ref<MultiUpdateReq | null>(null)
  const sub_type_options = ref<string[]>([])
  const sub_name_optinns = ref<SubType[]>([])
  const preview_address = ref<string>('')
  const selectedRowIDs = ref<string[]>([])

  const fetchList = async () => {
    const { data } = await requestList(999, 1)
    list.value = data.content
    return data
  }

  const fetchListByX = async (params: Map<string, string>) => {
    const { data } = await searchList(999, 1, params)
    list.value = data.content
    return
  }

  const fetchRole = async () => {
    const { data } = await requestRoleList()
    roles.value = transTreeData(data, 'dept_id', 'parent_id', 'children')

    return roles.value
  }

  const fetchSubTypeList = async () => {
    const { data } = await requestSubTypeList()
    sub_type_options.value = distinct(data, 'type')
    for (const key in data) {
      if (data[key].stake_sign && data[key].stake_start_m) {
        // fix: 桩号K0+000（数字必须显示够3位）
        const pre_stake_start_m = <number>data[key].stake_start_m
        let pre_stake_start_m_string = ''
        if (pre_stake_start_m < 100) {
          if (pre_stake_start_m < 10) {
            pre_stake_start_m_string = '00' + pre_stake_start_m
          } else {
            pre_stake_start_m_string = '0' + pre_stake_start_m
          }
        } else {
          pre_stake_start_m_string = pre_stake_start_m.toString()
        }
        // fix: 后续桩号都为0，则不显示
        let after_stake =
          '~' + data[key].stake_sign + data[key].stake_end_k + '+' + data[key].stake_end_m
        // console.log('hit', <number>data[key].name, data[key].stake_end_m)
        if (<number>data[key].stake_end_m == 0 && <number>data[key].stake_end_k == 0) {
          after_stake = ''
        }
        data[key].name =
          data[key].stake_sign +
          data[key].stake_start_k +
          '+' +
          pre_stake_start_m_string +
          after_stake +
          data[key].name
      }
    }
    sub_name_optinns.value = data
    return data
  }
  const refresh = () => {
    fetchList()
  }

  const preloadPreview = async () => {
    preloadModel(preview_address.value).catch((err: any) => {
      message.error('您无权限访问模型')
      console.log('预加载模型失败：', err)
    })
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
        is_publish: true,
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

  const multiModifyModel = () => {
    multiUpdateModel(multiModifyRoleModel.value)
      .then(() => {
        message.success('修改成功！')
        refresh()
      })
      .catch((err) => {
        message.error('修改失败：' + err)
        refresh()
      })
  }

  const setSelectedRowIDs = (data: string[]) => {
    selectedRowIDs.value = data
  }

  // inner
  const interceptors = () => {
    // 业务逻辑：type != 'BIM' ,sub_type = null
    if (model.value) {
      if (model.value?.type != 'BIM') {
        model.value!.sub_type = null
      }
    }
    // 业务逻辑：name isSelected 填充 wbs_id
    const isSelected = model.value!.type == 'BIM' && model.value?.sub_type != null
    if (isSelected) {
      for (const sub_name of sub_name_optinns.value) {
        if (sub_name.name == model.value?.name) {
          model.value.wbs_id = sub_name.ID
          break
        }
      }
    }
  }

  // getters
  const assetsLayerList = computed(() => {
    const res: List[] = []
    for (const l of list.value) {
      if (l.type == 'assets') {
        res.push(l)
      }
    }
    return res
  })

  return {
    list,
    roles,
    model,
    preview_address,
    sub_type_options,
    sub_name_optinns,
    selectedRowIDs,
    newModel,
    fetchList,
    fetchListByX,
    refresh,
    addModel,
    modifyModel,
    removeModel,
    fetchRole,
    fetchSubTypeList,
    preloadPreview,
    multiModifyModel,
    setSelectedRowIDs,
    multiModifyRoleModel,
    isFormShow,
    isRoleFormShow,
    isPreviewShow,
    assetsLayerList
  }
})
