<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-17 21:30:23
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-18 17:31:58
 * @FilePath: \vue3_houtai\src\pages\goods\content.vue
 * @Description: 
-->
<template>
    <form-drawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item label="商品详情" size="normal">

                <Editor v-model="form.content"></Editor>

            </el-form-item>
        </el-form>

    </form-drawer>
</template>

<script setup>
import { ref,reactive} from 'vue';
import ChooseImage from '@/components/ChooseImage.vue'
import {readGoods,setGoodsBanner,updateGoods} from "@/api/goods.js"
import { toast } from "@/utils/message.js"
import FormDrawer from '@/components/FormDrawer.vue'
import Editor from '@/components/Editor.vue';

// 抽屉
const formDrawerRef = ref(null)


const form = ref({
    content:''
})
// goodsId 需要修改的图片id
const goodsId = ref(0)

// 父组件 getdata 事件
const emit = defineEmits(["reloadData"])
// 提交
const submit = ()=>{
    formDrawerRef.value.showLoading()
    updateGoods(goodsId.value,form.value)
    .then(res=>{
        toast("设置商品详情成功")
        formDrawerRef.value.close()
        emit('reloadData')
    })
    .finally(()=>{
        formDrawerRef.value.hideLoading()
    })
}

// 打开商品详情抽屉
const open = (row)=>{
    goodsId.value = row.id
    row.contentLoading = true
    readGoods(goodsId.value).then((res) => {
    //获取商品详情富文本
    form.value.content = res.content
    formDrawerRef.value.open()
    })
    .finally(()=>{
        row.contentLoading = false
    })
}

defineExpose({
    open
})
</script>

<style scoped>

</style>