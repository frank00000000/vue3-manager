<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-02 15:41:14
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-25 11:59:10
 * @FilePath: \vue3_houtai\src\pages\category\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
      </div>
    </template>
    <!-- 列表树 -->
    <el-tree :data="tableData" :props="{label:'name',children:'child'}" v-loading="loading" node-key="id">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <!-- 左:展示区域 -->
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>

          <!-- 右:按钮 -->
          <div class="ml-auto">
            <el-button type="primary" v-loading="data.GoodDrawerLoading" text size="default"
              @click.stop="goodsDrawerRef.open(data)">推荐商品</el-button>

            <!-- 选择框 -->
            <el-switch v-model="data.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event,data)">
            </el-switch>
            <el-button type="primary" text="" size="default" @click.stop="handleEdit(data)">修改</el-button>
            <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
              @confirm.stop="handleDelete(data.id)">
              <template #reference>
                <el-button type="primary" text @click="()=>{}">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 右：抽屉 -->
    <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
      <slot>
        <!-- 中:Form -->
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" style="width:30%" placeholder="分类名称"></el-input>
          </el-form-item>
        </el-form>
      </slot>
    </FormDrawer>

    <GoodsDrawer ref="goodsDrawerRef">

    </GoodsDrawer>


  </el-card>
</template>

<script setup>
import { ref,reactive } from 'vue';
import ListHeader from "@/components/ListHeader.vue"
import FormDrawer from '@/components/FormDrawer.vue'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus} from "@/api/category.js"

import {useInitTable,useInitForm} from "@/composables/useCommon.js"

import GoodsDrawer from './components/GoodsDrawer.vue';
const goodsDrawerRef = ref(null)


// 列表:分页:搜索:删除:修改状态
const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleStatusChange,
} = useInitTable({
  onGetList:getCategoryList,
  onGetListSuccess(res){
      // 获取表格数据
      tableData.value = res.map(i=>{
        i.GoodDrawerLoading = false
        return i
      })
  },
  delete:deleteCategory,
  updateStatus:updateCategoryStatus
})


  // 抽屉表单功能
  const {
  formDrawerRef,
  formRef,
  form,
  rules,
  DrawerTitle,
  handleCreate,
  handleEdit,
  handleSubmit
 } = useInitForm({
  form: {
      "id": null,
			"name": "",
			"status": 0,
			"create_time": "",
			"update_time": "",
			"category_id": 0,
			"order": 0,
			"child": []
  },
   getData,
   update:updateCategory,
   create:createCategory,
   rules:{
  }
 })

</script>

<style scoped>
.custom-tree-node{
    display: flex;
    flex: 1;
    font-size: 14px;
    padding-right: 8px;
    align-items: center;
}

.el-tree-node__content{
    padding: 20px 0;
}
</style>
