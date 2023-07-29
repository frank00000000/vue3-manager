<template>
    <el-form :model="model" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="20">
            <slot></slot>
            <template v-if="showSearch">
                <slot name="show"></slot>
            </template>
            <!-- 右：盒子 -->
            <el-col :span="8" :offset="showSearch ? 0 :  8">
                <div class="flex items-center justify-end">
                    <!-- 左：搜索 -->
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <!-- 中：重置 -->
                    <el-button @click="$emit('reset')">重置</el-button>
                    <!-- 右：收起:展开 -->
                    <el-button v-if="hasShowSearch" type="primary" text @click="showSearch = !showSearch">
                        {{ showSearch ? '收起':"展开" }}
                        <el-icon>
                            <ArrowUp v-if="showSearch" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref,reactive,useSlots } from 'vue';

defineProps({
    model:Object
})

defineEmits(['search','reset'])


// 控制分类展开收起
const showSearch = ref(false)

const slots = useSlots()
const hasShowSearch = ref(!!slots.show)

</script>

<style scoped>

</style>