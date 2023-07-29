<template>
  <!-- 图库侧边栏 -->
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <!-- 单个图片卡片 -->
      <AsideList
        :active="activeId == item.id"
        v-for="(item, index) in imgList"
        :key="item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item)"
        @click="handleChangeActiveId(item.id)"
      >
        {{item.name}}
      </AsideList>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>

  <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref,reactive,computed,getCurrentInstance} from 'vue';
import {getImageClassList,createImageClass,updateImageClass,deleteImageClass} from "@/api/image_class.js"
import {toast} from "@/utils/message.js"
import AsideList from "@/components/AisdeList.vue"
import FormDrawer from "./FormDrawer.vue"
const loading = ref(false)
// 选中样式
const activeId = ref(0)
// 图库列表
const imgList = ref([]);

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(6)


// 获取图库列表数据
function getData(p){
  // 分页器传入的是数字，修改 currentPage
  if(typeof p == 'number'){
    currentPage.value = p
  }
  // loading状态
  loading.value = true
  getImageClassList(currentPage.value,limit.value).then(res=>{
    total.value = res.totalCount    // 数据条数
    imgList.value = res.list     // 获取用户列表
    // 默认active
    let active = imgList.value[0]
    if (active) {
      handleChangeActiveId(active.id)
    }
  }).finally(()=>{
    loading.value = false
  })
}
getData()


 //抽屉slot
 const form = reactive({
  name:'',
  order:50
})
//抽屉 rules
const rules = {
  name:[{
    required:true,
    message:"图库分类名称不能为空",
    trigger:'blur'
  }]
}
// 抽屉ref
const formRef = ref(null)

// 编辑id
const editId = ref(0)
// 通过id获取抽屉的title
const drawerTitle = computed(()=>{
  return editId.value==0 ? '新增' : '修改'
})

// 抽屉ref
const formDrawerRef = ref(null)
// 新增图库分类按钮
const handleCreate = ()=>{
  editId.value = 0
  form.name = ''
  form.order = 50
  formDrawerRef.value.open()
}
//编辑图库按钮
const handleEdit =(row)=>{
  editId.value = row.id
  form.name = row.name
  form.order = row.order
  formDrawerRef.value.open()

}
//删除图库按钮
const handleDelete = (row)=>{
  formDrawerRef.value.showLoading()
  deleteImageClass(row.id).then((res)=>{
      toast('删除成功')
      getData(editId.value? currentPage.value : 1)
    })
    .finally(()=>formDrawerRef.value.hideLoading()
  )
}
// 抽屉组件submit提交表单按钮
function handleSubmit() {
  formRef.value.validate(valid=>{
    console.log(valid);
    if (!valid) {
      return
    }

    formDrawerRef.value.showLoading()
    // 添加或修改图片分类 0 是添加 , 1 是修改
    const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form);
    const msg = editId.value ? '修改' : '添加'

    fun.then((res) => {
      toast(msg + "成功")
      getData(editId.value? currentPage.value : 1)
       formDrawerRef.value.close()
    }).catch((err)=>{
      toast( msg + '失败',err)
    })
    .finally(() => {
       formDrawerRef.value.hideLoading()
    });

  })


 }

/*
 子-父-子 暂时弃用

// main中切换分类的emit方法
const emit = defineEmits(['change'])
// 切换分类
function handleChangeActiveId(id)
{
  activeId.value = id
  emit('change',id)
}
 */

//  获取vue实例
 const install = getCurrentInstance()
 // 切换分类
 function handleChangeActiveId(id)
{
  activeId.value = id
  // 发布
  install.proxy.$bus.emit('getImgList',id)
}


const openUploadFile = ()=>{

}


defineExpose({
  handleCreate,
  openUploadFile
})
</script>

<style scoped>
.image-aside{
  border-right: 1px solid #eeeeee;
  position: relative;
}


.image-aside .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom{
  position: absolute;
  height: 50px;
  right: 0;
  left: 0;
  bottom: 0;

  @apply flex justify-center items-center
}
</style>
