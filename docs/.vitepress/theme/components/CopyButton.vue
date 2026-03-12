<template>
  <button @click="copy">Copy</button>
</template>

<script setup>
const copy = () => {
  navigator.clipboard.writeText("npm install my-project")
}
</script>
