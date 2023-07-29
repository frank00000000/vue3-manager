<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-25 01:06:19
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-25 18:11:11
 * @FilePath: \vue3_houtai\src\pages\category\components\GoodsDrawer.vue
 * @Description: 
-->
<template>
    <el-drawer v-model="visibilityGoods" title='推荐产品' direction="rtl" size="40%" v-loading="loading">
        <div class="formdrawer">
            <el-table :data="tableData" border class="mb-2">
                <el-table-column prop="id" label="id" />
                <el-table-column prop="cover" label="商品封面" align="center">
                    <template #default="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.cover" fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center" />

                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-popconfirm title="是否删除该产品?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm.stop="handleDelete(scope.row)">
                            <template #reference>
                                <el-button type="primary" text v-loading="scope.row.deleteGoodsLoading" size="default"
                                    @click="()=>{}">删除关联产品</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <div class="foot">
                <el-button type="primary" size="default" @click="handleConnect">关联</el-button>
                <el-button size="default" @click="visibilityGoods = false">取消</el-button>
            </div>
        </div>
    </el-drawer>

    <ChooseGoods ref="chooseGoodsRef" confirmText="关联">

    </ChooseGoods>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getCategoryGoods,deleteCategoryGoods,connectCategoryGoods} from "@/api/category.js"
import { toast } from "@/utils/message.js"
import ChooseGoods from "@/components/ChooseGoods.vue"


   const loading = ref(false)
    // 控制抽屉显示
    const visibilityGoods = ref(false)
    // 获取getData数据id
    const category_id = ref(0)
    // 存储表格数据
    const tableData = ref([])
    // 打开抽屉弹框
    const open= (item)=>{
        item.GoodDrawerLoading = true
        // 将id保存
        category_id.value = item.id
        getData(item).then(res=>{
            visibilityGoods.value = true
        }).finally(()=>{
            item.GoodDrawerLoading = false
        })
    }

    // 获取后台数据
    function getData() {  
       return getCategoryGoods(category_id.value).then(res=>{
        return  tableData.value = res.map(i=>{
            i.deleteGoodsLoading = false
            return i
        })
       }
     )
    }

    // 删除关联产品
    function handleDelete(item) { 
        item.deleteGoodsLoading = true
        deleteCategoryGoods(item.id).then(res=>{
            toast('删除成功')
            getData()
        }).finally(()=>{
            item.deleteGoodsLoading = false
        })

     }

    // 获取dialog组件
    const chooseGoodsRef = ref(null)

    // 关联按钮
    function handleConnect(){
        chooseGoodsRef.value.open((goods_ids)=>{
             loading.value = true
            connectCategoryGoods({
                category_id:category_id.value,
                goods_ids
            }).then(res=>{
                toast('关联成功')
                getData()
            }).finally(()=>{
             loading.value = false

            })
        })
    }

    defineExpose({
        open
    })

</script>

<style scoped>
        .formdrawer{
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        


    .foot{
     height: 40px;
     align-items: center;
     display: flex;
     
     margin-top: auto;

    }
</style>