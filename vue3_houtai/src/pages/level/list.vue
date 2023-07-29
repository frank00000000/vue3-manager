<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:04:16
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-25 20:46:37
 * @FilePath: \vue3_houtai\src\pages\level\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部 -->
        <template #header>
            <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        </template>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="会员等级" />
            <el-table-column prop="discount" label="折扣率" align="center" />
            <el-table-column prop="level" label="等级序号" align="center" />
            <el-table-column label="状态">
                <template #default="{row}">
                    <!-- 状态:切换 -->
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :v-loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="order" label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm.stop="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" text @click="()=>{}">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="flex items-center justify-center mt-5" background layout="prev, pager, next" :total="total"
            :current-page="currentPage" :page-size="limit" @current-change="getData" />
        <!-- 添加更新抽屉 -->
        <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
            <slot>
                <el-form :model="form" ref="formRef" :rules="rules">
                    <el-form-item label="等级名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
                    </el-form-item>
                    <el-form-item label="等级权重" prop="level">
                        <el-input v-model="form.level" type='number' placeholder="请输入等级名称"></el-input>
                    </el-form-item>
                    <el-form-item label="是否起用" prop="status">
                        <el-switch :model-value="form.status" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="升级条件" prop="status">
                        <div>
                            <div>
                                <small class="text-xs mr-2">累计消费满</small>
                                <el-input type="number" v-model="form.max_price" placeholder="累计消费" style="width:50%">
                                    <template #append>
                                        元
                                    </template>
                                </el-input>
                                <small class="to-gray-400 flex">设置会员等级所需的累计消费必须大于等于0，单位：元</small>
                            </div>
                            <div>
                                <small class="text-xs mr-2">累计消费次数满</small>
                                <el-input type="number" v-model="form.max_times" placeholder="累计次数" style="width:50%">
                                    <template #append>
                                        笔
                                    </template>
                                </el-input>
                                <small class="to-gray-400 flex">设置会员等级所需的累计消费次数必须大于等于0，单位：笔</small>
                            </div>

                        </div>

                    </el-form-item>

                    <el-form-item label="折扣率(%)" prop="discount">
                        <el-input type="number" v-model="form.discount" placeholder="折扣率(%)" style="width:50%">
                            <template #append>
                                %
                            </template>
                        </el-input>
                        <small class="to-gray-400 flex">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
                    </el-form-item>
                </el-form>
            </slot>
        </FormDrawer>

    </el-card>
</template>
  
<script setup>
  import { getLevelList,createLevel,updateLevel,deleteLevel,updateLevelStatus } from "@/api/level.js"
  import ListHeader from "@/components/ListHeader.vue"
  import FormDrawer from '@/components/FormDrawer.vue'
  import {useInitTable,useInitForm} from "@/composables/useCommon.js"
  import {ref} from 'vue'
  import { getRuleList } from '@/api/rule.js'
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
    }  = useInitTable({
        // 传入异步请求
        onGetList: getLevelList,
        delete:deleteLevel,
        updateStatus:updateLevelStatus
        
      })

    console.log(tableData);
  
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
        "name": "",
		"level": 100,
		"status": 1,
		"discount": 0,
		"max_price": 0,
		"max_times": 0,
      },
       getData, 
       update:updateLevel,
       create:createLevel,
       rules:{
        name:[{
            require:true,
            message:'会员等级名称不能为空',
            trigger:'blur'
        }]
      }
     })


    // 配置权限
    const handleSetRuleSubmit = ()=>{
        setRuleFormDrawerRef.value.showLoading()
        setLevelRules(roleId.value,ruleIds.value).then(
            res=>{
                toast("配置成功")
                getData()
                setRuleFormDrawerRef.value.close()
            }
        ).finally(()=>{
            setRuleFormDrawerRef.value.hideLoading()
        })
    }



     
  </script>
  
<style scoped></style>
  