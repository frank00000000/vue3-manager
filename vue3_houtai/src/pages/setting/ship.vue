<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-28 18:53:24
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-29 01:12:44
 * @FilePath: \vue3_houtai\src\pages\setting\ship.vue
 * @Description: 
-->
<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="150px" class="w-[100%] h-[100%]">
      <el-form-item label="物流查询key">
        <div class="w-[40%]">
          <el-input v-model="form.ship" placeholder="物流查询key"> </el-input>

          <small class="text-gray-500 flex mt-1">
            用于查询物流信息，接口申请
          </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getSysCongfig,setSysCongfig,uploadUrl} from '@/api/sysconfig.js'
import {toast} from "@/utils/message.js"
import {getToken} from "@/utils/token.js"


const form = ref({
    ship:''
})
const loading = ref(false)


// 获取系统设置数据
const getData = ()=>{
    loading.value = true
    getSysCongfig().then(res=>{
        // 获取form
        for (const k in form.value) {
            form.value[k] = res[k]
        }
        console.log(form.value);
    }).finally(()=>{
        loading.value = false
    })
}
getData()

// 提交
function submit() {
    loading.value = true
    // 获取表单数据
    setSysCongfig(
       form.value
    ).then(
    res=>{
        console.log(res);
        toast('修改成功')
    }).finally(()=>{
        loading.value = false
    })
}
</script>

<style scoped></style>
