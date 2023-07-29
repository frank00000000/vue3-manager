<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:04:16
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-13 14:35:19
 * @FilePath: \vue3_houtai\src\pages\role\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部 -->
        <template #header>
            <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        </template>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="430" />
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
                    <el-button type="primary" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
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
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="desc">
                        <el-input v-model="form.desc" placeholder="请输入角色描述"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-switch :model-value="form.status" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                </el-form>
            </slot>
        </FormDrawer>

        <!-- 权限配置抽屉 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="配置权限" @submit="handleSetRuleSubmit">
            <!-- 列表 -->
            <el-tree-v2 ref="elTreeRef" :default-expanded-keys="defaultExpandedKeys" :check-strictly="CheckStrictly"
                :data="ruleList" :props="{ label:'name',children:'child'}" show-checkbox :height="treeHeight"
                @check="handleTreeCheck">
                <template #default="{ node,data }">
                    <div class="flex items-center">
                        <!-- 左：Tag -->
                        <el-tag :type="data.menu?'':'info'" size="small">
                            {{data.menu ? "菜单": "权限"}}
                        </el-tag>
                        <!-- 右: 权限名称 -->
                        <span class="ml-3 text-sm">
                            {{ data.name }}
                        </span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>
  
<script setup>
  import { getRoleList,createRole,updateRole,deleteRole,updateRoleStatus,setRoleRules } from "@/api/role.js"
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
        onGetList: getRoleList,
        delete:deleteRole,
        updateStatus:updateRoleStatus
        
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
        desc:'',
        status:1
      },
       getData, 
       update:updateRole,
       create:createRole,
       rules:{
      }
     })


    //  抽屜2
    const setRuleFormDrawerRef = ref(null)
    // 权限数据
    const ruleList = ref([])
    const roleId = ref(0)
    // 抽屉高度
    const treeHeight = ref(0)
    //默认展开的节点的 key 的数组
    const defaultExpandedKeys = ref([])
    // 权限列表ref
    const elTreeRef = ref(null)
    // 当前用户拥有的权限id
    const ruleIds = ref([])
    // 获取父子组件是否不关联  
    // true不关联 false关联 
    // 关联时勾选父组件所有子组件一起勾选
    const CheckStrictly = ref(false)

    // 打开配置权限抽屉
    const openSetRule = (row)=>{
        roleId.value = row.id
        // 抽屉高度
        treeHeight.value = window.innerHeight - 180
        // 发送请求前设置不关联
        CheckStrictly.value = true
        getRuleList(1).then(res=>{
            ruleList.value =  res.list
            //默认展开的节点的 key 的数组
            defaultExpandedKeys.value = res.list.map(o=>o.id)
            setRuleFormDrawerRef.value.open()

            // 当前角色拥有的权限
            ruleIds.value = row.rules.map(i=>i.id)
            setTimeout(() => {
                // 设置check的所有节点 
                elTreeRef.value.setCheckedKeys(ruleIds.value)

                // 请求后设置关联
                CheckStrictly.value = false
            }, 150);

        })
    }

    // 切换check
    const  handleTreeCheck = (...e) => {
        // 拿到event中check和子check
        const {checkedKeys,halfCheckedKeys} = e[1]
        // 切换
        ruleIds.value = [...checkedKeys,...halfCheckedKeys]
    }

    const handleSetRuleSubmit = ()=>{
        setRuleFormDrawerRef.value.showLoading()
        setRoleRules(roleId.value,ruleIds.value).then(
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
  