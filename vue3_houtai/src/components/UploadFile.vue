<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-26 20:53:21
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-26 22:48:56
 * @FilePath: \manager_vue\vue3_houtai\src\components\UploadFile.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-upload
    drag
    :action="uploadImageAction"
    multiple
    :headers="{token}"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将图片拖到这里 or <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">jpg/png 文件的大小不能超过 500KB.</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {uploadImageAction} from "@/api/image.js"
import {getToken} from "@/utils/token.js"
import {toast} from "@/utils/message.js"
// const token = ''
const token = getToken()

defineProps(
    {
        data:Object
    }
)

const emit = defineEmits(["success"])

// 上传成功
const  uploadSuccess = (response ,uploadFile, uploadFiles)=>{
    emit('success',{
        response ,uploadFile, uploadFiles
    })
    toast("上传成功")
}

// 上传失败
const uploadError = (error, uploadFile, uploadFiles)=>{
    const msg = JSON.parse(error).msg || "上传失败"
    toast(msg,"error")
}
</script>

<style scoped></style>
