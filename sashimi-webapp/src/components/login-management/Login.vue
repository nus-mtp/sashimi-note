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
    <div class="login">
      <div class="username">
        <input type="text" placeholder="Username">
      </div>
      <div class="password">
        <input type="password" placeholder="Password">
      </div>
      <a href="#" class="forget-password">
        <p>Forget Password?</p>
      </a>
      <div class="login-button">
        <button>
          <a href="#">
            Login
          </a>
        </button>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     view: 'login',
  //   };
  // },
  // methods: {
  //   toggleView(data) {
  //     this.view = data;
  //     // console.log(this.view);
  //   }
  // }
};
</script>

<style scoped lang="scss">
@import 'src/assets/styles/loader.scss';
.login-management {
  text-align: center;
  background-color: $navbar-background-color;
}

.button-logo {
  width: 515px;
  margin: 0 auto;
  padding: 10px;
  a {
    &:hover {
      color: $navbar-logo-color;
    }

    img {
      width: 100px;
    }
    p {
      font-size: 50px;
      margin-left: 25px;
      letter-spacing: 3px;
    }
  }
}

.login {
  width: 500px;
  margin: 0 auto;
  padding: 20px;

  label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  input {
    font-family: $general-font;
    border: 1px solid $navbar-border-color;
    width: 350px;
    padding: 10px;
    margin-left: 20px;

    &:focus {
      border: 1px solid #f7994c;
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
    }
  }

  a {
    text-decoration: none;

    &:visited,
    &:active {
      color: black;
    }
  }

  .forget-password {
    text-align: right;
    margin-top: 10px;
    text-decoration: none;

    p {
      font-size: 14px;
      color: #afafaf;
    }
  }

  .username,
  .password {
    margin-top: 40px;
  }

  .login-button {
    text-align: right;
    margin-top: 40px;

    button {
      border: none;
      background-color: #d8d8d8;
      font-family: $general-font;
      padding: 10px 25px;
      box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
    }
  }
}
</style>
