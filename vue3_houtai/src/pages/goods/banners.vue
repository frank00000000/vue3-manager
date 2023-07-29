<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-17 21:30:23
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-19 21:32:19
 * @FilePath: \vue3_houtai\src\pages\goods\banners.vue
 * @Description: 
-->
<template>
    <el-drawer v-model="dialogVisible" size="50%" title="设置轮播图" destroy-on-close>

        <el-form :model="form" label-width="80px" :inline="false">
            <el-form-item label="轮播图">
                <ChooseImage :limit="9" v-model="form.banners">
                </ChooseImage>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>
</template>

<script setup>
import { ref,reactive} from 'vue';
import ChooseImage from '@/components/ChooseImage.vue'
import {readGoods,setGoodsBanner} from "@/api/goods.js"
import { toast } from "@/utils/message.js"

// 抽屉
const dialogVisible = ref(false)
const form = ref({
    banners:[]
})
// goodsId 需要修改的图片id
const goodsId = ref(0)

// 
const emit = defineEmits(["reloadData"])

// loading按钮状态
const loading = ref(false)
// 提交
const submit = ()=>{
    loading.value = true
    setGoodsBanner(goodsId.value,form.value)
    .then(res=>{
        toast("设置轮播图成功")
        dialogVisible.value = false
        emit('reloadData')
    })
    .finally(()=>{
        loading.value = false
    })
}

// 打开轮播图抽屉
const open = (row)=>{
    goodsId.value = row.id
    row.bannersLoading = true
    readGoods(goodsId.value).then((res) => {
    //获取轮播图
    form.value.banners = res.goodsBanner.map(i=>i.url)
     dialogVisible.value = true
    })
    .finally(()=>{
        row.bannersLoading = false
    })
}

defineExpose({
    open
})
</script>

<style scoped>

</style>