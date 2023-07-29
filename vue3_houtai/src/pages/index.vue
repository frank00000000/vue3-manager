<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 14:02:31
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-17 14:13:22
 * @FilePath: \vue3_houtai\finally_project\src\pages\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=" w-[100%]">
    <el-row :gutter="20">
      <template v-if="panels.length == 0">
        <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class=" border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <span class="text-3xl font-bold text-gray-500">
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </span>
                <el-divider></el-divider>
                <div class="flex justify-between">
                  <el-skeleton-item variant="text" style="width: 25%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="index"
      >
        <el-card shadow="hover" class=" border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">
                {{item.unit}}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <CountTo :value="item.value"> </CountTo>
          </span>
          <el-divider></el-divider>
          <div class="flex justify-between">
            <span>{{ item.subTitle}}</span>
            <span>{{item.subValue}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <indexNavs></indexNavs>

    <el-row :gutter="20" class=" mt-4">
      <el-col :span="12" :offset="0">
        <indexChart v-permission="['getStatistics1,GET']" />
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <indexCard
          title="店铺及商品提示"
          tip="店铺及商品提示"
          :data="panel2.goods"
        ></indexCard>
        <indexCard
          class="mt-2"
          title="交易提示"
          tip="需要立即处理的交易订单"
          :data="panel2.order"
        ></indexCard>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {getStatistics1,getStatistics2} from '@/api'
import CountTo from '@/components/CountTo.vue'
import indexNavs from '@/components/indexNavs.vue'
import indexChart from "@/components/indexChart.vue"
import indexCard from "@/components/indexCard.vue"

// index面板
const panels = ref([])
 getStatistics1().then((result) => {
  panels.value = result.panels
}).catch((err) => {
  return ''
});

// 子面板
const panel2 = ref({})
getStatistics2().then((res)=>{
  panel2.value = res
})
</script>

<style scoped></style>
