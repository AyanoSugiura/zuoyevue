<template>
  <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="phone">
      <el-input type="text" v-model="loginForm.phone" auto-complete="off" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%" v-bind:disabled="isKong">登录</el-button>
    </el-form-item>
    <router-link to="/register">没有账号？点击此处注册</router-link>
  </el-form>
</template>
<script>
  export default {
    data() {
      /* var validatePhone = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户名不能为空"));
        } else {
          if (this.loginForm.phone !== "") {
            //this.$refs.loginForm.validateField("phone");
          }
          callback();
        }
      };
  
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("密码不能为空"));
        } else {
          if (this.loginForm.checkPass !== "") {
            //this.$refs.loginForm.validateField("checkPass");
          }
          callback();
        }
      }; */

      return {
        rules: {
          /* phone: [{ validator: validatePhone, trigger: 'blur'}],
          checkPass: [{  validator: validatePass, trigger: 'blur' }] */
        },
        loginForm: {
          phone: "",
          password: ""
        },
      };
    },
    computed: {
      isKong: function () {
        return this.loginForm.phone === "" || this.loginForm.password === "";
      }
    },
    methods: {
      submitClick: function () {
        var _this = this;
        this.postRequest("/user/login", {
          phone: this.loginForm.phone,
          password: this.loginForm.password
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data != "") {
            if (resp.data.id) {
              console.log(resp);
              _this.$store.commit('login', resp.data);
              _this.$store.commit('setCourseId', null);
              var path = _this.$route.query.redirect;
              var pathS = '/';
              if (_this.$store.state.user.userlevel == 0) pathS = "/stucourse";
              else if (_this.$store.state.user.userlevel == 1) pathS = "/tchcourse";
              _this.$router.replace({ path: path == '/Login' || path == undefined ? pathS : path });
            } else if (typeof(resp.data)=='string' ) {
              _this.$notify.error({
                title: '登陆失败',
                message: resp.data
              });
            }
          }
          else _this.$notify.error({
            title: '登陆失败',
            message: '请检查账号密码'
          });
        });
      }
    }
  };
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>