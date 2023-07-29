<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-19 17:15:58
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-23 14:33:28
 * @FilePath: \vue3_houtai\src\pages\goods\components\skuCard.vue
 * @Description: 
-->
<template>
    <el-form-item label="规格选项" v-loading="bodyLoading">
        <el-card shadow="never" class="w-full mb-3" v-loading="item.loading" v-for="(item, index) in sku_card_list"
            :key="item.id">
            <template #header>
                <div class=" flex items-center justify-between">
                    <!-- 左:输入框 -->
                    <el-input v-model="item.text" placeholder="规格名称" style="width: 200px;" @change="changeSkusCard(item)">
                        <template #append>
                            <el-icon @click="handleChooseSku(item)" class="cursor-pointer">
                                <More />
                            </el-icon>
                        </template>
                    </el-input>
                    <!-- 右:按钮 -->
                    <span>
                        <!-- 上移 -->
                        <el-button size="small" @click="sortCard('up',index)" :disabled="index == 0">
                            <el-icon>
                                <Top />
                            </el-icon>
                        </el-button>
                        <!-- 下移 -->
                        <el-button size="small" @click="sortCard('down',index)"
                            :disabled="index == sku_card_list.length - 1">
                            <el-icon>
                                <Bottom />
                            </el-icon>
                        </el-button>
                        <el-popconfirm title="是否要删除该商品选项" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="deleteSkusCard(item)">
                            <template #reference>
                                <!-- 规格选项 -->
                                <el-button size="small">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </span>
                </div>
            </template>
            <!-- 商品规格卡片；传入item.id -->
            <skuCardItem :skuCardId="item.id"></skuCardItem>
        </el-card>
        <el-button type="success" :loading="btnLoading" @click="addSkuCardEvent">添加规格</el-button>
    </el-form-item>

    <ChooseSku ref="chooseSkuRef"></ChooseSku>
</template>

<script setup>
import { ref,reactive } from 'vue';
import skuCardItem from '@/pages/goods/components/skuCardItem.vue'
import { 
    sku_card_list,
    addSkuCardEvent,
    btnLoading,
    changeSkusCard,
    deleteSkusCard,
    sortCard,
    bodyLoading,
    handleChooseSetGoodsSkusCard
} from "@/composables/useSku.js"
import ChooseSku from '@/components/ChooseSku.vue'

const chooseSkuRef = ref(null)
const handleChooseSku = (item) =>{
    // cb回调 form的check选中
    chooseSkuRef.value.open((form)=>{
        // 向服务器发请求
        handleChooseSetGoodsSkusCard(item.id,{
            name:form.value.name,
            value:form.value.list
        })
    })


}


</script>

<style scoped>
.el-card__header{
    @apply !p-2 bg-gray-50
}
 
</style>
                                                                                                                                                                                                                                                                                                  
