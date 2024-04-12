<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    template !
  </n-config-provider>
</template>
