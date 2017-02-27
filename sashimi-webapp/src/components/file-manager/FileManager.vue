<template>
  <div>
    <userInputs></userInputs>
    <div class="documents">
      <documents></documents>
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
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.documents {
  padding: 20px;
}

</style>
