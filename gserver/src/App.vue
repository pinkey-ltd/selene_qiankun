<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
import { useStore } from '@/stores/model';

import TableList from '@/components/TableList.vue'
import Form from '@/components/ModelForm.vue'

const store = useStore()
const openEdit = () => {
  store.isFormShow = true
}
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <div class="container is-fluid">
      <section class="section">
        <nav class="level">
          <div class="leve-left">
            <div class="level-item">
              <div class="level-item">
                <div class="field has-addons">
                  <p class="control">
                    <input class="input" type="text" placeholder="请输入名称……" />
                  </p>
                  <p class="control">
                    <button class="button is-info">搜索</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button @click="openEdit()" class="button is-link">上传模型</button>
            </div>
          </div>
        </nav>
        <div class="content">
          <TableList />
        </div>
      </section>
    </div>
    <Form v-if="store.isFormShow" />
  </n-config-provider>
</template>
