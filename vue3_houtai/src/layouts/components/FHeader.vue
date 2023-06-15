<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-06 15:40:27
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-07 19:12:40
 * @FilePath: \vue3_houtai\finally_project\src\layouts\components\FHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="f-header">
    <span class="logo">
      <el-icon>
        <ElementPlus />
      </el-icon>
      后台管理
    </span>

    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <expand v-if="$store.state.asideWidth == '250px'" />
      <Fold v-else />
    </el-icon>

    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh />
      </el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center ">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="全屏"
        placement="bottom"
      >
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-show="!isFullscreen" />
          <Aim v-show="isFullscreen" />
        </el-icon>
      </el-tooltip>

      <el-dropdown class="dropdown" @command="handleComment">
        <span class="flex items-center justify-between text-light-50">
          <el-avatar :size="25" :src="$store.state.user.avatar" />
          <span class="mx-3">
            {{ $store.state.user.username}}
          </span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="output">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <FormDrawer ref="formDrawerRef" title="修改密码" @submit="onSubmit">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="small"
    >
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input
          v-model="form.oldpassword"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input
          v-model="form.repassword"
          placeholder="确认新密码"
          show-password
        />
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!-- <el-drawer v-model="drawer" title="修改密码" size="45%" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" size="small">
            <el-form-item label="旧密码" prop="oldpassword">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入新密码" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="form.repassword" placeholder="确认新密码" show-password />
            </el-form-item>
            <el-form-item>
                <el-button round plain type="primary" @click="onSubmit" color="#636eee" :loading="loading">确认</el-button>
                <el-button round plain type="primary" @click="drawer = false" color="#636eee"
                    :loading="loading">取消</el-button>
            </el-form-item>
        </el-form>
                                                                        </el-drawer>  -->
</template>
<script setup>
import {useFullscreen} from "@vueuse/core"
import FormDrawer from "@/components/FormDrawer.vue";
import {useRepassword,useLogout} from "@/composables/useManager.js"

/**
 * @description vueuse全屏的操作
 * @param isFullscreen 是否全屏状态
 * @param toggle 切换全屏状态
 * @return {*}
 */
const {isFullscreen,toggle} = useFullscreen()
const { formDrawerRef,
        openRepassword,
        form,
        rules,
        formRef,
        onSubmit} = useRepassword()

const {logout} = useLogout()
/**
 * @description: 下拉菜单点击事件的回调
 * @return {*}
 */
 const handleComment = (cb)=>{
    switch (cb) {
        case 'rePassword': openRepassword()
        break;
        case 'output':logout()
        break;
        default:
            break;
    }

}

/**
 * @description: 刷新页面
 * @return {*}
 */
const handleRefresh = ()=>{
   location.reload()
}
</script>
<style scoped>
  .f-header{
      @apply flex items-center bg-indigo-500 h-[64px] fixed top-0 left-0 right-0
  }

  .logo{
      width: 250px;
      @apply flex justify-center items-center mx-4 text-light-50 font-medium text-xl
      cursor: pointer;

  }

.icon-btn{
      @apply flex justify-center items-center text-light-50 ;
      width: 42px;
      height: 64px;
      cursor: pointer;
  }

  .icon-btn:hover{
      @apply bg-indigo-600
  }
  .f-header .dropdown{
      @apply  flex justify-center items-center mx-5
     h-[64px] text-light-50 cursor-pointer
  }
</style>
