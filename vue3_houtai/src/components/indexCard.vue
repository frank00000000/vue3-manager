<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 22:49:39
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-15 23:26:19
 * @FilePath: \vue3_houtai\finally_project\src\components\indexCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 首页:卡片 -->
  <el-card shadow="hover" :body-style="{ padding: '20px' }" class="h-[200px] border-0 bg-light-400">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-sm"> {{ title}} </span>
        <span>
          <el-check-tag checked style="margin-right: 8px; 
           background-color: #e6a23c; color: white;">
            {{tip}}
          </el-check-tag>
        </span>
      </div>
    </template>
    <!-- card body -->
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item,index) in data" :key="index">
        <el-card shadow="hover">
          <div class="flex flex-col items-center justify-center">
            <span class=" text-sm mb-2">{{item.label}}</span>
            <span class="text-xs text-gray-500">{{ item.value }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref,reactive } from 'vue';
defineProps({
    title:String,
    tip:String,
    data:Array
})
</script>

<style scoped></style>
