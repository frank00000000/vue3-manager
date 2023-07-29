<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-17 21:30:23
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-24 14:16:14
 * @FilePath: \vue3_houtai\src\pages\goods\skus.vue
 * @Description: 商品sku
-->
<template>
    <form-drawer ref="formDrawerRef" title="设置商品规格" @submit="submit" destroy-on-close size="70%">
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :label="0" size="large" border>单规格</el-radio>
                    <el-radio :label="1" size="large" border>多规格</el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 单规格 -->
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格" style="width: 50%;">
                    <el-input v-model="form.oprice" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格" style="width: 50%;">
                    <el-input v-model="form.pprice" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格" style="width: 50%;">
                    <el-input v-model="form.cprice" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量" style="width: 50%;">
                    <el-input v-model="form.weight" type="number">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积" style="width: 50%;">
                    <el-input v-model="form.volume" type="number">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>

            <!-- 多规格 -->
            <template v-else>
                <SkuCard></SkuCard>
                <SkuTable></SkuTable>
            </template>
        </el-form>
    </form-drawer>
</template>

<script setup>
import { ref,reactive} from 'vue';
import {readGoods,updateGoodsSkus} from "@/api/goods.js"
import { toast } from "@/utils/message.js"
import FormDrawer from '@/components/FormDrawer.vue'
import SkuCard from "./components/skuCard.vue"
import SkuTable from './components/SkuTable.vue'
import { goodsId,initSkuCardList, sku_list} from '@/composables/useSku.js';

// 抽屉
const formDrawerRef = ref(null)
const form = ref({
    sku_type:0,
    sku_value:{},
    goodsSkus:[]
})

// 打开商品详情抽屉
const open = (row)=>{
    goodsId.value = row.id
    row.skusLoading = true
    readGoods(goodsId.value).then((res) => {
    //获取商品规格
    form.value.sku_type = res.sku_type
    form.value.sku_value =res.sku_value || {
        oprice:0,
        pprice:0,
        cprice:0,
        weight:0,
        volume:0
    }
    form.value.goodsSkus = res.goodsSkus

    // 规格数据
    initSkuCardList(res)

    formDrawerRef.value.open()
    })
    .finally(()=>{
        row.skusLoading = false
    })
}



// 父组件 getdata 事件
const emit = defineEmits(["reloadData"])
// 提交
const submit = ()=>{
    formDrawerRef.value.showLoading()

    // 如果是多规格，添加goodsSkus属性
    let data = {
        sku_type:form.value.sku_type,
        sku_value:form.value.sku_value
    }

    if(form.value.sku_type == 1){
        data.goodsSkus = sku_list.value
    }

    updateGoodsSkus(goodsId.value,data)
    .then(res=>{
        toast("设置商品规格成功")
        formDrawerRef.value.close()
        emit('reloadData')
    })
    .finally(()=>{
        formDrawerRef.value.hideLoading()
    })
}


defineExpose({
    open
})
</script>

<style scoped>

</style>