<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-06 15:41:09
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-13 15:22:55
 * @FilePath: \vue3_houtai\finally_project\src\layouts\components\FTagList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE

-->

<template>
  <div class="f-tag-list" :style="{left:$store.state.asideWidth}">
    <!--     <div style="margin-bottom: 20px">
      <el-button size="small" @click="addTab(editableTabsValue)">
        add tab
      </el-button>
    </div> -->
    <el-tabs
      v-model="activeTab"
      type="card"
      class="demo-tabs"
      @tab-remove="removeTab"
      @tab-change="changeTab"
      style="min-width:100px ;"
    >
      <el-tab-pane
        :closable="item.path != '/'"
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>

    <span class="dropdown">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其它</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<script setup>
import {useTabList} from '@/composables/useTabList.js'

const {
  activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose} = useTabList()
</script>

<style scoped>
.f-tag-list{
    @apply fixed flex items-center bg-light-[#f0f0ef] px-2 ;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
}

.f-tag-list .dropdown{
    height: 32px;
    @apply bg-light-100 rounded ml-auto flex items-center justify-center  px-2;
}



:deep(.el-tabs__header){
    border: 0!important;
    @apply mb-0 flex items-center;
}

:deep(.el-tabs__nav){
    border: 0!important;
}

:deep(.el-tabs__item){
    border: 0!important;
    height: 32px;
    line-height: 32px;
    @apply bg-light-50 rounded mx-1;
}

:deep(.el-tabs__nav-prev),:deep(.el-tabs__nav-next){
    height: 32px;
    line-height: 32px;
}
:deep(.is-disabled){
    cursor: not-allowed;
    @apply text-gray-300;
}
</style>
