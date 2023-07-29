<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-19 16:16:30
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-24 20:33:48
 * @FilePath: \manager_vue\vue3_houtai\src\components\AisdeList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 图库侧边栏 -->
  <div class="aside-list" :class="{'active':active}">
    <span class="truncate"><slot /></span>
    <el-button
      type="primary"
      text
      size="small"
      class="ml-auto px-1"
      @click.stop="$emit('edit')"
    >
      <el-icon :size="12"><Edit /></el-icon>
    </el-button>

      <el-popconfirm
      title="是否要删除该分类?"
      confirm-button-text="删除"
      cancel-button-text="取消"
      class="w-[100px]"
      @confirm.stop="$emit('delete')"
    >
      <template #reference>
        <el-button type="primary" class="px-1" text size="small" @click.stop="">
          <el-icon :size="12"><Close /></el-icon>
        </el-button>
      </template>
    </el-popconfirm>
   
  </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
defineProps({
    active:{
        type:Boolean,
        default:false
    }
})

defineEmits(["edit","delete"])
</script>

<style scoped>
.aside-list{
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center p-3 text-sm
}
.aside-list:hover,.active{
  @apply bg-blue-50
}
</style>
