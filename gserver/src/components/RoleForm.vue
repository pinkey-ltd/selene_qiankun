<script setup lang="ts">
import { NModal, NCard, NButton, NForm, NTreeSelect, NSpace, NFormItem, type FormInst, createDiscreteApi, type FormRules } from "naive-ui"
import { useStore } from '@/stores/model';
import type { MultiUpdateReq } from '@/stores/model'
import { onMounted, ref } from "vue";

const { message } = createDiscreteApi(['message'])
const store = useStore()
const formRef = ref<FormInst | null>(null)
const model = ref<MultiUpdateReq>({
  ids: [],
  org_ids: []
})

const rules: FormRules = {
  org_ids: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择权限',
    type: 'array'
  },
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

const close = () => {
  store.multiModifyRoleModel = null
  store.isRoleFormShow = false
}

const submit = () => {
  // TODO IDS
  store.multiModifyRoleModel = {
    ids: store.selectedRowIDs,
    org_ids: []
  }
  model.value.org_ids!.forEach((item) => {
    //@ts-ignore
    store.multiModifyRoleModel!.org_ids!.push({ raw: item })
  })
  store.multiModifyModel()
  store.multiModifyRoleModel = null
  store.isRoleFormShow = false
}

// Mounted
onMounted(() => {
  store.fetchRole()
})
</script>

<template>
  <n-modal v-model:show="store.isRoleFormShow">
    <n-card style="width: 720px" title="批量修改" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="right-hanging" label-placement="left"
        label-width="auto">
        <n-form-item :span="12" label="权限管理：" path="org_ids">
          <n-tree-select v-model:value="model.org_ids" multiple cascade checkable :options="store.roles"
            key-field="dept_id" label-field="dept_name" />
        </n-form-item>

      </n-form>
      <template #footer>
        <n-space>
          <n-button @click="formValidate()" type="primary">提交</n-button>
          <n-button @click="close()">取消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>