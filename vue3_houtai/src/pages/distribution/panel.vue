<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-29 01:53:40
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-29 03:22:19
 * @FilePath: \vue3_houtai\src\pages\distribution\panel.vue
 * @Description: 
-->
<template>
  <el-row :gutter="20" class="mb-5">
    <!-- col:4 -->
    <el-col :span="6" :offset="0" v-for="(i) in 4" :key="i" v-if="loading">
      <!-- 骨架屏 -->
      <el-skeleton style="width: 100%" animated loading>
        <template #template>
          <el-card shadow="hover" class="border-0">
            <template #header>
              <div class=" flex items-center ">
                <el-skeleton-item
                  variant="image"
                  style="width: 40px; height: 40px"
                />
                <div class="w-[70%] flex flex-col ml-3">
                  <el-skeleton-item
                    variant="h3"
                    style="width: 40%"
                    class="mb-1"
                  />
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </div>
              </div>
            </template>
          </el-card>
        </template>
      </el-skeleton>
    </el-col>

    <!-- col:4 -->
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never" :body-style="{ padding: '20px' }">
        <!-- card -->
        <div class="flex items-center">
          <!-- 左；图片 -->
          <el-icon
            :class="item.color"
            class="text-white w-[40px] h-[40px] rounded-full mr-3"
          >
            <User v-if="item.color == 'bg-blue-400'" />
            <ShoppingCart v-if="item.color == 'bg-orange-400'" />
            <PriceTag v-if="item.color == 'bg-green-400'" />
            <Timer v-if="item.color == 'bg-indigo-400'" />
          </el-icon>
          <!-- 右；展示 -->
          <div>
            <h2 class="text-lg font-bold">
              {{ item.value }}
            </h2>
            <small class="text-xs text-gray-400"> {{ item.label }}</small>
          </div>
        </div>
        <!-- card body -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getAgentStatisticsList} from '@/api/distribution.js'

const list = ref([])


// 加载状态
const loading = ref(false)
const getData = ()=>{
  loading.value = true
  getAgentStatisticsList().then(res=>{
        list.value = res.panels
  }).finally(()=>{
    loading.value = false
  })
}
getData()
</script>

<style scoped></style>
