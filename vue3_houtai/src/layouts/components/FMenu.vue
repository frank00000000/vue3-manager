<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-06 15:40:39
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-14 14:42:03
 * @FilePath: \vue3_houtai\finally_project\src\layouts\components\FMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="f-menu" :style="{width:$store.state.asideWidth}">
    <el-menu
      class="el-menu-vertical-demo border-0"
      @select="handleSelect"
      :collapse="storeKey"
      :collapse-transition="false"
      :default-active="defaultActive"
      unique-opened
    >
      <template v-for="(item,index) in asideMenus" :key="index">
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{item.name}}</span>
          </template>

          <el-menu-item
            v-for="( List2, index2) in item.child"
            :key="index2"
            :index="List2.frontpath"
          >
            <el-icon>
              <component :is="List2.icon"></component>
            </el-icon>
            <span>{{List2.name}}</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref,reactive,computed } from 'vue';
import {useRouter,useRoute} from 'vue-router'
import {useStore} from 'vuex'

const router = useRouter()
const store = useStore()
const route = useRoute()
const path = route.path

//默认选中
const defaultActive = ref(path)

/**
 * @description: 获取菜单
 * @param {*} computed
 * @return {*}
 */
 const asideMenus = computed(()=>store.state.menus)


/**
 * @description: 跳转页面
 * @param {*} index
 * @return {*}
 */
const handleSelect = (index)=>{
    router.push(index)
}

/**
 * @description: 是否折叠菜单
 * @param {*} computed(():!(store.state.asideWidth == "250px"))
 * @return { Boolean } Boolean
 */
const storeKey =  computed(()=> !(store.state.asideWidth == "250px"))
</script>

<style scoped>
.f-menu{
    transition: all 0.5s;
    top:64px;
    left: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    @apply shadow-md fixed bg-light-50;
}

/* 隐藏滚动条 */
.f-menu::-webkit-scrollbar{
  width: 0px;
}
</style>
