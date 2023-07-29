<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-30 19:48:55
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-19 00:06:25
 * @FilePath: \vue3_houtai\src\components\ChooseImage.vue
 * @Description: 图库插件
-->
<template>
    <div v-if="modelValue">
        <el-image v-if="(typeof modelValue=='string')" :src="modelValue" fit="cover" :lazy="true"
            class=" w-[100px] h-[100px] rounded border mr-2"></el-image>

        <div v-else class="flex flex-wrap">
            <div v-for="(url, index) in modelValue" :key="index" class="relative mx-1 mb-2 w-[100px] h-[100px]">
                <el-icon @click="removeImage(url)" class="absolute top-1 right-1 cursor-pointer bg-light-50 rounded-full "
                    style="z-index:10">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" :lazy="true" class=" w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>
    <!-- 图标 -->
    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>
    <!-- 弹框 -->
    <el-dialog title="选择图片" width="80%" top="5vh" v-model="dialogVisible">
        <!-- 插槽:图片 -->
        <div class="rounded bg-light-50" style="height:65vh">
            <el-container class="h-[100%]">
                <el-header class="image-header">
                    <span>
                        <el-button type="primary" @click="handleOpenCreate">新增图片分类</el-button>
                    </span>
                    <span>
                        <el-button type="warning" @click="handleOpenUpload">上传图片</el-button>
                    </span>
                </el-header>
                <el-container>
                    <ImageAside ref="ImageAsideRef"></ImageAside>
                    <imageMain :limit="limit" @chooseChecked="handleChoose" openChoose></imageMain>
                </el-container>
            </el-container>
        </div>
        <!-- 底部插槽:按钮 -->
        <template #footer>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref,reactive,getCurrentInstance } from 'vue';
import ImageAside from '@/components/imageAside.vue'
import imageMain from '@/components/imageMain.vue';
import {toast} from "@/utils/message.js"
    // 获取vue实例
    const install = getCurrentInstance()
  // 获取子组件实例
  const ImageAsideRef = ref(null)
  // 获取open
  const handleOpenCreate = ()=>ImageAsideRef.value.handleCreate()
  // 上传图片
  const handleOpenUpload = ()=>{
    install.proxy.$bus.emit('openUpload')
  }
  // 控制 dialog 图片组件显示
  const dialogVisible = ref(false)

  // open时传入的回调
  const callbackFunction = ref(null)

    // 打开dialog
    const open = (callback = null)=>{
        callbackFunction.value = callback
        dialogVisible.value = true
    }
    const close = ()=>{
        console.log( dialogVisible.value ,"close");
        dialogVisible.value = false
    }


// 图片数组
let urls = []
// 图片传回的回调
const handleChoose = (cb)=>{
    urls = cb.map(i=>i.url)
}

// 获取父组件prop
const props = defineProps({
    modelValue:[String,Array],
    limit:{
        type:Number,
        default:1
    },
    preview:{
        type:Boolean,
        default:true
    }
})
// 获取修改的emit
const emit = defineEmits(['update:modelValue'])

// 删除图片
const removeImage = (url)=>{
    const imgArr = props.modelValue.filter(u => u != url)
    emit('update:modelValue',imgArr)
}

// 提交按钮
function submit() {
    let value = []
    if(props.limit == 1){
        value = urls[0]
    }else{
        //  图标选择图片 合并已有图片和选中图片 否则 返回选中图片
       value = props.preview ? [...props.modelValue, ...urls] : [...urls]
        if(value.length > props.limit){

            //  图标选择图片 返回最大图片数 - 选择图片数
            let limit = props.preview ? (props.limit - props.modelValue.length):props.limit 
            return toast(`最多还能选择 ${limit}张`)
        }
    }
    // 有图标选择图片，
    if(value && props.preview){
        emit('update:modelValue',value)
    }

    // 没有图标选择图片
    if(!props.preview && typeof callbackFunction.value === "function"){
        // 回传 url
        callbackFunction.value(value)
    }
    close()
}

defineExpose({
    open
})

</script>

<style scoped>
.choose-image-btn{
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center
    cursor-pointer hover:(bg-gray-100)
}
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center
}
.image-header span {
  @apply mx-1
}
</style>