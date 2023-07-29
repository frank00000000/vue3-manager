<template>
    <el-drawer title="订单详情" v-model="dialogVisible" direction="rtl" size="50%">
        <!-- card:订单信息 -->
        <el-card shadow="never" class="mb-3">
            <template #header>
                <div>
                    <h3>订单信息</h3>
                </div>
            </template>
            <!-- card body -->
            <el-form label-width="80px">
                <el-form-item label="订单号">
                    <div>
                        {{info.no}}
                    </div>
                </el-form-item>
                <el-form-item label="付款方式">
                    {{ info.payment_method }}
                </el-form-item>
                <el-form-item label="付款时间">
                    {{ info.paid_time }}
                </el-form-item>
                <el-form-item label="创建时间">
                    {{ info.create_time }}
                </el-form-item>
            </el-form>
        </el-card>

        <!-- card:发货信息 -->
        <el-card v-if="info.ship_data" shadow="never" class="mb-3">
            <template #header>
                <div>
                    <h3>发货信息</h3>
                </div>
            </template>
            <!-- card body -->
            <el-form label-width="75px">
                <el-form-item label="物流公司">
                    <div>
                        {{info.ship_data.express_company}}
                    </div>
                </el-form-item>
                <el-form-item label="运单号">
                    {{ info.ship_data.express_no }}

                    <el-button type="primary" text size="small" @click="openShipInfoModal(info.id)" class="ml-3"
                        :loading="loading">查看物流</el-button>

                </el-form-item>
                <el-form-item label="发货时间">
                    {{ ship_time || dayjs(info.ship_data.express_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
                </el-form-item>
            </el-form>
        </el-card>


        <!-- card:商品信息 -->
        <el-card shadow="never" class="mb-3">
            <template #header>
                <div>
                    <h3>商品信息</h3>
                </div>
            </template>
            <!-- card body -->
            <div class="flex mb-2" v-for="(item, index) in info.order_items">
                <!-- 左:商品图片 -->
                <el-image :src="item.goods_item?.cover ?? ''" :key="index" style="width: 60px; height: 60px;" fit="fill"
                    :lazy="true"></el-image>
                <!-- 右:商品内容 -->
                <div class="ml-2 mb-2">
                    <p class="text-sm mb-1"> {{item.goods_item?.title ?? '商品已被删除'}}</p>
                    <el-tag v-if="item.goods_skus?.sku" class="ml-1 mb-1" type="info" size="small">
                        {{item.goods_skus.sku}}
                    </el-tag>
                    <p class="text-sm text-gray-400">
                        <b class="text-red-500">￥{{
                            item.price}}</b>&nbsp;&nbsp;
                        <span class="text-xs">
                            x{{item.num}}
                        </span>
                    </p>
                </div>
            </div>
            <!-- 底部 -->
            <div>
                <el-form :model="form">
                    <el-form-item label-width="80px" label="成交价">
                        <span class="text-rose-500 font-bold">{{info.total_price}}</span>
                    </el-form-item>
                </el-form>
            </div>

        </el-card>

        <!-- card:收货信息 -->
        <el-card shadow="never" v-if="info.address" class="mb-3">
            <template #header>
                <div>
                    <h3>收货信息</h3>
                </div>
            </template>
            <!-- card body -->
            <el-form label-width="80px">
                <el-form-item label="收货人">
                    <div>
                        {{info.address.name}}
                    </div>
                </el-form-item>
                <el-form-item label="联系方式">
                    {{ info.address.phone}}
                </el-form-item>
                <el-form-item label="收货地址">
                    {{ info.address.province }}-
                    {{ info.address.city }}-
                    {{ info.address.district }}-
                    {{ info.address.address }}
                </el-form-item>
            </el-form>
        </el-card>


        <!-- card:退货信息 -->
        <el-card shadow="never" v-if="info.refund_status != 'pending'" class="mb-3">
            <template #header>
                <div>
                    <b class="text-sm">退款信息</b>
                    <el-button text disabled style="float:right">{{refund_status}}</el-button>
                </div>
            </template>
            <!-- card body -->
            <el-form label-width="80px">
                <el-form-item label="退款理由">
                    <div class=" font-semibold text-gray-400">
                        {{info.extra.refund_reason}}
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
    </el-drawer>

    <!-- 查询物流信息 -->
    <ShipInfoModal ref="ShipInfoModalRef"></ShipInfoModal>
</template>

<script setup>
import { ref,reactive,computed } from 'vue';
import {useDateFormat} from '@vueuse/core'
import dayjs from 'dayjs'
import ShipInfoModal from './ShipInfoModal.vue';
const props = defineProps({
    info:Object
})
const form = ref({})

// 打开抽屉
const dialogVisible = ref(false)
const open = (data)=>{
    form.value = data
    dialogVisible.value = true
}
// 关闭抽屉
const close = ()=>{
    dialogVisible.value = false
}

// 获取发货时间
const ship_time = computed(()=>{
    let time = ''
    if(props.info.ship_data) time = useDateFormat(props.info.ship_data.express_time*1000,'YYYY-MM-DD HH:mm:ss')

    return time.value || ''
})

// 退款状态
const refund_status = computed(()=>{
    const opt = {
        pending:'未退款',
        applied:'已申请,等待审核',
        processing:'退款中',
        success:'退款成功',
        failed:'退款失败'
    }
    return props.info.refund_status ?opt[props.info.refund_status] :''
})

// 物流抽屉
const ShipInfoModalRef = ref(null)
const loading = ref(false)
const openShipInfoModal = (id)=>{
    loading.value = true
    // 请求完成关闭loading状态
    ShipInfoModalRef.value.open(id).finally(()=>{
        loading.value = false
    })
}

defineExpose({
    open    
})

</script>

<style scoped>

</style>


