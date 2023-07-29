<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-18 23:20:42
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-30 23:19:54
 * @FilePath: \manager_vue\vue3_houtai\src\components\imageMain.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 图库主要区域 -->
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item,index) in list" :index="item.id">
          <el-card shadow="hover" class="relative mb-3" :body-style="{'padding':0}"
            :class="{'border-blue-500':item.checked}">
            <!-- 图片 -->
            <el-image :src="item.url" class="w-full h-[150px]" fit="cover" :lazy="true" :preview-src-list="[item.url]"
              :initial-index="0" />
            <div>
              <span class="img-title">{{item.name}}</span>
              <div class="flex items-center justify-center p-2">
                <!-- 左:选中 -->
                <el-checkbox v-show="openChoose" v-model="item.checked" @change="handleChooseChange(item)"></el-checkbox>
                <!-- 中:按钮 -->
                <el-button text class="button" type="primary" @click="handleEdit(item)">重命名</el-button>
                <!-- 右:按钮 -->
                <el-popconfirm title="是否要删除该图片?" confirm-button-text="确认" cancel-button-text="取消" class="w-[100px]"
                  @confirm="handleDelete(item)">
                  <template #reference>
                    <el-button text class="button !mx-0" type="primary">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-main>

  <el-drawer v-model="drawerUpload" title="上传图片">
    <UploadFile :data="{image_class_id}" @success="handleUploadSuccess"></UploadFile>
  </el-drawer>
</template>

<script setup>
import { ref,reactive,getCurrentInstance ,computed} from 'vue';
import { getImageList,setImageName,deleteImage} from "@/api/image.js"
import {showPrompt,toast} from "@/utils/message.js"
import UploadFile from './UploadFile.vue'
// 获取vue实例
const install = getCurrentInstance()
// 上传图片
const drawerUpload = ref(false)
function openUploadFile() {
  drawerUpload.value = true
}
install.proxy.$bus.on('openUpload',()=>{
  openUploadFile()
})

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(8)
const list = ref([])
const image_class_id = ref(0)

// loading
const loading = ref(false)

// 获取图片
function getData(p){
  // 分页器传入的是数字，修改 currentPage
  if(typeof p == 'number'){
    currentPage.value = p
  }
  // loading状态
  loading.value = true
  getImageList(image_class_id.value,currentPage.value,limit.value).then(res=>{
    total.value = res.totalCount    // 数据条数
    list.value = res.list.map(i=>{
      i.checked = false
      return i
    })           // 获取用户列表
  }).finally(()=>{
    loading.value = false
  })
}

// 订阅 img_id
install.proxy.$bus.on('getImgList',(id)=>{
  loadData(id)
})

// 根据分类ID重新加载图片列表
const loadData = (id)=>{
  currentPage.value = 1
  image_class_id.value = id
  getData()
}


// 图片选择框显示隐藏
const prop = defineProps({
  openChoose:{
    type:Boolean,
    default:false
  },
  limit:{
    type:Number,
    default:1
  }
})





// 获取选中图片数量
const checkedImage = computed(()=>list.value.filter(i => i.checked))
const emit = defineEmits(["chooseChecked"])
// 图片选择框
const handleChooseChange = (item) =>{
  // 防止重复选取
  if (  item.checked && checkedImage.value.length > prop.limit ) {
    item.checked = false
    return toast(`最多只能选中 ${prop.limit} 张`,"error")
  }

  // 传回选中的值
  emit('chooseChecked',checkedImage.value)
}


// 修改图片名称
function handleEdit(item){
  showPrompt("重命名",item.name)
  .then(({value})=>{
    loading.value=true
    setImageName(item.id,value).then(res=>{
    loading.value=false
    toast('修改成功')
    getData()
    })
  })
}

// 删除img
const  handleDelete = (item)=>{
  loading.value=true
  deleteImage([item.id]).then(
    res=>{
     loading.value=false
     toast('删除成功')
     getData()
    }
  ).finally(()=>{
    loading.value=false
  })
}

// 图片上传成功的回调
    const handleUploadSuccess = (cb) => {
      getData()
      
    }
</script>

<style scoped>

.image-main{
  position: relative;
}

.image-main .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}


.image-main .bottom{
  position: absolute;
  height: 50px;
  right: 0;
  left: 0;
  bottom: 0;

  @apply flex justify-center items-center
}

.img-title{
  position: absolute;
  top:116px;
  left:-1px;
  right:-1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800  px-2 py-1
}
</style>
