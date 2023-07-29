<template>
    <el-col :span="8">
        <el-form-item :label="label">
            <slot></slot>
        </el-form-item>
    </el-col>
</template>

<script setup>
import { ref,reactive } from 'vue';

defineProps({
    label:String
})
    
    
</script>

<style scoped>

</style>