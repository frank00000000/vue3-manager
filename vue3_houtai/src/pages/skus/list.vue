<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:04:16
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-17 17:23:48
 * @FilePath: \vue3_houtai\src\pages\skus\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部 -->
        <template #header>
            <ListHeader @create="handleCreate" @refresh="getData" @delete="handleMultiDelete"
                layout="create,refresh,delete"></ListHeader>
        </template>

        <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="loading"
            @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="default" label="规格值" width="430" />
            <el-table-column prop="order" label="排序" />
            <el-table-column label="状态">
                <template #default="{row}">
                    <!-- 状态:切换 -->
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :v-loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)"></el-switch>
                </template>
            </el-table-column>

            <el-table-column prop="default" label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除该规格?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm.stop="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" text @click="()=>{}">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>


        <!-- 添加更新抽屉 -->
        <FormDrawer ref="formDrawerRef" destroyOnClose :title="DrawerTitle" @submit="handleSubmit">
            <slot>
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                    <el-form-item label="规格名称" prop="name">
                        <el-input v-model="form.name" placeholder="规格名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="form.order" :min="0" :max="1000" :step="1">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-input v-model="form.desc" placeholder="请输入角色描述"></el-input>
                    </el-form-item>
                    <el-form-item form-item label="规格值" prop="default">
                        <TagInput v-model="form.default">
                        </TagInput>
                    </el-form-item>
                </el-form>
            </slot>
        </FormDrawer>
    </el-card>
</template>
  
<script setup>
    import {getSkusList,createSkus,updateSkus,deleteSkus,updateSkusStatus,setSkusRules } from "@/api/skus.js"
  import ListHeader from "@/components/ListHeader.vue"
  import FormDrawer from '@/components/FormDrawer.vue'
  import TagInput from "@/components/TagInput.vue"
  import {useInitTable,useInitForm} from "@/composables/useCommon.js"
  import {ref} from 'vue'
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
        onGetList: getSkusList,
        delete:deleteSkus,
        updateStatus:updateSkusStatus
        
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
        status:'1',
        name:'',
        order:50,
        default:''
      },
       getData, 
       update:updateSkus,
       create:createSkus,
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

      }
     })


  </script>
  
<style scoped></style>
  