<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-28 18:53:24
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-29 00:55:18
 * @FilePath: \vue3_houtai\src\pages\setting\buy.vue
 * @Description: 
-->
<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="150px" class="w-[100%] h-[100%]">
      <el-tabs v-model="activeName">
        <!-- tab1:支付设置 -->
        <el-tab-pane label="支付设置" name="pay">
          <el-table border stripe :data="tableData">
            <el-table-column label="支付方式">
              <template #default="{row}">
                <div class="flex items-center">
                  <el-image
                    :src="row.src"
                    fit="fill"
                    style="width:40px; height: 40px;"
                    class="rounded mr-2"
                    :lazy="true"
                  ></el-image>

                  <div>
                    <h6 class="font-bold mb-1">{{row.name}}</h6>
                    <small class="flex text-gray-400">{{row.desc}}</small>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
              <template #default="{row}">
                <el-button type="primary" @click="payDrawerOpen(row.key)" text
                  >配置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- tab2：购物设置 -->
        <el-tab-pane label="购物设置" name="shopping">
          <el-form-item label="未支付订单">
            <div class="w-[40%]">
              <el-input
                v-model="form.close_order_minute"
                placeholder="close_order_minute"
              >
                <template #append> 分钟后自动关闭 </template>
              </el-input>

              <small class="text-gray-500 mt-1">
                订单完成后,用户在n天内可以发起售后申请,设置0后不自动关闭
              </small>
            </div>
          </el-form-item>

          <el-form-item label="已发货订单">
            <div class="w-[40%]">
              <el-input
                v-model="form.auto_received_day"
                placeholder="auto_received_day"
              >
                <template #append> 天后自动确认收货 </template>
              </el-input>

              <small class="text-gray-500 flex mt-1">
                订单完成后,用户在n天内可以发起售后申请,设置0后不自动收获
              </small>
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div class="w-[40%]">
              <el-input
                v-model="form.after_sale_day"
                placeholder="after_sale_day"
                type="number"
              >
                <template #append> 天内允许申请售后</template>
              </el-input>

              <small class="text-gray-500 flex mt-1">
                订单完成后,用户在n天内可以发起售后申请,设置0后不允许申请售后
              </small>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 配置抽屉 -->
    <el-drawer title="配置" v-model="payDrawerVisible" size="40%">
      <div class="flex flex-col w-[100%] h-[100%]">
        <!-- 阿里支付配置 -->
        <el-form :model="form" label-width="80px" v-if="drawerType =='alipay'">
          <el-form-item label="app_id">
            <el-input
              v-model="form.alipay.app_id"
              placeholder="app_id"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="公钥">
            <el-input
              v-model="form.alipay.ali_public_key"
              placeholder="ali_public_key"
              style="width:90%"
              type="textarea"
              rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="私钥">
            <el-input
              v-model="form.alipay.private_key"
              placeholder="private_key"
              style="width:90%"
              type="textarea"
              rows="4"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- wx支付配置 -->
        <el-form :model="form" label-width="100px" v-else>
          <el-form-item label="公众号 APPID">
            <el-input
              v-model="form.wxpay.app_id"
              placeholder="公众号 APPID"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="小程序 APPID">
            <el-input
              v-model="form.wxpay.miniapp_id"
              placeholder="小程序 APPID"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="小程序 Secret">
            <el-input
              v-model="form.wxpay.secret"
              placeholder="小程序 Secret"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="appid">
            <el-input
              v-model="form.wxpay.appid"
              placeholder="appid"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input
              v-model="form.wxpay.mch_id"
              placeholder="商户号"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="API 密钥">
            <el-input
              v-model="form.wxpay.key"
              placeholder="API 密钥"
              style="width:90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="cert_client">
            <el-upload
              :action="uploadUrl"
              :limit="1"
              :headers="
              {
                token
              }"
              accept=".pem"
              :on-success="upLoadClientSuccess"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <p class="text-rose-500">
                  {{ form.wxpay?.cert_client ?? '还未配置' }}
                </p>
                <div class="el-upload__tip">例如：apiclient_cert.pem</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="cert_key">
            <el-upload
              :action="uploadUrl"
              :limit="1"
              :headers="
              {
                token
              }"
              accept=".pem"
              :on-success="upLoadKeySuccess"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <p class="text-rose-500">{{ form.wxpay.cert_key }}</p>
                <div class="el-upload__tip">例如：apiclient_key.pem</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>

        <div class="h-[50px] flex mt-auto items-center">
          <el-button type="primary" :loading="loading" @click="submit"
            >提交</el-button
          >
          <el-button @click="payDrawerVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {getSysCongfig,setSysCongfig,uploadUrl} from '@/api/sysconfig.js'
import {toast} from "@/utils/message.js"
import {getToken} from "@/utils/token.js"


const token = getToken()
//tabs切换name
const activeName = ref('pay')
const form = ref({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "",
        "ali_public_key": "",
        "private_key": ""
    },
    "wxpay": {
        "app_id": "",
        "miniapp_id": "",
        "secret": "",
        "appid": "",
        "mch_id": "",
        "key": "",
        "cert_client": "",
        "cert_key": ""
    },
})
const loading = ref(false)
// table数据
const tableData = [{
    name:'支付宝支付',
    desc:'该系统支持及时到账接口',
    src:'/alipay.png',
    key:'alipay'
},{
    name:'微信支付',
    desc:'该系统支持微信网页支付和扫码支付',
     src:'/wepay.png',
     key:'wepay'
}]

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
    setSysCongfig({
        ...form.value,
        password_encrypt:form.value.password_encrypt?.join(',')
    }).then(
    res=>{
        console.log(res);
        toast('修改成功')
    }).finally(()=>{
        loading.value = false
    })
}




// pay 抽屉
const payDrawerVisible = ref(false)
const drawerType = ref('alipay')
// 打开抽屉
const payDrawerOpen = (key)=>{
  drawerType.value = key
  payDrawerVisible.value = true
}

// cert_client成功上传回调
const upLoadClientSuccess = (response, uploadFile, uploadFiles)=>{
    console.log(response);
    form.value.wxpay.cert_client = response.data
  }

// cert_key成功上传回调
const upLoadKeySuccess = (response, uploadFile, uploadFiles)=>{
  console.log(response);
  form.value.wxpay.cert_key = response.data
}
</script>

<style scoped></style>
