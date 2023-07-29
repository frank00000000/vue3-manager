<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 17:36:59
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-26 21:03:28
 * @FilePath: \vue3_houtai\src\pages\comment\list.vue
 * @Description: 
-->
<template>
    <el-card shadow="never" class="border-0">
        <template #header>
            <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
                <!-- 左：盒子 -->
                <SearchItem label="关键词">
                    <!-- 搜索框 -->
                    <el-input v-model="searchForm.title" placeholder="要搜索的商品" clearable>
                    </el-input>
                </SearchItem>
            </Search>
        </template>
        <!-- 表单 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" default-expand-all>
            <!-- 折叠筐 -->
            <el-table-column type="expand">
                <template #default="{row}">
                    <div class="flex p-2 pl-16">
                        <!-- 左：头像 -->
                        <el-avatar class="mr-3" icon="el-icon-user-solid" shape="circle" :size="50" :src="row.user.avatar"
                            fit="fill"></el-avatar>
                        <!-- 中：评论栏 -->
                        <div class="flex-1 ">
                            <h6 class="flex items-center">
                                {{ row.user?.nickname||row.user?.username }}
                                <small class=" text-gray-400 ml-2">{{ row.review_time}}</small>
                                <el-button type="primary" size="default"
                                    v-if="!row.textareaEdit && !row.extra">回复</el-button>
                            </h6>
                            <div class="py-2">
                                <el-image v-for="(src, index) in row.review.image" :key="index" :src="src" fit="fill"
                                    style="width:150px; height: 150px;" class="rounded" :lazy="true"></el-image>
                            </div>
                            <div class="mt-3" v-if="row.textareaEdit">
                                <el-input v-model="textarea" type="textarea" :rows="4" placeholder="请输入评价内容" clearable
                                    @change=""></el-input>
                                <div class="py-2">
                                    <el-button type="primary" size="default" @click.stop="review(row)">回复</el-button>
                                    <el-button size="default" @click.stop="row.textareaEdit = false">取消</el-button>
                                </div>
                            </div>
                            <template v-else>
                                <div class="bg-gray-100 mt-3 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small" class="ml-auto"
                                            @click.stop="openTextarea(row,item.data)">修改</el-button>
                                    </h6>
                                    <p>{{ item.data}}</p>
                                </div>
                            </template>

                        </div>
                    </div>
                </template>
            </el-table-column>

            <!-- ID -->
            <el-table-column label="ID" width="180">
                <template #default="{row}">
                    {{ row.id }}
                </template>
            </el-table-column>


            <!-- 表格:row1 -->
            <el-table-column label="商品" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <!--左：头像-->
                        <el-avatar :size="40"
                            :src="row.goods_item ? row.goods_item.cover : 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
                            style="width:50px; height:50px" class="rounded">
                            <img fil="fill" />
                        </el-avatar>
                        <!--右：昵称和ID-->
                        <div class="ml-3">
                            <h6>{{ row?.goods_item?.title ?? '商品已被删除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!-- 表格:row2 -->
            <el-table-column label="评价信息" width="200">
                <template #default="{row}">
                    <div>
                        <p>用户:{{ row.user?.nickname || row.user?.username }}</p>
                    </div>
                    <div>
                        <p>
                            <el-rate v-model="row.rating" clearable />
                        </p>
                    </div>
                </template>
            </el-table-column>
            <!-- 表格:row3 -->
            /**
            * @description:
            * @return {*}
            */
            <el-table-column label="评价时间" prop="review_time" align="center" width="200">
            </el-table-column>
            <!-- 表格:row4 -->
            <el-table-column label="状态" align="center">
                <template #default="{row}">
                    <!-- 状态:切换 -->
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :v-loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)"></el-switch>
                </template>
            </el-table-column>

        </el-table>

        <!-- 底部:分页器 -->
        <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
            :current-page="currentPage" :page-size="limit" @current-change="getData" />

    </el-card>
</template>

<script setup>
  import { ref} from 'vue';
  import { getGoodsCommentsList,updateGoodsCommentsStatus,reviewGoodsComment} from "@/api/goods_comment.js"
  import {useInitTable} from "@/composables/useCommon.js"
  import {toast} from "@/utils/message.js"
  import  Search from "@/components/Search.vue"
import SearchItem from "@/components/SearchItem.vue"

// 服务器返回 角色权限
const roles = ref([])

// 用户等级
const user_level = ref([])

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
    handleDelete,
    handleStatusChange
} = useInitTable({
    searchForm:{
         title:''
        },
        onGetListSuccess(res){
            // 获取user列表
            tableData.value = res.list.map((item) => {
            item.statusLoading = false
            // 控制回复按钮
            item.textareaEdit = false
            return item
            })
        total.value = res.totalCount
        user_level.value = res.user_level
        console.log(res);
        },
        // 传入异步请求
        onGetList: getGoodsCommentsList,
        updateStatus:updateGoodsCommentsStatus
    })


    const textarea = ref('')

    // 修改按钮:打开输入框
    const openTextarea = (row,data='')=>{
        textarea.value= data
        row.textareaEdit = true
    }

    // 回复
    const review = (row)=>{
        console.log(row);
        if(textarea.value == ""){
            return toast('输入不能为空',"error")
        }
        reviewGoodsComment(row.id,textarea.value).then(res=>{
            row.textareEdit = false
            toast("回复成功")
            getData()
        })
    }
  
</script>

<style scoped></style>
