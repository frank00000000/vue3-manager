<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-06 15:13:55
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-14 16:41:25
 * @FilePath: \vue3_houtai\finally_project\src\layouts\admin.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container>
    <el-header>
      <FHeader></FHeader>
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <FMenu class=".el-aside"></FMenu>
      </el-aside>
      <el-main>
        <div class="main">
          <FTagList></FTagList>
          <router-view v-slot="{Component}">
            <transition name="fade">
              <keep-alive :max="3">
                <component :is="Component"> </component>
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref,reactive } from 'vue';
import FHeader from "./components/FHeader.vue"
import FMenu from "./components/FMenu.vue"
import FTagList from "./components/FTagList.vue"
</script>

<style>

.el-aside{
  transition: all 0.5s;
}

.main{
  margin-top: 44px;
  @apply bg-gray-100
}

.fade-enter-from{
  opacity: 0;
}

.fade-enter-to{
  opacity: 1;
}

.fade-leave-from{
  opacity: 1;
}

.fade-leave-to{
  opacity: 0;
}
.fade-enter-active{
  transition: all 0.3s;
  transition-delay: 0.3s;
}
.fade-leave-active{
  transition: all 0.3s;
}
</style>
