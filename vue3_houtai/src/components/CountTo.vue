<!--
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-15 14:52:09
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-15 15:35:52
 * @FilePath: \vue3_houtai\finally_project\src\components\CountTo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
