<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 14:52:09
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-15 15:35:52
 * @FilePath: \vue3_houtai\finally_project\src\components\CountTo.vue
 * @Description: 数字滚动变化
-->
<template>
  {{num.num.toFixed(0)}}
</template>

<script setup>
import { ref,reactive ,watch} from 'vue';
import gsap from "gsap";

const props = defineProps({
    value:{
        type:Number,
        default:0
    }
})

    const num = reactive({
        num:0
    })


    function AnimateToValue() {
        gsap.to(num,{
            duration:0.5,
            num:props.value
        })
      }
      AnimateToValue()


    watch(()=>props.value,()=>AnimateToValue())
</script>

<style scoped></style>
