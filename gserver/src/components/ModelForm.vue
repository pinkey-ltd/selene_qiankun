<script setup lang="ts">
import { useStore } from '@/stores/model';
import { NModal, NButton, NForm, NInput, NFormItem, NUpload, NSelect, NFormItemGi, NGrid, NTreeSelect, NSpace, type FormRules, type UploadFileInfo, createDiscreteApi, NP, type FormInst } from 'naive-ui'
import { computed, onMounted, ref } from 'vue';
import type { List } from '@/stores/model'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

const store = useStore()
const { message } = createDiscreteApi(['message'])

const uploadHeaders = { 'Authorization': 'Bearer ' + localStorage.getItem("token") }

const formRef = ref<FormInst | null>(null)
const model = ref<List>({
  id: "",
  name: "",
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
})

const typeOptions = ['BIM', 'GIS', 'BackgroundModel'].map(
  (v) => ({
    label: v,
    value: v
  })
)
const fileTypeOptions = ['3dtiles', 'genJSON'].map(
  (v) => ({
    label: v,
    value: v
  })
)
const subTypeOptions = computed(() =>
  store.sub_type_options.map(
    (v) => ({
      label: v,
      value: v
    })
  ))

const rules: FormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入模型名称'
  },
  project: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入所属项目'
  },
  type: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择模型类型'
  },
  file_type: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择服务类型'
  },
  x: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入经度'
  },
  y: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入纬度'
  },
  z: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入高程'
  },
  org_ids: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择权限',
    type: 'array'
  },
}
const bodyStyle = ref({
  width: '720px'
})

const handlecUploaded = ({ event }: { event?: ProgressEvent }) => {
  //@ts-ignore
  model.value.path = JSON.parse(event!.target!.response).path
}
const beforeUpload = async (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  if (data.file.file?.type !== 'application/x-zip-compressed') {
    message.error('只能上传zip文件，请重新上传')
    return false
  }
  return true
}
const formValidate = () => {
  // validate
  formRef.value?.validate((errors) => {
    if (!errors) {
      submit()
    } else {
      console.log('表单验证失败：' + errors)
      message.error('验证失败：' + '请检查必填项!')
    }
  })
}

const submit = () => {
  let flage = false // default create
  if (!store.model) {
    // create model
    flage = true
    store.newModel()
  }
  // resolver
  for (let key in model.value) {
    //@ts-ignore
    store.model[key] = model.value[key]
  }
  store.model!.org_ids = []
  model.value.org_ids!.forEach((item) => {
    //@ts-ignore
    store.model!.org_ids!.push({ raw: item })
  })
  flage ? store.addModel() : store.modifyModel()
  store.model = null
  store.isFormShow = false
}
const close = () => {
  store.model = null
  store.isFormShow = false
}

const isSubType = computed(() => model.value.type != 'BIM')
const isSelectName = computed(() => model.value.type == 'BIM' && model.value.sub_type != null)
const sub_name_optinns = computed(() => {
  let options: SelectMixedOption[] = []
  for (let key in store.sub_name_optinns) {
    if (store.sub_name_optinns[key].type == model.value.sub_type) {
      options.push(store.sub_name_optinns[key])
    }
  }
  return options
})
// Mounted
onMounted(() => {
  if (store.model) {
    // resolver
    for (let key in model.value) {
      //@ts-ignore
      model.value[key] = store.model[key]
    }
    model.value.org_ids = []
    store.model.org_ids!.forEach((item) => {
      model.value.org_ids!.push(item.raw)
    })
  }
  store.fetchRole()
  store.fetchSubTypeList()
})

</script>

<template>
  <n-modal v-model:show="store.isFormShow" class="custom-card" preset="card" title="编辑&新建" positive-text="确认"
    :style="bodyStyle" negative-text="取消" @negative-click="close">
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="right-hanging" label-placement="left"
      label-width="auto">
      <n-form-item :span="12" label="模型名称：" path="name">
        <n-input v-if="!isSelectName" v-model:value="model.name" placeholder="请输入模型名称" />
        <n-select v-else v-model:value="model.name" label-field="name" value-field="name" placeholder="请选择模型名称"
          :options="sub_name_optinns" />
      </n-form-item>
      <n-form-item :span="12" label="模型编码：" path="code">
        <n-input v-model:value="model.code" disabled placeholder="上传模型后显示" />
      </n-form-item>
      <n-form-item :span="12" label="模型类型：" path="type">
        <n-select v-model:value="model.type" placeholder="请选择模型类型" :options="typeOptions" />
      </n-form-item>
      <n-form-item :span="12" label="构件类型：" path="sub_type">
        <n-select v-model:value="model.sub_type" placeholder="请选择模型子类型" :disabled="isSubType" :options="subTypeOptions"
          clearable />
      </n-form-item>
      <n-form-item :span="12" label="服务类型：" path="file_type">
        <n-select v-model:value="model.file_type" placeholder="请选择服务类型" :options="fileTypeOptions" />
      </n-form-item>
      <n-form-item :span="12" label="所属项目：" path="project">
        <n-input v-model:value="model.project" placeholder="请输入所属项目" />
      </n-form-item>
      <n-form-item :span="12" label="坐标：" path="x">
        <n-grid :cols="3" :x-gap="12">
          <n-form-item-gi path="x">
            <n-input v-model:value="model.x" placeholder="经度" />
          </n-form-item-gi>
          <n-form-item-gi path="y">
            <n-input v-model:value="model.y" placeholder="纬度" />
          </n-form-item-gi>
          <n-form-item-gi path="z">
            <n-input v-model:value="model.z" placeholder="高程" />
          </n-form-item-gi>
        </n-grid>
      </n-form-item>
      <n-form-item :span="12" label="权限管理：" path="org_ids">
        <n-tree-select v-model:value="model.org_ids" multiple cascade checkable :options="store.roles"
          key-field="dept_id" label-field="dept_name" />
      </n-form-item>
      <n-form-item :span="12" label="模型上传：" path="uploadValue">
        <n-upload action="/prod-api/api/upload/zip" :headers="uploadHeaders" @finish="handlecUploaded"
          @before-upload="beforeUpload">
          <n-button>点击上传</n-button>
          <n-p depth="2" style="margin: 8px 0 0 0; color:red">
            重新上传会覆盖原有模型数据。
          </n-p>
        </n-upload>
      </n-form-item>

    </n-form>
    <template #footer>
      <n-space>
        <n-button @click="formValidate()" type="primary">提交</n-button>
        <n-button @click="close()">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>