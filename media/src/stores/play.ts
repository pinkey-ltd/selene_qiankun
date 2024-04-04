import { defineStore } from 'pinia'
import type { List } from './model'
import { deleteVideo, requestList } from '@/api/video'
import { reactive, ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'

export const useStore = defineStore('playList', () => {
  const { message } = createDiscreteApi(['message'])
  const list = ref<List[]>([])
  const currentPlayUrl = ref<string>('')
  const setUrl = (url: string) => {
    currentPlayUrl.value = url
  }
  const fetchList = async () => {
    const { data } = await requestList()
    list.value = data
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

  const removeVideo = (id: number) => {
    deleteVideo(id)
      .then(() => {
        message.success('删除成功！')
        refresh()
      })
      .catch((err) => {
        message.error('删除失败：' + err)
        refresh()
      })
  }
  return { list, currentPlayUrl, fetchList, setUrl, refresh, removeVideo, currentForm }
})
