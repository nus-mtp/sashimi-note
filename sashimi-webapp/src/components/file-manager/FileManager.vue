<template>
  <div>
    <userInputs></userInputs>
    <navbar v-model="searchString"></navbar>
    <div class="documents">
      <documents></documents>
    </div>
  </div>
</template>

<script>
import navbar from './Navbar';
import documents from './Documents';
import userInputs from './UserInputs';

export default {
  components: {
    navbar,
    documents,
    userInputs,
  },
};

</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.documents {
  padding: 20px;
}

</style>
