<template>
    <el-drawer title="导出订单" v-model="dialogVisible" direction="rtl" size="40%">

        <el-form :model="form" label-width="80px">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" placeholder="选择订单类型">
                    <el-option v-for="(item,index) in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker v-model="form.time" type="daterange" start-placeholder="开始日期" range-separator="至"
                    end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item size="normal">
                <el-button type="primary" @click="onSubmit" v-loading="loading">导出</el-button>
            </el-form-item>

        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {exportOrder} from "@/api/order.js"
import {toast} from "@/utils/message.js"
defineProps({
    tabs:{
        type:Array
    }
})


const dialogVisible = ref(false)

// 打开dialog
const open = ()=>{
    dialogVisible.value = true
}
const close = ()=>{
    dialogVisible.value = false
}

const form= ref({
    tab:null,
    time:'',
})

const loading = ref(false)
// 导出事件
const onSubmit = ()=>{
    if(!form.value.tab) return toast('订单类型不能为空','error')
    loading.value = true
    let starttime = null
    let endtime = null
    if(form.time && Array.isArray(form.value.time)){
        starttime = form.item[0]
        endtime = form.item[1]
    }


    // 发送导出订单请求
    exportOrder({
        tab:form.value.tab,
        starttime,
        endtime
    }).then(res=>{
        // 获取的blob 数据 创建一个 DOMString 的 url
    let url = window.URL.createObjectURL( new Blob([res]))
    let link = document.createElement('a')
    link.style = 'display:none'
    link.href = url
    let filename = (new Date()).getTime() + '.xlsx'
    // 添加属性名
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    // 触发点击事件
    link.click()

    close()
    }).finally(()=>{
        loading.value = false
    })


}



defineExpose({
    open
})


</script>

<style scoped>

</style>