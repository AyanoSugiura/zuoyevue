<template>
  <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" class="login-container" label-position="left"
           label-width="0px" >
    <h3 class="login_title">系统注册</h3>
    <el-select v-model="value">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-form-item >
      <el-input type="text" v-model="registerForm.name" auto-complete="off" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input type="text" v-model="registerForm.phone" auto-complete="off" placeholder="电话"></el-input>
    </el-form-item>
    <el-form-item >
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%" v-bind:disabled="isKong" >注册</el-button>
    </el-form-item>
    <router-link to="/" >已有账号？点击此处登陆</router-link>
  </el-form>
</template>
<script>
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
        this.postRequest("/user/jcphone", {
        phone: this.registerForm.phone,
      }).then(resp => {
        if (resp && resp.status == 200) {
          if(resp.data=="该号码已注册"){
              this.nocanB=true;
              callback(new Error("号码已被注册"));
           }
           else {
             this.nocanB=false
             callback()
             };
        }
         else callback();
      })
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
      nocanB:true,
      rules: {
        phone: [{ validator: validatePhone, trigger: "change" }],

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
      return this.registerForm.phone === "" || this.registerForm.password === ""||this.registerForm.name===""||this.nocanB;
    }
  },
  methods: {
    submitClick: function() {
      var _this = this;
      var userlevel=0;
      var verify=2;
      console.log(this.value)
      if(this.value=="2"){
        userlevel=1;
        verify=1;
      }
      this.postRequest("/user/register", {
        name: this.registerForm.name,
        phone: this.registerForm.phone,
        password: this.registerForm.password,
        userlevel:userlevel,
        verify:verify
      }).then(resp => {
        if (resp && resp.status == 200 && resp.data=="注册成功") {
          if(_this.value=="2"){
            this.$notify({
            title: '注册成功',
            message: '不过教师用户需要联系管理员并且通过审核后才能登陆',
            type: 'success',
            duration: 2000
            });
          }
          else{
            this.$notify({
            title: '注册成功',
            message: '赶快登陆吧',
            type: 'success',
            duration: 2000
            });
          }
        }
        else   this.$notify.error({
          title: '注册失败',
          message: '请联系管理员'
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