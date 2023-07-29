<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-07 23:21:05
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-28 16:14:46
 * @FilePath: \vue3_houtai\src\pages\order\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
      <el-tab-pane
        v-for="(i,index) in tabbars"
        :label="i.name"
        :name="i.key"
        :key="index"
      >
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <template #header>
        <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
          <!-- 左：盒子 -->
          <SearchItem label="关键词">
            <!-- 搜索框 -->
            <el-input v-model="searchForm.no" placeholder="订单编号" clearable>
            </el-input>
          </SearchItem>
          <!-- 中：盒子 : 高级表单搜索 -->

          <template #show>
            <SearchItem label="收货人">
              <el-input
                v-model="searchForm.name"
                placeholder="收货人"
                clearable
              ></el-input>
            </SearchItem>
            <SearchItem label="手机号">
              <el-input
                v-model="searchForm.phone"
                placeholder="手机号"
                clearable
              ></el-input>
            </SearchItem>
            <SearchItem label="开始时间">
              <el-date-picker
                v-model="searchForm.starttime"
                type="datetime"
                placeholder="开始时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width:90%"
              />
            </SearchItem>
            <SearchItem label="结束时间">
              <el-date-picker
                v-model="searchForm.endtime"
                type="datetime"
                placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width:90%"
              />
            </SearchItem>
          </template>
        </Search>
        <!-- 新增 |刷新 -->
        <ListHeader
          layout="refresh,download"
          @refresh="getData"
          @download="handleExportExcel"
        >
          <el-button type="danger" @click="handleMultiDelete"
            >批量删除</el-button
          >
        </ListHeader>
      </template>
      <!-- 表单 -->
      <el-table
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <!-- check：多选框 -->
        <el-table-column type="selection" width="55" />
        <!-- 表格:row1 -->
        <el-table-column label="商品" width="350">
          <template #default="{ row }">
            <div class=" flex text-sm items-center pt-2">
              <div class="flex-1">
                <p>订单号：</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间：</p>
                <small>{{ row.create_time}}</small>
              </div>
            </div>
            <!-- 图片展示 -->
            <div
              class="flex items-center py-2"
              v-for="(item, index) in row.order_items"
              :key="index"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover :''"
                fit="fill"
                :lazy="true"
                style="width:30px; height:30px"
              >
              </el-image>
              <p class="text-blue-500 ml-2">
                {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- 表格:row2 -->
        <el-table-column label="实际付款" prop="total_price" align="center">
        </el-table-column>
        <!-- 表格:row3 -->
        <el-table-column label="买家" align="center">
          <template #default="{row}">
            <p>
              {{ row.user?.nickname || row.user?.username}}
            </p>
            <small>（用户ID：{{ row.user?.id }}） </small>
          </template>
        </el-table-column>
        <!-- 表格:row4 -->
        <el-table-column label="交易状态" align="center">
          <template #default="{row}">
            <div>
              <p>付款状态：</p>
              <el-tag
                type="success"
                size="small"
                v-if="row.payment_method=='wechat'"
                >微信支付</el-tag
              >
              <el-tag size="small" v-else-if="row.payment_method=='alipay'"
                >支付宝支付</el-tag
              >
              <el-tag type="info" size="small" v-else>未支付</el-tag>
            </div>
            <div>
              <p>发货状态：</p>
              <el-tag
                :type="row.ship_data ? 'success':'info'"
                size="small"
                >{{row.ship_data ? '已发货'
                                :'未发货'}}</el-tag
              >
            </div>
            <div>
              <p>收货状态：</p>
              <el-tag
                :type="row.ship_status ? 'success':'info'"
                size="small"
                >{{row.ship_status ? '已收货'
                                :'未收货'}}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <!-- 表格:row5 -->
        <el-table-column label="操作" align="center" width="350">
          <template #default="{row}">
            <el-button
              class="px-1"
              type="primary"
              text
              @click="openInfoModal(row)"
              >订单详情</el-button
            >
            <el-button
              class="px-1"
              v-if="searchForm.tab == 'noship'"
              type="primary"
              text
              @click="handleEdit(row)"
              >订单发货</el-button
            >
            <el-button
              class="px-1"
              v-if="searchForm.tab == 'refunding'"
              type="primary"
              text
              @click="handleRefund(row.id,1)"
              >同意退款</el-button
            >
            <el-button
              class="px-1"
              v-if="searchForm.tab == 'refunding'"
              type="primary"
              text
              @click="handleRefund(row.id,0)"
              >拒接退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部:分页器 -->
      <el-pagination
        class="flex items-center justify-center mt-5"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </el-card>

    <ExportExcel :tabs="tabbars" ref="ExcelRef"> </ExportExcel>
    <InfoModal ref="infoModalRef" :info="info"> </InfoModal>
  </div>
</template>

<script setup>
import { ref} from 'vue';
import { getOrderList,deleteOrder,refuseOrAgreeOrder } from "@/api/order.js"
import ListHeader from "@/components/ListHeader.vue"
import  Search from "@/components/Search.vue"
import SearchItem from "@/components/SearchItem.vue"

import {useInitTable} from "@/composables/useCommon.js"
import ExportExcel from './ExportExcel.vue';
import InfoModal from "./infoModal.vue"
import {  ElMessageBox } from 'element-plus'


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
  handleDelete,
  handleMultiDelete,
  handleSelectionChange,
  multipleTableRef,
  handleMultiStatusChange,
  multiSelectionIds
}  = useInitTable({
      searchForm:{
        tab:"",
        no:'',
        starttime:"",
        endtime:'',
        name:'',
        phone:""
      },
      onGetListSuccess(res){
          // 获取商品列表
          tableData.value = res.list.map((item) => {
          item.bannersLoading = false
          item.contentLoading = false
          item.skusLoading = false
          return item
          })
          // 总数
          total.value = res.totalCount
      },
      // 传入异步请求
      onGetList: getOrderList,
      delete:deleteOrder,
  })



 // tab切换
