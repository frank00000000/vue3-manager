<template>
    <el-dialog title="商品选择" v-model="dialogVisible" width="70%">
        <!-- 表单 -->
        <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
            style="width: 100%;" height="400px" v-loading="loading" destroy-on-close>
            <!-- check：多选框 -->
            <el-table-column type="selection" width="55" />
            <!-- 表格:row1 -->
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <!-- 左:图片 -->
                        <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
                            style="width: 50px; height: 50px;">
                        </el-image>

                        <!-- 右:文案 -->
                        <div class="flex-1">
                            <!-- 标题 -->
                            <p>{{ row.title}}</p>
                            <!-- 分类 -->
                            <div class="text-gray-400 text-xs mb-1">分类:{{ row.category? row.category.name : "未分类" }}</div>
                            <div class="text-gray-400 text-xs ">创建时间:{{ row.create_time}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!-- 表格:row2 -->
            <el-table-column label="总库存" prop="stock" width="90" align="center">
            </el-table-column>
            <!-- 表格:row3 -->

            <el-table-column label="价格(元)" width="250" align="center">
                <template #default="{row}">
                    <span class="text-rose-500">￥{{row.min_price}}</span>
                    <el-divider direction="vertical" content-position="left"></el-divider>
                    <span class="text-gray-500">￥{{row.min_oprice}}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
            :current-page="currentPage" :page-size="limit" @current-change="getData" />

        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {useInitTable} from '@/composables/useCommon.js';
import {getGoodsList} from "@/api/goods.js"

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
  multiSelectionIds,
  handleSelectionChange
}  = useInitTable({
      searchForm:{
        title:"",
        tab:"all",
        category_id:null,
      },
      onGetListSuccess(res){
          // 获取商品列表
          tableData.value = res.list
          // 总数
          total.value = res.totalCount
      },
      onGetList: getGoodsList,
    })

// dialog显示隐藏
const dialogVisible = ref(false)


// 获取传入的回调
const callbackFunction = ref(null)
const open = (cb = null)=>{
    callbackFunction.value = cb
    dialogVisible.value = true
}

const close = ()=>{
    dialogVisible.value = false
}

// 提交
const submit = (e)=>{
    if(typeof callbackFunction.value == 'function')
    {
        // 回传选中id
        callbackFunction.value(multiSelectionIds.value)
    }
    close()
}



defineExpose({
    open
})


</script>

<style scoped>

</style>