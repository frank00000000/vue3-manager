<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 17:37:40
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-02 17:35:18
 * @FilePath: \manager_vue\vue3_houtai\src\pages\notice\list.vue
 * @Description: 公告模块
-->
<template>
  <el-card shadow="never" class="border-0">
    <!-- 头部 -->
    <template #header>
      <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
    </template>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="430" />
      <el-table-column prop="order" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm.stop="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" text @click="()=>{}">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
      :current-page="currentPage" :page-size="limit" @current-change="getData" />
    <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
      <slot>
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入公告"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" :autosize="{ minRows: 4, maxRows:6  }" type="textarea"
              placeholder="请输入公告内容" />
          </el-form-item>
        </el-form>
      </slot>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { getNoticeList,createNotice,updateNotice,deleteNotice } from "@/api/notice.js"
import ListHeader from "@/components/ListHeader.vue"
import FormDrawer from '@/components/FormDrawer.vue'
import {useInitTable,useInitForm} from "@/composables/useCommon.js"

  // form 表单功能
const {    
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData}  = useInitTable({
      // 传入异步请求
      onGetList: getNoticeList,
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
    title:'',
    content:''
    },
     getData,
     update:updateNotice,
     create:createNotice,
     delete:deleteNotice,
     rules:{
     title:[
      {
        required:true,
        message:'公告标题不能为空',
        trigger:'blur'
      }
     ],
     content:[
     {
        required:true,
        message:'公告内容不能为空',
        trigger:'blur'
      }
     ]
    }
   })
</script>

<style scoped></style>
