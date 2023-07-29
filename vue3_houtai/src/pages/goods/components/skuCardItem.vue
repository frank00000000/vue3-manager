<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-20 10:38:14
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-22 17:08:28
 * @FilePath: \vue3_houtai\src\pages\goods\components\skuCardItem.vue
 * @Description: 
-->
<template>
    <div v-loading="loading">
        <!-- 商品规格属性 Tag-->
        <el-tag v-for="(tag,index) in item.goodsSkusCardValue" :key="index" class="mx-1" closable @close="handleClose(tag)"
            effect="plain">
            <!-- 修改规格属性 -->
            <el-input class="w-20 ml-[-10px]" v-model="tag.text" placeholder="选项值" size="small" clearable
                @change="handleChange($event,tag)"></el-input>
        </el-tag>


        <!-- 添加规格属性 -->
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            +添加
        </el-button>

    </div>
</template>

<script setup>
import { ref,reactive,nextTick } from 'vue';
import { initSkusCardItem } from '@/composables/useSku.js';

const props =  defineProps({
    skuCardId:[Number,String]
})
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange
} = initSkusCardItem(props.skuCardId)

</script>

<style scoped>

</style>
