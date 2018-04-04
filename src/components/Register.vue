<template>
  <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" class="login-container" label-position="left"
           label-width="0px" >
    <h3 class="login_title">系统注册</h3>
    <el-select v-model="value" default-first-option=true>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-form-item prop="name">
      <el-input type="text" v-model="registerForm.name" auto-complete="off" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input type="text" v-model="registerForm.phone" auto-complete="off" placeholder="电话"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%" v-bind:disabled="isKong" >注册</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"));
      } else {
        if (this.registerForm.phone !== "") {
          //this.$refs.registerForm.validateField("phone");
        }
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.registerForm.checkPass !== "") {
          //this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      options: [
        {
          value: 1,
          label: "学生"
        },
        {
          value: 2,
          label: "教师"
        }
      ],
      value: "学生",
      rules: {
        phone: [{ validator: validatePhone, trigger: "blur" }],
        checkPass: [{ validator: validatePass, trigger: "blur" }]
      },
      registerForm: {
        name:"",
        phone: "",
        password: ""
      }
    };
  },
  computed: {
    isKong: function() {
      return this.registerForm.phone === "" || this.registerForm.password === "";
    }
  },
  methods: {
    submitClick: function() {
      var _this = this;
      this.postRequest("/register", {
        phone: this.registerForm.phone,
        password: this.registerForm.password
      }).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$store.commit("register", data.msg);
          var path = _this.$route.query.redirect;
          _this.$router.replace({
            path: path == "/" || path == undefined ? "/home" : path
          });
        }
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