import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { messageBox, toast } from '@/utils/message'
import { logOut, updatePassword } from '@/api/manager'
import { useRouter } from 'vue-router'
/**
 * @description: 抽屉功能
 * @return {*}
 */
export function useRepassword() {
  const router = useRouter()
  const store = useStore()
  // 抽屉原型
  const formDrawerRef = ref(null)
  // 打开抽屉
  const openRepassword = () => formDrawerRef.value.open()

  // 修改密码需要的属性
  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: '',
  })

  // 密码校验
  const rules = {
    oldpassword: [
      {
        required: true,
        message: '旧密码不能为空',
        trigger: 'blur',
      },
      {
        min: 3,
        max: 16,
        message: '密码长度应该在 3-16 个字符',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '修改密码不能为空',
        trigger: 'blur',
      },
      {
        min: 3,
        max: 16,
        message: '密码长度应该在 3-16 个字符',
        trigger: 'blur',
      },
    ],
    repassword: [
      {
        required: true,
        message: '确认修改密码不能为空',
        trigger: 'blur',
      },
      {
        min: 3,
        max: 16,
        message: '密码长度应该在 3-16 个字符',
        trigger: 'blur',
      },
    ],
  }

  /**
   * @description: 获取 formDrawer 组件
   * @return {*}
   */
  const formRef = ref(null)
  const onSubmit = () => {
    // 获取validate 校验结果
    formRef.value.validate(async (valid) => {
      if (!valid) {
        return false
      }
      // loading 开始
      formDrawerRef.value.showLoading()
      try {
        await updatePassword(form)
        toast('修改密码成功，请重新登录')
        store.dispatch('logout')
        router.push('/login')
      } catch (error) {
        formDrawerRef.value.hideLoading()
      }
    })
  }

  // enter 回车触发 onSubmit()
  function onKeyup(e) {
    if (e.key != 'Enter') {
      return
    }
    onSubmit()
  }
  onMounted(() => {
    // 添加事件
    document.addEventListener('keyup', onKeyup)
  })
  onUnmounted(() => {
    // 删除事件
    document.removeEventListener('keyup', onKeyup)
  })
  return {
    formDrawerRef,
    openRepassword,
    form,
    rules,
    formRef,
    onSubmit,
  }
}

export function useLogout() {
  const router = useRouter()
  const store = useStore()
  /**
   * @description: 退出登录
   * @return {*}
   */
  const logout = () => {
    messageBox('退出登录', '您确定要退出官网吗').then((res) => {
      logOut().finally(() => {
        store.dispatch('logout')
        router.push('login')
        //弹出退出消息
        toast('退出成功', 'success')
      })
    })
  }
  return {
    logout,
  }
}
