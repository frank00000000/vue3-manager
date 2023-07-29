/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-20 11:35:14
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-24 16:51:24
 * @FilePath: \vue3_houtai\src\composables\useSku.js
 * @Description:
 */
import { ref, nextTick, computed } from 'vue'
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard,
} from '@/api/goods.js'

import { useArrayMoveUp, useArrayMoveDown } from '@/utils/sort.js'
import { cartesianProductOf } from '@/utils/sort.js'
// 当前商品ID
export const goodsId = ref(0)

// 规格选项列表
export const sku_card_list = ref([])

// sku表单
export const sku_list = ref([])

// 初始化多规格选项列表
export function initSkuCardList(d) {
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    item.text = item.name
    item.loading = false
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || '属性值'
      return v
    })
    return item
  })
  sku_list.value = d.goodsSkus
  getTableData()
}

// 添加规格卡片
export const btnLoading = ref(false)
export function addSkuCardEvent() {
  btnLoading.value = true
  // 发起创建good请求
  createGoodsSkusCard({
    goods_id: goodsId.value,
    name: '规格选项',
    order: 50,
    type: 0,
  })
    //  添加规格选项后，给本地添加属性
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      })
    })
    .finally(() => {
      btnLoading.value = false
    })
}

// 修改规格
export function changeSkusCard(item) {
  item.loading = true
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: item.type,
  })
    // 修改成功 text => name
    .then((res) => {
      sku_card_list.value.name = sku_card_list.value.text
    })
    // 修改失败数据不变 name => text
    .catch((err) => {
      sku_card_list.value.text = sku_card_list.value.name
    })
    .finally(() => {
      item.loading = false
    })
}

// 删除规格
export function deleteSkusCard(item) {
  item.loading = true
  deleteGoodsSkusCard(item.id)
    // 删除成功
    .then((res) => {
      sku_card_list.value = sku_card_list.value.filter((i) => i.id != item.id)
      getTableData()
    })
    .finally(() => {
      item.loading = false
    })
}
// 选择设置规格
export function handleChooseSetGoodsSkusCard(id, data) {
  let item = sku_card_list.value.find((o) => o.id == id)
  item.loading = true
  chooseAndSetGoodsSkusCard(id, data)
    .then((res) => {
      item.name = item.text = res.goods_skus_card.name
      item.goodsSkusCardValue = res.goods_skus_card_value.map((i) => {
        // text属性值设置为
        i.text = i.value || '属性值'
        return i
      })

      getTableData()
    })
    .finally(() => {
      item.loading = false
    })
}

// 卡片的loading效果
export const bodyLoading = ref(false)
// 添加规样卡片选项
// 规格卡片排序
export async function sortCard(action, index) {
  // 获取 sku_card_list 的映射
  let oList = JSON.parse(JSON.stringify(sku_card_list.value))

  // 本地数据排序方法
  const func = action == 'up' ? useArrayMoveUp : useArrayMoveDown
  func(oList, index)

  //  排序后的数据修改成服务器上传格式
  const sortdata = oList.map((o, index) => {
    return {
      id: o.id,
      order: index + 1,
    }
  })
  bodyLoading.value = true
  try {
    // 发送修改请求
    const result = await sortGoodsSkusCard({
      sortdata,
    })
    // 成功 修改真实卡片的排序
    func(sku_card_list.value, index)
    getTableData()

    bodyLoading.value = false
  } catch (error) {
    console.log('err', error)
    bodyLoading.value = false
  }
}

