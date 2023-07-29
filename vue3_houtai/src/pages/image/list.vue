<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 17:37:23
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-25 16:13:38
 * @FilePath: \manager_vue\vue3_houtai\src\pages\image\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="rounded bg-light-50" :style="{height:h}">
    <el-container class="h-[100%]">
      <el-header class="image-header">
        <span>
          <el-button type="primary" @click="handleOpenCreate"
            >新增图片分类</el-button
          >
        </span>
        <span>
          <el-button type="warning" @click="handleOpenUpload"
            >上传图片</el-button
          >
        </span>
      </el-header>
      <el-container>
        <ImageAside ref="ImageAsideRef"></ImageAside>
        <imageMain></imageMain>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref,reactive,getCurrentInstance } from 'vue';
import ImageAside from '@/components/imageAside.vue'
import imageMain from '@/components/imageMain.vue';
// 获取vue实例
const install = getCurrentInstance()


const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40 + 'px'


  // 获取子组件实例
  const ImageAsideRef = ref(null)
  // 获取open
  const handleOpenCreate = ()=>ImageAsideRef.value.handleCreate()
  // 上传图片
  const handleOpenUpload = ()=>{
    install.proxy.$bus.emit('openUpload')

  }
</script>

<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center
}
.image-header span {
  @apply mx-1
}
</style>
