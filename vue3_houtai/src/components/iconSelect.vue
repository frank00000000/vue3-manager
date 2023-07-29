<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-04 17:12:21
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-04 17:51:23
 * @FilePath: \vue3_houtai\src\components\iconSelect.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
    <div class="flex items-center">
        <!-- icon -->
        <el-icon v-if="modelValue" :size="30" class="pr-2">
            <component :is="modelValue"></component>
        </el-icon>
        <!-- 下拉图片 -->
        <el-select filterable :modelValue="modelValue" placeholder="请选择图标" @change="handleChange">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex justify-between items-center">
                    <span>
                        <el-icon>
                            <component :is="item"></component>
                        </el-icon>
                    </span>
                    <span class="text-gray-600">
                        {{ item }}
                    </span>
                </div>
            </el-option>
        </el-select>

    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import * as iconList from '@element-plus/icons-vue'

defineProps(['modelValue'])
// 获取饿了么所有icon的key
const icons = ref(Object.keys(iconList))

const emit = defineEmits(["update:modelValue"])

const handleChange = (e)=>{
    console.log(e);
    emit('update:modelValue',e)
}

</script>

<style scoped>

</style>