// 初始化规格卡片的规格选项 tag
export function initSkusCardItem(id) {
  //规格值数组
  const item = sku_card_list.value.find((o) => o.id == id)
  // 输入框的内容
  const inputValue = ref('')
  // 控制输入inp框显示隐藏
  const inputVisible = ref(false)
  const InputRef = ref()

  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }

  const loading = ref(false)
  // 添加规格选项属性
  const handleInputConfirm = async () => {
    if (!inputValue.value) {
      inputVisible.value = false
      return
    }
    // 发送请求
    createGoodsSkusCardValue({
      goods_skus_card_id: id,
      name: item.name,
      order: 50,
      value: inputValue.value,
    })
      .then((res) => {
        // 自定义text 数据错误是使用name
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        })
        // 数据修改为指定格式
        getTableData()
      })
      .finally(() => {
        inputVisible.value = false
        inputValue.value = ''
        loading.value = false
      })
  }

  // 修改tab标签的inp属性
  const handleChange = (value, tag) => {
    loading.value = true
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id,
      name: item.name,
      order: tag.order,
      value: value,
    })
      .then((res) => {
        tag.value = value
        getTableData()
      })
      .catch(() => {
        tag.text = tag.value
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 删除规格选项属性
  const handleClose = (tag) => {
    loading.value = true

    deleteGoodsSkusCardValue(tag.id)
      .then((res) => {
        const index = item.goodsSkusCardValue.findIndex((i) => i.id == tag.id)
        if (index > -1) {
          item.goodsSkusCardValue.splice(index, 1)
        }
        getTableData()
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,
  }
}

// 初始化表格
export function initSkuTable() {
  const skuLabels = computed(() =>
    sku_card_list.value.filter((i) => i.goodsSkusCardValue.length > 0)
  )

  // 获取表头
  const tableThs = computed(() => {
    let length = skuLabels.value.length
    return [
      {
        name: '商品规格',
        colspan: length,
        width: '',
        rowspan: length > 0 ? 1 : 2,
      },
      {
        name: '销售价',
        width: '100',
        rowspan: 2,
      },
      {
        name: '市场价',
        width: '100',
        rowspan: 2,
      },
      {
        name: '成本价',
        width: '100',
        rowspan: 2,
      },
      {
        name: '库存',
        width: '100',
        rowspan: 2,
      },
      {
        name: '体积',
        width: '100',
        rowspan: 2,
      },
      {
        name: '重量',
        width: '100',
        rowspan: 2,
      },
      {
        name: '编码',
        width: '100',
        rowspan: 2,
      },
    ]
  })
  return {
    skuLabels,
    tableThs,
    sku_list,
  }
}

// 获取规格表格数据
function getTableData() {
  setTimeout(() => {
    if (sku_card_list.value.length === 0) return []
    let list = []
    // 数据重新处理
    sku_card_list.value.forEach((o) => {
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue)
      }
    })
    // 长度为空返回空数组
    if (list.length == 0) {
      return []
    }
    // 获取格式化后的 goodsSkusCardValue数据
    let arr = cartesianProductOf(...list)

    // 获取之前的规格列表，将规格ID排序后转换成字符串
    let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map((o) => {
      if (!Array.isArray(o.skus)) {
        o.skus = Object.keys(o.skus).map((k) => o.skus[k])
      }

      o.skusId = o.skus
        .sort((a, b) => a.id - b.id)
        .map((s) => s.id)
        .join(',')

      return o
    })

    sku_list.value = []
    sku_list.value = arr.map((skus) => {
      // 传入新旧skulist
      let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
      return {
        code: o?.code || '',
        cprice: o?.cprice || '0.00',
        goods_id: goodsId.value,
        image: o?.image || '',
        oprice: o?.oprice || '0.00',
        pprice: o?.pprice || '0.00',
        skus,
        stock: o?.stock || '0',
        volume: o?.volume || '0',
        weight: o?.weight || '0',
      }
    })
  }, 300)
}

// 新旧skulist对比
function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus
    .sort((a, b) => a.id - b.id)
    .map((s) => s.id)
    .join(',')

  let arr = beforeSkuList.find((o) => {
    // 新的sku长度大于旧的
    if (skus.length > o.skus.length) {
      // 返回新数组包含旧的skulist
      return skusId.indexOf(o.skusId) != -1
    }
    // 返回旧的skulist 包含新的skulist
    return o.skusId.indexOf(skusId) != -1
  })
  return arr
}
