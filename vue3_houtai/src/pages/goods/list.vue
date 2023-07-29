<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-07 23:21:05
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-24 22:51:40
 * @FilePath: \vue3_houtai\src\pages\goods\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
      <el-tab-pane v-for="(i,index) in tabbars" :label="i.name" :name="i.key" :key="index">
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <template #header>
        <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
          <!-- 左：盒子 -->
          <SearchItem label="关键词">
            <!-- 搜索框 -->
            <el-input v-model="searchForm.title" placeholder="商品昵称" clearable>
            </el-input>
          </SearchItem>
          <template #show>
            <!-- 中：盒子 : 高级表单搜索 -->
            <SearchItem label="商品分类">
              <el-select v-model="searchForm.category_id" value-key="" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </SearchItem>
          </template>
        </Search>
        <!-- 新增 |刷新 -->
        <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData">

          <el-button size="danger" @click="handleMultiDelete" v-if="searchForm.tab != 'delete'">批量删除</el-button>
          <el-button type="warning" @click="handleRestoreGoods" v-else>恢复商品</el-button>

          <el-popconfirm v-if="searchForm.tab == 'delete'" title="是否彻底删除该商品?" confirm-button-text="确认"
            cancel-button-text="取消" @confirm.stop="handleDestoryGoods">
            <template #reference>
              <el-button type="danger">彻底删除</el-button>
            </template>
          </el-popconfirm>



          <el-button size="small" @click="handleMultiStatusChange(1)"
            v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
          <el-button size="small" @click="handleMultiStatusChange(0)"
            v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
        </ListHeader>
      </template>
      <!-- 表单 -->
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%" v-loading="loading">

        <!-- check：多选框 -->
        <el-table-column type="selection" width="55" />
        <!-- 表格:row1 -->
        <el-table-column label="商品" width="330">
          <template #default="{ row }">
            <div class="flex items-center">
              <!-- 左:图片 -->
              <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px; height: 50px;">
              </el-image>

              <!-- 右:文案 -->
              <div class="flex-1">
                <!-- 标题 -->
                <p>{{ row.title}}</p>
                <!-- 价格 -->
                <div>
                  <span class=" text-rose-500">￥{{row.min_price}}</span>
                  <el-divider direction="vertical" />
                  <span class=" text-gray-500 text-xs">￥{{row.min_oprice}}</span>
                </div>
                <!-- 分类 -->
                <div class="text-gray-400 text-xs mb-1">分类:{{ row.category? row.category.name : "未分类" }}</div>
                <div class="text-gray-400 text-xs ">创建时间:{{ row.create_time}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 表格:row2 -->
        <el-table-column label="实际销量" prop="sale_count" width="80" align="center">
        </el-table-column>
        <!-- 表格:row3 -->
        <el-table-column label="商品状态" width="100" align="center">
          <template #default="{row}">
            <el-tag :type="row.status ? 'success':'warning' " class="ml-2">{{ row.status ? "已上架":"仓库"}}</el-tag>
          </template>
        </el-table-column>
        <!-- 表格:row4 -->
        <el-table-column label="审核状态" width="120" align="center">
          <template #default="{row}">
            <div v-if="row.ischeck == 0" class="flex flex-col">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
            </div>
            <span v-else>
              {{row.ischeck == 1 ? "通过" : "拒绝" }}
            </span>
          </template>
        </el-table-column>
        <!-- 表格:row5 -->
        <el-table-column label="总库存" prop="stock" width="90" align="center">
        </el-table-column>
        <!-- 表格:row6 -->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button class="px-1" type="primary" text @click="handleEdit(scope.row)">修改</el-button>
              <!-- 点击:打开商品规格抽屉 -->
              <el-button class="px-1" :type="(scope.row.sku_type == 0 && !scope.row.sku_value) ||
                 (scope.row.sku_type == 1 && !scope.row.goods_skus.length)? 'danger' :'primary'" text
                :loading="scope.row.skusLoading" @click="handleSetGoodsSkus(scope.row)">商品规格</el-button>
              <!-- 点击:打开轮播图抽屉 -->
              <el-button class="px-1" text :type="scope.row.goods_banner.length == 0 ? 'danger' :'primary'"
                @click="handleSetGoodsBanner(scope.row)" :loading="scope.row.bannersLoading">设置轮播图</el-button>

              <!-- 点击:打开商品详情抽屉 -->
              <el-button class="px-1" type="primary" text @click="handleSetGoodsContent(scope.row)"
                :type="!scope.row.content ? 'danger' :'primary'" :loading="scope.row.contentLoading">商品详情</el-button>

              <el-popconfirm title="是否删除该商品?" confirm-button-text="确认" cancel-button-text="取消"
                @confirm.stop="handleDelete([scope.row.id])">
                <template #reference>
                  <el-button class="px-1" type="primary" text @click="()=>{}">删除</el-button>
                </template>
              </el-popconfirm>
            </div>

            <span v-else>暂无操作</span>

          </template>
        </el-table-column>
      </el-table>

      <!-- 底部:分页器 -->
      <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
        :current-page="currentPage" :page-size="limit" @current-change="getData" />

    </el-card>


    <!-- 抽屉:插件 -->
    <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
      <slot>
        <!-- 表单 -->
        <el-form :model="form" ref="formRef" :rules="rules">
          <!-- 表单1:input 商品名称 -->
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符">
            </el-input>
          </el-form-item>
          <!-- 表单2:ChooseImage 组件 -->
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover"></ChooseImage>
          </el-form-item>
          <!-- 表单3:下拉框 商品分类 -->
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择所属商品分类">
              <el-option v-for="(item,index) in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 表单4:input 商品描述 -->
          <el-form-item label="商品描述" prop="desc">
            <el-input type="textarea" v-model="form.desc" placeholder="请输入商品卖点"></el-input>
          </el-form-item>

          <!-- 表单5:input 单位 -->
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" style="width:50%"></el-input>
          </el-form-item>


          <!-- 表单5：切换按钮 总库存 -->
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 50%;">
              <template #append>
                件
              </template>
            </el-input>
          </el-form-item>

          <!-- 表单6:input 单位 -->

          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 50%;">
              <template #append>
                件
              </template>
            </el-input>
          </el-form-item>

          <!-- 表单7:input 最低销售价 -->
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 50%;">
              <template #append>
                元
              </template>
            </el-input>
          </el-form-item>
          <!-- 表单8:input 最低原价 -->
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice" type="number" style="width: 50%;">
              <template #append>
                元
              </template>
            </el-input>
          </el-form-item>

          <!-- 表单9:radio 库存显示 -->
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>

          </el-form-item>
          <!-- 表单9:radio 是否上架 -->
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </slot>
    </FormDrawer>


    <!-- 抽屉:轮播图 -->
    <Banners ref="bannersRef" @reloadData="getData"></Banners>

    <!-- 抽屉:商品详情 -->
    <Content ref="contentRef" @reloadData="getData">
    </Content>

    <!-- 抽屉:商品规格 -->
    <Skus ref="skusRef" @reloadData="getData"></Skus>


  </div>
</template>

<script setup>
import { ref} from 'vue';
import { getGoodsList,updateGoodsStatus,updateGoods,createGoods,deleteGoods,restoreGoods,destroyGoods} from "@/api/goods.js"
import ChooseImage from "@/components/ChooseImage.vue"
import FormDrawer from '@/components/FormDrawer.vue'
import ListHeader from "@/components/ListHeader.vue"
import  Search from "@/components/Search.vue"
import SearchItem from "@/components/SearchItem.vue"
import Banners from '@/pages/goods/banners.vue'
import Content from "@/pages/goods/content.vue"
import Skus from "@/pages/goods/skus.vue"

import {useInitTable,useInitForm} from "@/composables/useCommon.js"
import {getCategoryList} from "@/api/category.js"
import {toast} from "@/utils/message.js"

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
        title:"",
        tab:"all",
        category_id:null,
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
      onGetList: getGoodsList,
      delete:deleteGoods,
      updateStatus:updateGoodsStatus
  })
  // 抽屉表单功能
  const {
    formDrawerRef,
    formRef,
    form,
    rules,
    DrawerTitle,
    handleCreate,
    handleEdit,
    handleSubmit,
 } = useInitForm({
  form: {
  title:null,	 		
	category_id:null,
	cover:null,
	desc:null, 
	unit:"件",
  stock:100,
	min_stock:10,
	status:1,
	stock_display:1,
	min_price:0,
	min_oprice:0
  },
   getData,
   update:updateGoods,
   create:createGoods,
   delete:deleteGoods,
   
 })


