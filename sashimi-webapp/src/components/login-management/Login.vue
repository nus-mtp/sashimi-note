<template>
  <div class="login-management">
    <div class="button-logo">
      <a class="vertical-align-child navbar-buttons">
        <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
        <p class="inline-block">
          SASHIMI NOTE
        </p>
      </a>
    </div>
    <div class="toggle-view" :data-active="view">
      <button class="navbar-buttons" v-on:click="toggleView('login')" data-format="login">
        Login</button>|
      <button class="navbar-buttons" v-on:click="toggleView('sign-up')" data-format="sign-up">
        Sign Up</button>
    </div>
    <div v-if="view === 'login'" class="login">
      <label for="username">Username:</label>
      <input type="text" placeholder="Username">
    </div>
    <div class="sign-up"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: 'login',
    };
  },
  methods: {
    toggleView(data) {
      this.view = data;
      console.log(this.view);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'src/assets/styles/loader.scss';
.login-management {
  text-align: center;
}

.button-logo {
  text-align: center;
  width: auto;

  a {
    &:hover {
      color: $navbar-logo-color;
    }
  }

  img {
    transform: scale(2.2);
  }
  
  p {
    margin-left: 40px;
    font-size: 50px;
  }
}

.login {
  input {
    font-family: $general-font;
    border: 1px solid black;
  }
}

.toggle-view {
  &[data-active='login'] button[data-format='login'], 
  &[data-active='sign-up'] button[data-format='sign-up']{
    font-weight: bold;
  }
}
</style>
