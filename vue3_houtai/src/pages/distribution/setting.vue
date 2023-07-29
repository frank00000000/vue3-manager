<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
      <el-form-item label="分销启用">
        <el-radio-group v-model="form.distribution_open">
          <el-radio :label="0" border> 禁用 </el-radio>
          <el-radio :label="1" border> 开启 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分销海报图">
        <ChooseImage :limit="9" v-model="form.spread_banners"> </ChooseImage>
      </el-form-item>
      <h5 class="bg-gray-100 p-3 rounded mb-5">返佣设置</h5>
      <el-form-item label="一级返佣比例">
        <div>
          <el-input
            v-model="form.store_first_rebate"
            placeholder="一级返佣比例"
            style="width:50% ;"
            type="number"
            clearable
          >
            <template #append> % </template>
          </el-input>
          <small class="mt-1 text-gray-500 flex"
            >订单交易成功后给上级返佣的比例0 - 100，例:5 = 反订单金额的
            5%</small
          >
        </div>
      </el-form-item>
      <el-form-item label="二级返佣比例">
        <div>
          <el-input
            v-model="form.store_second_rebate"
            placeholder="二级返佣比例"
            style="width:50% ;"
            type="number"
            clearable
          >
            <template #append> % </template>
          </el-input>
          <small class="mt-1 text-gray-500 flex"
            >订单交易成功后给上级返佣的比例0 - 100，例:5 = 反订单金额的
            5%</small
          >
        </div>
      </el-form-item>
      <el-form-item label="自购返佣">
        <div>
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio :label="1" border> 是 </el-radio>
            <el-radio :label="0" border> 否 </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
      <el-form-item label="结算时间">
        <div>
          <el-input
            v-model="form.settlement_days"
            style="width:80% ;"
            type="number"
            clearable
          >
            <template #prepend> 订单完成后 </template>
            <template #append> 天 </template>
          </el-input>
          <small class="ml-2 text-gray-400 flex"
            >订单交易成功后给上级返佣的比例0 - 100，例:5 = 反订单金额的
            5%</small
          >
        </div>
      </el-form-item>

      <el-form-item label="佣金到账方式">
        <div>
          <el-radio-group v-model="form.brokerage_method">
            <el-radio label="hand" border> 手动转账 </el-radio>
            <el-radio label="wx" border> 自动到微信零钱 </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="default" @click="submit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getConfig,setConfig} from '@/api/distribution.js'
import {toast} from "@/utils/message.js"
import ChooseImage from '@/components/ChooseImage.vue'

// form
const form = ref({
    "distribution_open": 1,
    "store_first_rebate":10,
    "store_second_rebate":20,
    "spread_banners":[
        "http://...png",
        // ...
    ],
    "is_self_brokerage":1,
    "settlement_days":7,
    "brokerage_method":"hand"
    }
)

// loading状态
const loading = ref(false)
function getData() {
    loading.value = true
    getConfig().then(res=>{
        for (const k in form.value) {
            form.value[k] = res[k]
        }
        form.value.password_encrypt = form.value.password_encrypt.split(',')
        console.log(form.value);
    }).finally(()=>{
        loading.value = false
    })
 }
 getData()

//  提交
function submit() {
    loading.value = true
    // 获取表单数据
    setConfig({
        ...form.value,
    }).then(
    res=>{
        console.log(res);
        toast('修改成功')
    }).finally(()=>{
        loading.value = false
    })
}
</script>
<style scoped></style>
