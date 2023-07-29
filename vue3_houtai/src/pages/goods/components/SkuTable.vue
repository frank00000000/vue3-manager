<template>
    <el-form-item label="规格设置">
        <table class="border">
            <thead>
                <tr>
                    <th class="border" v-for="(th,i) in tableThs" :key="i" :width="th.width" :rowspan="th.rowspan"
                        :colspan="th.colspan">
                        {{ th.name }}
                    </th>
                </tr>
                <tr>
                    <th class="border" v-for="(th, index) in skuLabels" :key="index">
                        {{ th.name }}
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="(item, index) in sku_list" :key="index">
                    <td class="text-center" width="100" v-for="(sku, skuIndex) in item.skus" :key="skuIndex">{{ sku.value }}
                    </td>
                    <td>
                        <el-input v-model="item.pprice" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.oprice" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.cprice" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.stock" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.volume" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.weight" size="small" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.code" size="small"></el-input>
                    </td>
                </tr>

            </tbody>
        </table>
    </el-form-item>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {initSkuTable} from "/src/composables/useSku.js"

const {
    skuLabels,
    tableThs,
    sku_list
} = initSkuTable()

</script>

<style scoped>
td{

    @apply border
}
</style>