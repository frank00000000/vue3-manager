import { ref, reactive, computed } from 'vue'
import { toast } from '@/utils/message.js'

// 列表:分页:搜索:删除:修改状态
export function useInitTable(
  option = {
    searchForm: {},
    onGetList: null,
    delete: null,
    updateStatus: null,
    onGetListSuccess: null,
  }
) {
  // 搜索功能动态传参
  let searchForm = ref(null)
  let resetSearchForm = ref(null)
  //  如果有传入动态参数,
  if (option.searchForm) {
    // 动态绑定
    searchForm.value = { ...option.searchForm }
    // 重置功能
    resetSearchForm.value = () => {
      for (const key in option.searchForm) {
        // searchForm.value 变成默认传入参数
        searchForm.value[key] = option.searchForm[key]
      }
      getData()
    }
  }

  // 服务器返回数据
  const tableData = ref([])
  const loading = ref(false)

  // 分页
  const currentPage = ref(1)
  const total = ref(500)
  const limit = ref(10)

  // 获取数据
  function getData(p = null) {
    if (typeof p == 'number') {
      currentPage.value = p
    }
    loading.value = true
    // 获取列表数据
    option
      // 动态发送ajax请求
      .onGetList(currentPage.value, searchForm.value)
      .then((res) => {
        if (
          option.onGetListSuccess &&
          typeof option.onGetListSuccess == 'function'
        ) {
          // 获取指定列表
          option.onGetListSuccess(res)
        } else {
          // 默认获取列表
          tableData.value = res.list
          total.value = res.totalCount

          console.log(tableData.value)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  getData()

  // 删除
  const handleDelete = (id) => {
    loading.value = true
    option
      .delete(id)
      .then((res) => {
        toast('删除成功')
        getData()
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 切换状态
  function handleStatusChange(event, row) {
    // loading 状态
    row.statusLoading = true
    // 发送请求
    option
      .updateStatus(row.id, event)
      .then((res) => {
        // 成功时修改row的status
        row.status = event
        toast('修改成功')
      })
      .finally(() => {
        row.statusLoading = false
      })
  }

  // form的Ref
  const multipleTableRef = ref(null)

  //  多选选中id List
  const multiSelectionIds = ref([])
  //  check事件赋值给选中list
  const handleSelectionChange = (e) => {
    multiSelectionIds.value = e.map((i) => i.id)
  }

  // 批量删除
  const handleMultiDelete = () => {
    loading.value = true
    option
      .delete(multiSelectionIds.value)
      .then((res) => {
        toast('删除成功')
        if (multipleTableRef.value) {
          // 清空所有check
          multipleTableRef.value.clearSelection()
        }
        getData()
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 批量修改状态
  const handleMultiStatusChange = (status) => {
    loading.value = true
    option
      .updateStatus(multiSelectionIds.value, status)
      .then((res) => {
        toast('修改状态成功')
        // 清空选中
        if (multipleTableRef.value) {
          // 清空所有check
          multipleTableRef.value.clearSelection()
        }
        getData()
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    searchForm,
    resetSearchForm,
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
    handleMultiStatusChange,
    multiSelectionIds,
  }
}
// 新增:修改
export function useInitForm(option = {}) {
  // 抽屉表单Ref
  const formDrawerRef = ref(null)
  const formRef = ref(null)
  // 提交抽屉表单
  const form = ref({})
  // 默认表单
  const defaultForm = option.form

  const rules = option.rules || {}
  // 区别新增与修改指定的ID
  const editId = ref(0)
  // 公告标题
  const DrawerTitle = computed(() => (editId.value ? '修改' : '添加'))

  // 添加按钮
  function handleCreate() {
    editId.value = 0
    resetForm(defaultForm)
    formDrawerRef.value.open()
  }
  // 编辑按钮
  const handleEdit = (row) => {
    if (row.id) editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
  }

  // 重置抽屉表单
  function resetForm(row = null) {
    if (formRef.value) formRef.value.clearValidate()

    for (const key in defaultForm) {
      form.value[key] = row[key]
    }
  }
  // 添加或修改
  function handleSubmit() {
    formRef.value.validate((valid) => {
      if (!valid) return
      formDrawerRef.value.showLoading()

      let body = {}
      // 如果存在拦截方法，执行拦截方法拦截form对象
      if (option.beforeSubmit && typeof option.beforeSubmit == 'function') {
        body = option.beforeSubmit({ ...form.value })
      } else {
        body = form.value
      }

      // 存在 id 则修改，不存在添加
      let fun = editId.value
        ? option.update(editId.value, body)
        : option.create(body)

      fun
        .then((res) => {
          editId.value ? toast('修改成功') : toast('添加成功')
          formDrawerRef.value.close()
          // 刷新当前页，新增刷新第一页
          option.getData(editId.value ? false : 1)
        })
        .finally(() => {
          formDrawerRef.value.hideLoading()
        })
    })
  }

  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    DrawerTitle,
    handleCreate,
    handleEdit,
    resetForm,
    handleSubmit,
  }
}
