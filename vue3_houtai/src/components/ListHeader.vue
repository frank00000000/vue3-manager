<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-02 16:34:50
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-27 13:14:18
 * @FilePath: \vue3_houtai\src\components\ListHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="flex justify-between items-center my-1">
        <!-- 头部:左:添加:删除:slot -->
        <span>
            <el-button v-if="btns.includes('create')" type="primary" @click="$emit('create')">添加</el-button>
            <el-popconfirm title="是否删除选中记录?" v-if="btns.includes('delete')" confirm-button-text="确认" cancel-button-text="取消"
                @confirm.stop="$emit('delete')">
                <template #reference>
                    <el-button type="danger" @click="">批量删除</el-button>
                </template>
            </el-popconfirm>
            <slot></slot>
        </span>
        <!-- 头部:右:刷新 -->
        <span>
            <el-tooltip v-if="btns.includes('refresh')" class="box-item" effect="dark" content="刷新一下" placement="top">
                <el-button size="small" text @click="$emit('refresh')">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="btns.includes('download')" class="box-item" effect="dark" content="导出数据" placement="top">
                <el-button size="small" text @click="$emit('download')">
                    <el-icon :size="20">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </span>
    </div>
</template>

<script setup>
import { ref,reactive,computed} from 'vue';
const props = defineProps({
    layout:{
        type:String,
        default:"create,refresh"
    }
})
// 控制按钮显示
const btns = computed(()=>props.layout.split(","))


defineEmits(['create','refresh','delete','download'])

</script>

<style scoped>

</style>