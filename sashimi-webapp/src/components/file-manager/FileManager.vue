<template>
  <div>
    <userInputs v-model="action"></userInputs>
    <documents :action="action"></documents>
  </div>
</template>

<script>
import documents from './Documents';
import userInputs from './UserInputs';

export default {
  components: {
    documents,
    userInputs,
  },
  data() {
    return {
      action: '',
    };
  },
  watch: {
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
