<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-28 01:19:37
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-28 15:10:22
 * @FilePath: \vue3_houtai\src\pages\order\ShipInfoModal.vue
 * @Description: 
-->
<template>
    <el-drawer title="物流信息" v-model="dialogVisible" direction="rtl" size="40%">
        <el-card shadow="never" class="border-0 mb-3">
            <div class="flex items-center">
                <el-image :src="info.logo" fit="fill" style="width:60px" :lazy="true"></el-image>
                <div class="ml-2 text-xs ">
                    <p>物流公司：{{ info.typename}}</p>
                    <p>物流单号：{{ info.number}}</p>
                </div>
            </div>
        </el-card>
        <el-card shadow="never" class="border-0 border-t">
            <el-timeline class="ml-[-45px]">
                <el-timeline-item v-for="(i, index) in info.list" :key="index" :timestamp="i.time">
                    {{ i.status }}
                </el-timeline-item>
            </el-timeline>
        </el-card>


    </el-drawer>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getShipInfo} from "@/api/order.js"
import { toast} from "@/utils/message.js"

// 抽屉状态
const dialogVisible = ref(false)
const info = ref({})
const open = (id)=>{
    // 获取物流订单信息
 return getShipInfo(id).then(res=>{
        if(res.status != 0){
            return toast(res.msg,'error')
        }

        // 
        info.value = res.result

        console.log(info.value);

        dialogVisible.value = true
    })
}


defineExpose({
    open
})

</script>

<style scoped>

</style>