<template>
  <i class="gg-spinner-alt"></i>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
 @keyframes spinneralt {
  0% { transform: rotate(0deg) }
  to { transform: rotate(359deg) }
}

.gg-spinner-alt {
  --ggs: 1.2;
 transform: scale(var(--ggs,1));
 color: #858ea1;
 margin: 0 auto;
}

.gg-spinner-alt,
.gg-spinner-alt::before {
 box-sizing: border-box;
 position: relative;
 display: block;
 width: 20px;
 height: 20px
}

.gg-spinner-alt::before {
 content: "";
 position: absolute;
 border-radius: 100px;
 animation: spinneralt 1s cubic-bezier(.6,0,.4,1) infinite;
 border: 3px solid transparent;
 border-top-color: currentColor
} 
</style>