//  订单类型：all全部，nopay待支付，noship待发货，shiped待收货，received已收货，finish已完成，closed已关闭，refunding退款中
const tabbars = [
  {
        key: 'all',
        name: '全部'
    },
    {
        key: 'nopay',
        name: '待支付'
    },
    {
        key: 'noship',
        name: '待发货'
    },
    {
        key: 'shiped',
        name: '待收货'
    },
    {
        key: 'received',
        name: '已收货'
    },
    {
        key: 'finish',
        name: '已完成'
    }, {
        key: 'closed',
        name: '已关闭'
    }, {
        key: 'refunding',
        name: '退款中'
    },]


  //上传按钮
  const ExcelRef = ref(null)

  //上传按钮点击事件
  const handleExportExcel = ()=>{
      ExcelRef.value.open()
    }
  // infoModal 抽屉
  const infoModalRef = ref(null)
  const info = ref(null)
  const openInfoModal = (row)=>{
      // 将对象类型参数转数组
      row.order_items = row.order_items.map(i=>{
          let arr = []
          if(i.skus_type == 1 && i.goods_skus){
          // 给sku对象绑定数组
             for (const [k] in i.goods_skus.skus) {
                  arr.push(i.goods_skus.skus[k].value)
             }
          }
          i.sku = arr.join(',')
          return i
      })

      info.value = row

      infoModalRef.value.open()
  }

  // 同意或拒绝退款
  const handleRefund = (id,agree)=>{

 ( agree ? ElMessageBox.confirm('是否同意该订单退款？', '同意退款', {
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          type:'warning',
          }) :
          ElMessageBox.prompt('请输入拒绝的理由', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputValue: '',
          })).then(async({value})=>{

              let data = {agree}
              if(!agree){
                  data.disagree_reason = value
              }

              try {
              let result =  await refuseOrAgreeOrder(id,data)
              } catch (error) {
              console.log(error);
              }

          })




  }
</script>

<style scoped></style>
