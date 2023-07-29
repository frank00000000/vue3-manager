<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-22 18:40:44
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-23 16:53:53
 * @FilePath: \vue3_houtai\src\components\ChooseSku.vue
 * @Description: 
-->
<template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">

        <el-container style="height:65vh">
            <!-- 左:标签 -->
            <el-aside width="220px" class="image-aside" v-loading="loading">
                <div class="top">
                    <div class="sku-list" :class="{'active':(activeId == i.id)}" v-for="(i,index) in tableData" :key="index"
                        @click="handleChangeActiveId(i.id)">
                        {{ i.name }}
                    </div>

                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" :total="total" :current-page="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <!-- 右:属性 -->
            <el-main class="flex ">
                <!-- 属性数据 -->
                <div v-for="(i, index) in list" :key="index" class=" m-2 ">
                    <!-- 属性多选 -->
                    <el-checkbox v-model="form.list" :label="i" border />
                </div>
            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref,reactive } from 'vue';
import { getSkusList} from "@/api/skus"
import {useInitTable} from "@/composables/useCommon.js"


// 添加样式
const activeId = ref(0)
const list = ref([])
const form = ref({
    name:"",
    list:[]
})
// dialog显示隐藏按钮
const dialogVisible = ref(false)
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
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleMultiStatusChange,
} = useInitTable({
    onGetList:getSkusList,
    onGetListSuccess:(res)=>{
        tableData.value = res.list
        total.value = res.totalCount

        // 第一个选择框添加active样式
        if(tableData.value.length){
            activeId.value = tableData.value[0].id
            // 获取选择框对应的属性
            handleChangeActiveId(activeId.value)
        }
    }
})

// 获取选择框对应的属性
const handleChangeActiveId = (id)=>{
    activeId.value = id
    list.value = []
     let item = (tableData.value.find(i =>i.id == id))
    if(item){
        list.value = item.default.split(',')
        //获取当前对象name
        form.value.name = item.name
    }
}

const callbackFunction = ref(null)
// 打开dialog
const open = (cb = null) =>{
    // 本地存储callback方法
    callbackFunction.value = cb
    getData(1)
    dialogVisible.value  = true
}

// 提交事件 调用cb
const submit = ()=>{
    if(typeof callbackFunction.value === "function"){
        callbackFunction.value(form)
    }
    

    dialogVisible.value  = false

}

defineExpose({
    open
})
</script>

<style scoped>

.image-aside{
  border-right: 1px solid #eeeeee;
  position: relative;
}


.image-aside .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom{
  position: absolute;
  height: 50px;
  right: 0;
  left: 0;
  bottom: 0;

  @apply flex justify-center items-center
}


.sku-list{
    border-bottom: 1px solid #f4f4f4;
    @apply flex p-3 items-center font-bold text-sm cursor-pointer
}

.sku-list:hover ,.active{
    @apply bg-blue-50
}
</style>