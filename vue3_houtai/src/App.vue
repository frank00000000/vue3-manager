<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 13:05:59
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-17 14:19:18
 * @FilePath: \vue3_houtai\finally_project\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup></script>

<template>
  <router-view></router-view>
</template>
<script></script>

<style>
body{
  @apply bg-gray-100
}
#nprogress .bar{
  background-color: #f4f4f4!important;
  height: 4px!important;
}

/* 滚动条设置
::-webkit-scrollbar 滚动条整体部分
::-webkit-scrollbar-thumb 滚动条里面的小方块，能向上向下移动（或向左向右移动）
::-webkit-scrollbar-track 滚动条的轨道（里面装有Thumb）
::-webkit-scrollbar-button 滚动条的轨道的两端按钮，由于通过点击微调小方块的位置。
::-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分
::-webkit-scrollbar-corner 边角，即垂直滚动条和水平滚动条相交的地方
::-webkit-resizer 两个滚动条的交汇处上用于拖动调整元素大小的小控件
*/
::-webkit-scrollbar{
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgb(0, 0, 0,0.2);
}

::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgb(0, 0, 0,0.1);
}
</style>
