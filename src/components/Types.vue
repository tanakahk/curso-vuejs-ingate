<template>
  <label>Types:</label>
  <div class="t-container">
    <div v-for="type in types" :key="type.slot" class="t-item">
      <img v-if="type.type.name === 'grass'" src="@/assets/leaf.svg" />
      <img v-if="type.type.name === 'poison'" src="@/assets/skull.svg" />
      <img v-if="type.type.name === 'fire'" src="@/assets/fire.svg" />
      <img v-if="type.type.name === 'water'" src="@/assets/water.svg" />
      <img v-if="type.type.name === 'bug'" src="@/assets/bug.svg" />
      <img v-if="type.type.name === 'flying'" src="@/assets/fly.svg" />
      {{ type.type.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    types: { type: Array, required: true },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.t-container {
  display: flex;
}

.t-item {
  display: flex;
  /* border: 1px solid black; */
  align-items: center;
  margin: 2px;
}
</style>
