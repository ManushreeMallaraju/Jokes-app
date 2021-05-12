<template>
  <div>
    <h1>
      List of all the jokes retrieved
    </h1>
    <h4 v-for="(joke, idx) in jokes" :key="idx"> <!-- for v-for always use key -->
      <span>{{ idx + 1 }}</span>
      {{ joke }}
    </h4>
  </div>
</template>

<script>
export default {
    computed: {
        jokes() {
            return this.$store.getters.getAllJokes;
        }
    }
};
</script>

<style>
</style>