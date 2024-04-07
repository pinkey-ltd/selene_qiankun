<script setup lang="ts">
import { useStore } from '@/stores/model';
import { NModal, NButton, NForm, NInput, NFormItem, NUpload, NSelect, NFormItemGi, NGrid, NTreeSelect } from 'naive-ui'
import { onMounted, ref } from 'vue';
import type { List } from '@/stores/model'

const store = useStore()

const model = ref<List>({
  id: "",
  name: "",
  path: '',
  code: '',
  type: null,
  file_type: null,
  project: '',
  url: '',
  x: '',
  y: '',
  z: '',
  org_ids: [],
  created_at: ''
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
const rules = {
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
    trigger: ['blur', 'input'],
    message: '请选择权限'
  },
}
const bodyStyle = ref({
  width: '600px'
})

const close = () => {
  console.log("close!!!")
  store.isFormShow = false
}

// Mounted
onMounted(() => {
  store.fetchRole()
})
</script>
<template>
  <n-modal v-model:show="store.isFormShow" class="custom-card" preset="card" title="编辑&新建" positive-text="确认"
    :style="bodyStyle" negative-text="取消" @negative-click="close">
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="right-hanging" label-placement="left"
      label-width="auto">
      <n-form-item :span="12" label="模型名称：" path="name">
        <n-input v-model:value="model.name" placeholder="请输入模型名称" />
      </n-form-item>
      <n-form-item :span="12" label="模型编码：" path="code">
        <n-input v-model:value="model.code" disabled placeholder="获取中……" />
      </n-form-item>
      <n-form-item :span="12" label="模型类型：" path="type">
        <n-select v-model:value="model.type" placeholder="请选择模型类型" :options="typeOptions" />
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
        <n-tree-select v-model:value="model.org_ids" multiple cascade checkable :options="store.roles" key-field="id"
          label-field="name" />
      </n-form-item>
      <n-form-item :span="12" label="模型上传：" path="uploadValue">
        <n-upload>
          <n-button>点击上传</n-button>
        </n-upload>
      </n-form-item>

    </n-form>
    <template #footer>
      <n-button type="primary">提交</n-button>
      <n-button @click="close()">取消</n-button>
    </template>
  </n-modal>
</template>