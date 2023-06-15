<template>
  <el-card shadow="hover" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            :checked="current==item.value"
            style="margin-right: 8px"
            v-for="(item, index) in options"
            :key="index"
            @click="changeTag(item.value)"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <!-- card body -->
    <div id="chart" class=" w-[100%] h-[300px]" ref="el"></div>
  </el-card>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref,reactive,onMounted,onBeforeUnmount } from 'vue';
import {getStatistics3} from "@/api"
import { useResizeObserver } from '@vueuse/core'

const current  = ref('week')

const options=[{
    text:"近1个月",
    value:'month'
},{
    text:"近1周",
    value:'week'
},{
    text:"近24小时",
    value:'hour'
}]

/**
 * @description: 切换订单统计的 tag
 * @param {*} tag
 * @return {*}
 */
function changeTag(tag){
    current.value = tag
    getData()
}



let myChart = null
onMounted(()=>{
const chart = document.getElementById("chart")
// 创建charts
myChart = echarts.init(chart)
getData()
})

onBeforeUnmount(()=>{
    // 页面销毁之前，清除一下echarts
    if(myChart){
        echarts.dispose()
    }

})


function getData(){
const option = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar'
    }
  ]
};
  // 进入动画
myChart.showLoading();
getStatistics3(current.value).then((res) => {
    option.xAxis.data = res.x
    option.series[0].data = res.y

    myChart.setOption(option);

}).finally(()=>{
     // 退出动画
     myChart.hideLoading();
});
}

let el = ref(null)
// 获取dom的缩放功能
useResizeObserver(el, (entries) => {

    // charts跟随屏幕变化
    myChart.resize()

})
</script>

<style scoped></style>
