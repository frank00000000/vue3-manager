<template>
  <div>
    <el-drawer
      :title="drawerTitle"
      v-model="dialogVisible"
      direction="rtl"
      size="70%"
    >
      <el-form :model="searchForm" label-width="80px">
        <el-form-item label="时间选择">
          <!-- 选择框 -->
          <el-radio-group v-model="searchForm.type">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.starttime"
            type="datetime"
            placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width:40%"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="searchForm.endtime"
            type="datetime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width:40%"
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio-group v-model="searchForm.level">
            <el-radio-button :label="0">一级推广</el-radio-button>
            <el-radio-button :label="1">二级推广</el-radio-button>
            <el-radio-button :label="2">三级推广</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表单 -->
      <el-table
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <!-- user:Drawer -->
        <template v-if="type == 'user'">
          <!-- 表格:row1 -->
          <el-table-column label="ID" prop="id" align="center">
          </el-table-column>

          <el-table-column label="头像" width="65">
            <template #default="{row}">
              <el-avatar :size="40" :src="row.avatar"></el-avatar>
            </template>
          </el-table-column>

          <!-- 表格:row2 -->
          <el-table-column label="用户信息" prop="username" align="center">
          </el-table-column>
          <!-- 表格:row3 -->
          <el-table-column label="推广数" prop="share_num" align="center" />
          <!-- 表格:row3 -->
          <el-table-column
            label="推广订单数"
            prop="share_order_num"
            align="center"
          />
          <!-- 表格:row3 -->
          <el-table-column label="绑定时间" prop="create_time" align="center" />
        </template>

        <!-- order:Drawer -->
        <template v-else>
          <!-- 表格:row1 -->
          <el-table-column label="订单号">
            <template #default="{ row }">
              {{ row.order.no }}
            </template>
          </el-table-column>
          <!-- 表格:row2 -->
          <el-table-column label="用户名|昵称|手机" prop="username">
            <template #default="{row}">
              <div v-if="!row.order.user">该用户已被删除</div>
              <div v-else>
                {{row.order.user.username}}| {{ row.order.user.nickname}}|
                {{row.order.user.phone}}
              </div>
            </template>
          </el-table-column>
          <!-- 表格:row3 -->
          <el-table-column label="时间" prop="create_time" align="center" />
          <!-- 表格:row4 -->
          <el-table-column label="反佣金额" prop="commission" align="center" />
        </template>
      </el-table>

      <!-- 底部:分页器 -->
      <el-pagination
        class="flex items-center justify-center mt-5"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref,reactive, computed } from 'vue';

import {getAgentStatisticsList,getAgentList,getAgentOrderList} from "@/api/distribution.js"
import {useInitTable} from "@/composables/useCommon.js"

    const props = defineProps({
        type:{
            type:String,
            default:'user'
        }
    })

    const drawerTitle = computed(()=>{
        return props.type == 'user' ? '推广人列表':'推广订单列表'
    })


  //表单功能，获取动态参数
   const {
    searchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleSelectionChange,
    multipleTableRef,
  }  = useInitTable({
        searchForm:{
          type:'all',
          starttime:null,
          endtime:null,
          level:0,
          user_id:null
        },
        // 传入异步请求
        onGetList: (()=>{
            return props.type == 'user'? getAgentList : getAgentOrderList
        })(),
        onGetListSuccess(res){
            // 获取商品列表
            tableData.value = res.list
            // 总数
            total.value = res.totalCount

            console.log(res);

        },

    })


    // 重置功能
    const resetSearchForm = ()=>{
        searchForm.value.type = "all"
        searchForm.value.starttime=null,
        searchForm.value.endtime=null,
        searchForm.value.level=0,
        getData()
    }

        //提交
        const onSubmit = ()=>{
            console.log('ser',searchForm.value);
            getData()
        }

        const dialogVisible = ref(false)
        const open = (id) =>{
            dialogVisible.value = true
            searchForm.value.user_id = id
            console.log( searchForm.value);

            getData()
        }
        const close = () =>{
            dialogVisible.value = false
        }

        defineExpose({
            open
        })
</script>

<style scoped></style>
