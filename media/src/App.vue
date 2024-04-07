<template>
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
            <button @click="openEdit(null)" class="button is-link">上传视频</button>
          </div>
        </div>
      </nav>
      <div class="content">
        <TableList />
      </div>
    </section>
  </div>
  <!-- creat & update modal -->

</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { updateVideo } from '@/api/video'

import TableList from '@/components/TableList.vue'
import { useStore } from '@/stores/play';
import type { List } from '@/stores/model'

const store = useStore()
const app = getCurrentInstance();
const isModalActive = ref(false)

const openEdit = (row: List | null) => {
  // formTitle.value = row ? "编辑视频流" : "新建视频流"
  // if (row) {
  //   form.id = row.ID
  //   form.name = row.Name
  //   form.comments = row.Comments
  // }
  isModalActive.value = true
}
const submit = () => {
  if (formTitle.value == "新建视频流") {
    // create
    upload.value!.submit()
    store.refresh()
  } else {
    // update
    updateVideo(form).then((res) => {
      store.refresh()
    })
  }
  isModalActive.value = false
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
</script>