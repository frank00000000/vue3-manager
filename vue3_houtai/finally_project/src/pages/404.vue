<style scoped></style>
<template>
  <el-result
    icon="warning"
    title="404跳转页面不存在"
    sub-title="
请按照说明操作"
  >
    <template #extra>
      <el-button type="primary" @click="$router.push('/')">返回</el-button>
    </template>
  </el-result>
</template>

<script setup>
import { ref,reactive } from 'vue';
</script>
