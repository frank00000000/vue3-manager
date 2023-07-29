<template>
    <el-card shadow="never" class="border-0">
        <template #header>
            <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
                <!-- 左：盒子 -->
                <SearchItem label="关键词">
                    <!-- 搜索框 -->
                    <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable>
                    </el-input>
                </SearchItem>
            </Search>

            <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        </template>
        <!-- 表单 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <!-- 表格:row1 -->
            <el-table-column label="管理员">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <!--左：头像-->
                        <el-avatar :size="40" :src="row.avatar" style="background-size:cover;">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <!--右：昵称和ID-->
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!-- 表格:row2 -->
            <el-table-column prop="create_time" label="所属管理员" align="center">
                <template #default="{row}">
                    {{ row.role?.name || "-" }}
                </template>
            </el-table-column>
            <!-- 表格:row3 -->
            <el-table-column label="状态">
                <template #default="{row}">
                    <!-- 状态:切换 -->
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :v-loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)"></el-switch>
                </template>
            </el-table-column>
            <!-- 表格:row4 -->
            <el-table-column prop="order" label="操作" align="center">
                <template #default="scope">
                    <div v-if="scope.row.super == 1" class=" text-sm text-gray-500">
                        无法操作
                    </div>
                    <div v-else>
                        <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm.stop="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" text @click="()=>{}">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 底部:分页器 -->
        <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
            :current-page="currentPage" :page-size="limit" @current-change="getData" />


        <!-- 抽屉:插件 -->
        <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
            <slot>
                <!-- 表单 -->
                <el-form :model="form" ref="formRef" :rules="rules">
                    <!-- 表单1:input 用户名 -->
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名">
                        </el-input>
                    </el-form-item>
                    <!-- 表单2:input 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <!-- 表单3:ChooseImage 组件 -->
                    <el-form-item label="头像">
                        {{form.avatar}}
                        <ChooseImage v-model="form.avatar"></ChooseImage>
                    </el-form-item>
                    <!-- 表单4:下拉框 角色 -->
                    <el-form-item label="所属角色" prop="role_id">
                        <el-select v-model="form.role_id" placeholder="请选择角色">
                            <el-option v-for="(item,index) in roles" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 表单5：切换按钮 -->
                    <el-form-item label="状态" prop="status">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </slot>
        </FormDrawer>
    </el-card>
</template>

<script setup>
  import { ref} from 'vue';
  import { getManagerList,updateManagerStatus,updateManager,createManager,deleteManager} from "@/api/manager.js"
  import ChooseImage from "@/components/ChooseImage.vue"
  import FormDrawer from '@/components/FormDrawer.vue'
  import ListHeader from "@/components/ListHeader.vue"
  import {useInitTable,useInitForm} from "@/composables/useCommon.js"
  import  Search from "@/components/Search.vue"
import SearchItem from "@/components/SearchItem.vue"

// 服务器返回 角色权限
const roles = ref([])

//表单功能，获取动态参数
   const {    
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete
} = useInitTable({
        searchForm:{
            keyword: '',
            limit: '8',
        },
        onGetListSuccess(res){
            // 获取管理员列表
            tableData.value = res.list.map((item) => {
            item.statusLoading = false
            return item
            })
        total.value = res.totalCount
        roles.value = res.roles
        },
        // 传入异步请求
        onGetList: getManagerList,
        delete:deleteManager
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
    username: '',
    password: '',
    role_id: '',
    status: 1,
    avatar: '',
    },
    rules:{
        username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
        },
        ],
        password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
        },
        ],
        role_id: [
        {
            required: true,
            message: 'id不能为空',
            trigger: 'blur',
        },
        ],
        status: [
        {
            required: true,
            message: '状态不能为空',
            trigger: 'blur',
        },
        ],
  },
     getData,
     update:updateManager,
     create:createManager,
     delete:deleteManager,
     updateStatus:updateManagerStatus
   })



</script>

<style scoped></style>
