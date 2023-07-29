<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-02 15:41:14
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-05 15:47:21
 * @FilePath: \manager_vue\vue3_houtai\src\pages\access\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-card shadow="never" :body-style="{ padding: '20px' }">
        <template #header>
            <div>
                <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
            </div>
        </template>
        <!-- 列表树 -->
        <el-tree :data="tableData" :props="{label:'name',children:'child'}" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <!-- 左:展示区域 -->
                    <el-tag size="small" :type="data.menu ? '': 'info' ">{{ data.menu ? '菜单' : '权限' }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>

                    <!-- 右:按钮 -->
                    <div class="ml-auto">
                        <!-- 选择框 -->
                        <el-switch v-model="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event,data)">
                        </el-switch>
                        <el-button type="primary" text="" size="default" @click.stop="handleEdit(data)">修改</el-button>
                        <el-button type="primary" text="" size="default" @click.stop="addChild(data.id)">添加</el-button>
                        <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm.stop="handleDelete(data.id)">
                            <template #reference>
                                <el-button type="primary" text @click="()=>{}">删除</el-button>
                            </template>
                        </el-popconfirm>

                    </div>
                </div>
            </template>
        </el-tree>
        <!-- 右：抽屉 -->
        <FormDrawer ref="formDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
            <slot>
                <!-- 中:Form -->
                <el-form :model="form" ref="formRef" :rules="rules">
                    <!-- Form:item1 -->
                    <el-form-item label="上级菜单" prop="rule_id">
                        <el-cascader v-model="form.rule_id" :options="rulesOption" :props="{ 
                            value:'id',
                            label:'name',children:'child', 
                             checkStrictly: true,emitPath:false}" placeholder="请选择上级菜单" clearable />

                    </el-form-item>
                    <!-- Form:item2 -->

                    <el-form-item label="菜单/规则" prop="menu">
                        <el-radio-group v-model="form.menu">
                            <el-radio :label="1" border>菜单</el-radio>
                            <el-radio :label="0" border>规则</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- Form:item3 -->

                    <el-form-item label="菜单/权限名称" prop="name">
                        <el-input v-model="form.name" style="width:30%"></el-input>

                    </el-form-item>
                    <!-- Form:item4 -->

                    <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
                        <IconSelect v-model="form.icon"></IconSelect>
                    </el-form-item>
                    <!-- Form:item5 -->

                    <el-form-item label="前端路由" prop="frontpath" v-if="form.menu== 1 && form.rule_id > 0">
                        <el-input v-model="form.frontpath"></el-input>
                    </el-form-item>
                    <!-- Form:item6 -->

                    <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                        <el-input v-model="form.condition"></el-input>

                    </el-form-item>
                    <!-- Form:item7 -->

                    <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
                        <el-select v-model="form.method" placeholder="请选择请求方式">
                            <el-option v-for="item in ['GET','POST','PUT','DELETE']" :key="item" :label="item"
                                :value="item" />
                        </el-select>
                    </el-form-item>
                    <!-- Form:item8 -->

                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="form.order" :min="0" :max="1000" />
                    </el-form-item>

                </el-form>
            </slot>
        </FormDrawer>

    </el-card>
</template>

<script setup>
import { ref,reactive } from 'vue';
import ListHeader from "@/components/ListHeader.vue"
import FormDrawer from '@/components/FormDrawer.vue'
import IconSelect from "@/components/IconSelect.vue"
import {
    getRuleList,
    createRule,
    updateRule,
    deleteRule,
    updateRuleStatus} from "@/api/rule.js"
import {useInitTable,useInitForm} from "@/composables/useCommon.js"

   

// 默认展开
const defaultExpandedKeys = ref([])
// 默认权限选项
const rulesOption = ref([])

// 列表:分页:搜索:删除:修改状态
const {
    loading,
    tableData,
    getData,

    handleDelete,
    handleStatusChange,
} = useInitTable({
    onGetList:getRuleList,
    onGetListSuccess(res){
        // 获取权限选项
        rulesOption.value = res.rules
        console.log( rulesOption.value );
        // 获取表格数据
        tableData.value = res.list

        defaultExpandedKeys.value = res.list.map(i=>i.id)
    },
    delete:deleteRule,
    updateStatus:updateRuleStatus
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
        rule_id:0,
        menu:0,
        name:'',
        condition:'',
        method:'GET',
        status:1,
        order:50,
        icon:'',
        frontpath:'',
    },
     getData,
     update:updateRule,
     create:createRule,
     rules:{
    }
   })


//添加子分类
const addChild = (id)=>{
    handleCreate()
    form.value.rule_id = id
    form.value.status = 1
}


</script>

<style scoped>
    .custom-tree-node{
        display: flex;
        flex: 1;
        font-size: 14px;
        padding-right: 8px;
        align-items: center;
    }

    .el-tree-node__content{
        padding: 20px 0;
    }
</style>

