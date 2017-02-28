<template>
  <div>
    <userInputs v-model="action"></userInputs>
    <div class="documents">
      <documents :action="action"></documents>
    </div>
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
    action(value) {
      console.log(value);
    }
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.documents {
  padding: 20px;
}

</style>