//  all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabbars = [ 
  {
        key: 'all',
        name: '全部'
    },
    {
        key: 'checking',
        name: '审核中'
    },
    {
        key: 'saling',
        name: '出售中'
    },
    {
        key: 'off',
        name: '已下架'
    },
    {
        key: 'min_stock',
        name: '库存警告'
    },
    {
        key: 'delete',
        name: '回收站'
    },]

// 商品分类
const category_list = ref([])
getCategoryList().then((res) => {
  category_list.value = res
}).catch((err) => {
  console.log(err);
});

// 轮播图组件
const bannersRef = ref(null)
// 设置轮播图
function handleSetGoodsBanner(row) {
  bannersRef.value.open(row)
}

// 设置商品详情
const contentRef = ref(null)
function handleSetGoodsContent(row) {

  console.log("商品");

  contentRef.value.open(row)
}

// 设置商品规格
const skusRef = ref(null)
function handleSetGoodsSkus(row) { 
    skusRef.value.open(row)
}


// 恢复商品
const handleRestoreGoods =()=> useMultiAction({
  request:restoreGoods,
  msg:'恢复成功'
})

// 彻底删除选中
const  handleDestoryGoods =()=> useMultiAction({
  request:destroyGoods,
  msg:"彻底删除成功"
})

// 多选框复用函数
function useMultiAction(opt) {  
  loading.value = true
  // 发送请求
  opt.request(multiSelectionIds.value).then(res=>{
    // 成功的消息
    toast(opt.msg)
    // 多选框
    if(multipleTableRef.value){

      console.log(multipleTableRef.value);

      multipleTableRef.value.clearSelection()
    }
    
    getData()
  }).finally(()=>{
    loading.value = false
  })

}

</script>

<style scoped></style>
