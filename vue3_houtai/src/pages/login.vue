<style scoped lang="scss">
.login-container {
  @apply min-h-screen bg-indigo-500
}

.login-container .left,
.login-container .right {
  @apply flex items-center justify-center
}

.login-container .right {
  @apply bg-light-50 flex-col
}

.left>div>div:first-child {
  @apply text-light-50 font-bold text-5xl mb-4
}

.left>div>div:last-child {
  @apply text-light-50 text-sm
}

.right .title {
  @apply font-bold text-3xl text-gray-800 text-center
}

.right>div:nth-child(2) {
  @apply flex items-center justify-center my-5 space-x-2 text-gray-400
}

.right .inline {
  @apply h-[1px] w-16 bg-gray-300
}

.right>div:last-child {
  @apply w-[250px]
}
</style>
<template>
  <el-row class="login-container">
    <el-col :md="12" :lg="16" class="left">
      <div>
        <div>欢迎光临</div>
        <div>vue3 + vite 后台管理系统 陆小杭：924169430@qq.com</div>
      </div>
    </el-col>
    <el-col :md="12" :lg="8" class=" right">
      <div class="title">欢迎回来</div>
      <div>
        <span class="inline"> </span>
        <span>账号密码登录</span>
        <span class="inline"></span>
      </div>
      <div>
        <el-form ref="formRef" :rules="rules" :model="form">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名">
              <template #prefix>
                <el-icon>
                  <user />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              show-password
            >
              <template #prefix>
                <el-icon>
                  <lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              round
              plain
              type="primary"
              @click="onSubmit"
              color="#636eee"
              class="w-[250px]"
              :loading="loading"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref,onMounted,onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {toast} from '@/utils/message'
import { useStore } from 'vuex'

//账号密码输入框
const form = reactive({
    username:'',
    password:''
})
// router实例
const router = useRouter()
// store实例
const store = useStore()

// 校验规则
const rules = {
        username:[
            {
                required:true,
                message:"用户名不能为空",
                trigger:'blur'
            },
            {
                min:3,
                max:8,
                message:"用户名长度应该在 3-8 个字符",
                trigger:'blur'
            },
        ],
        password:[
        {
                required:true,
                message:"密码不能为空",
                trigger:'blur'
            },
            {
                min:3,
                max:8,
                message:"密码长度应该在 6-16 个字符",
                trigger:'blur'
            },
        ]
}
// 表单
const formRef = ref(null)
// btn 加载状态
const loading = ref(false)
const onSubmit = () => {
    // 获取validate 校验结果
   formRef.value.validate(async valid=>{
        if(!valid){
            return false
        }
        // loading 开始
        loading.value = true
        try {
        // 登录
        await store.dispatch('login',form)
        // 成功消息提示
        loading.value = false
        // 跳转
        router.push('/')
        toast('登录成功')

        } catch (error) {
          loading.value = false
        }
    })


}

//  enter 回车触发 onSubmit()
function onKeyup(e){
  if(e.key!="Enter"){
    return
  }
  onSubmit()
}

onMounted(()=>{
// 添加事件
document.addEventListener('keyup',onKeyup)
})
onUnmounted(() => {
  // 删除事件
document.removeEventListener('keyup', onKeyup)
})
</script>
