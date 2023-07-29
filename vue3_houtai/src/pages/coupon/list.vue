<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 17:38:42
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-10 21:58:20
 * @FilePath: \vue3_houtai\src\pages\coupon\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部 -->
        <template #header>
            <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        </template>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <!-- 优惠券 -->
            <el-table-column label="优惠券名称" width="350">
                <template #default="{row,data}">
                    <div class="border border-dashed p-2 rounded" :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                        <h5 class=" font-bold text-md">
                            {{ row.name}}
                        </h5>
                        <small>
                            {{ row.start_time }} ~ {{ row.end_time }}
                        </small>
                    </div>
                </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column prop="statusText" label="状态">
            </el-table-column>
            <el-table-column label="优惠">
                <template #default="{row,data}">
                    {{ !row.type ? "满减":"折扣" }} {{!row.type?("￥"+ row.value):(row.value+ "折")}}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.statusText == '未开始'" type="primary" text
                        @click="handleEdit(scope.row)">修改</el-button>

                    <el-popconfirm v-if="scope.row.statusText != '领取中'" title="是否要让删除该优惠券?" confirm-button-text="确认"
                        cancel-button-text="取消" @confirm.stop="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" text @click="()=>{}">删除</el-button>
                        </template>
                    </el-popconfirm>


                    <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否要让该优惠券失效?" confirm-button-text="失效"
                        cancel-button-text="取消" @confirm.stop="handleStatusChange(0,scope.row)">
                        <template #reference>
                            <el-button type="danger" @click="()=>{}">失效</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>


        </el-table>



        <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
            :current-page="currentPage" :page-size="limit" @current-change="getData" />

        <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
            <slot>
                <el-form :model="form" ref="formRef" :rules="rules">
                    <el-form-item label="优惠券名称" prop="name" style="width:50%">
                        <el-input v-model="form.name" placeholder="优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio :label="0" size="large" border>满减</el-radio>
                            <el-radio :label="1" size="large" border>折扣</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="面值" prop="value">
                        <el-input v-model="form.value" placeholder="面值" style="width:50%;">
                            <template #append>{{form.type ? "折":"元"}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="发行量" prop="total">
                        <el-input-number v-model="form.total" :min="1" :max="10000" />
                    </el-form-item>
                    <el-form-item label="最低使用价格" prop="min_price">
                        <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="form.order" :min="0" :max="100000" />
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <el-date-picker v-model="timerange" type="datetimerange" range-separator="To"
                            start-placeholder="开始时间" end-placeholder="结束时间" :editable="false"
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="form.desc" placeholder="描述" :row="5"></el-input>
                    </el-form-item>
                </el-form>
            </slot>
        </FormDrawer>
    </el-card>
</template>

<script setup>
  import {getCouponList,createCoupon,updateCoupon,deleteCoupon,updateCouponStatus } from "@/api/coupon.js"
  import ListHeader from "@/components/ListHeader.vue"
  import FormDrawer from '@/components/FormDrawer.vue'
  import TagInput from "@/components/TagInput.vue"
  import {useInitTable,useInitForm} from "@/composables/useCommon.js"
  import {computed} from 'vue'
  import {toast} from "@/utils/message.js"

    // form 表单功能
  const {    
      tableData,
      loading,
      currentPage,
      total,
      limit,  
      getData,
      handleDelete,
      handleStatusChange,
      handleSelectionChange,
      multipleTableRef,
      handleMultiDelete,
    }  = useInitTable({
        // 传入异步请求
        onGetList: getCouponList,
        delete:deleteCoupon,
        updateStatus:updateCouponStatus,
        onGetListSuccess(res){
            tableData.value = res.list.map(i=>{
                // 优惠券状态
                i.statusText = formatStatus(i)
                return i
            })
            total.value = res.totalCount
        }
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
      handleSubmit
     } = useInitForm({
      form: {
        name:'',
        type:0,
        value:20,
        total:100,
        min_price:100,
        start_time:null,
        end_time:null,
        order:50,
        desc:""

      },
       getData, 
     
       rules:{
        name:[{
            required:true,
            message:'规格名称不能为空',
            trigger:'blur'
        }],
        default:[{
            required:true,
            message:'规格值不能为空',
            trigger:'blur'
        }],
      },
      update:updateCoupon,
      create:createCoupon,
      beforeSubmit:(formList)=>{
        // 转换成时间戳
        if(typeof formList.start_time != 'number'){
            formList.start_time = (new Date(formList.start_time)).getTime()
        }

        if(typeof formList.end_time != 'number'){
            formList.end_time = (new Date(formList.end_time)).getTime()
        }
        return formList
      }
     })


    //  获取优惠券的状态
     function formatStatus(row) {
        let s= "领取中"
        let start_time = (new Date(row.start_time)).getTime()
        let now = (new Date()).getTime()
        let end_time = (new Date(row.end_time)).getTime()

        console.log(row.status +" == status");
        if (start_time>now) {
            s = "未开始"
        }else if(end_time<now){
            s = "已结束"
        }else if (row.status == 0){
            s= "已失效"
        }
        return s
       }


       



    //    时间选择器
    const timerange = computed({
        get(){
            return form.value.start_time && form.value.end_time ? [form.value.start_time,form.value.end_time] : []
        },
        set(val){
            form.value.start_time = val[0]
            form.value.end_time = val[1]
        }
    })
</script>

<style scoped>
    .active{
        @apply border-rose-300 bg-rose-50 text-red-400
    }

    .inactive{
        @apply bg-gray-200 bg-gray-50 to-gray-400
    }
</style>