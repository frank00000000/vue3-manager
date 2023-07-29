<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-07 14:31:53
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-17 16:53:59
 * @FilePath: \vue3_houtai\src\components\FormDrawer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose"
    class="px-3"
  >
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" @click="submit" :loading="loading">
          {{ confirmText }}
        </el-button>
        <el-button :loading="loading" @click="close"> 取消 </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<!-- 封装抽屉组件  -->
<script setup>
import { ref,reactive } from 'vue';
    const showDrawer = ref(false)
    /**
     * @description: 关闭抽屉
     * @return {*}
     */
    const open =()=> showDrawer.value = true
    /**
     * @description: 打开抽屉
     * @return {*}
     */
    const close =()=> showDrawer.value = false

    /**
     * @description: 提交按钮
     * @return {*}
     */
    const submit = ()=> emit('submit')
    // 获取子组件submit方法
    const emit = defineEmits(["submit"])
    const prop =  defineProps({
        title:String ,
        size:{
            type:String,
            default:'45%',
        },
        destroyOnClose:{
            type:Boolean,
            default:false
        },
        confirmText:{
            type:String,
            default:"提交"
        }
    })

    /**
     * @description: btn 按钮 loading 状态
     * @return {*}
     */
    const loading = ref(false)
    const showLoading = ()=>{
        loading.value = true
    }
    const hideLoading = ()=>{
        loading.value = false
    }



    defineExpose({
        open,
        close,
        showLoading,
        hideLoading
    })
</script>

<style scoped>
.formDrawer{
   width: 100%;
   height: 100%;
   position: relative;
   @apply flex flex-col
}

.actions{
    height: 50px;
    @apply mt-auto flex items-center
}
</style>
