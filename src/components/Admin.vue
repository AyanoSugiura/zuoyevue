<template>
  <div>
    <!-- 密码对话框 -->
    <el-dialog title="密码" :visible.sync="dialogFormVisible" style="width: 25%;margin-left: 30%">
      <p>{{userPsw}}</p>
    </el-dialog>
    <!-- 管理 -->
    <el-row style="margin-left: 7%;margin-right: 7%;margin-top: 25px">

      <el-col :span="12">
        <el-card style="margin-bottom: 25px">
          <div slot="header" class="clearfix">
            <p class="setting-card-heading">待审核教师</p>
          </div>
          <el-table :data="tchNoVerifys" style="width: 100%;margin-bottom: 25px">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="教师姓名" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="intoVerify(scope.$index, 1 , 2)">通过</el-button>
                <!-- <el-button size="mini" @click="intoVerify(scope.$index, 1 , 0)">不通过</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" ref="noVPage" :total="tchNoVerify" :page-size="6" :current-page="nowPage" @current-change="NoVerifysPageChange">
          </el-pagination>
        </el-card>
        <!-- 用户管理 -->
        <el-card>
          <div slot="header" class="clearfix">
            <p class="setting-card-heading">用户管理</p>
          </div>
          <el-table :data="users.users" style="width: 100%;margin-bottom: 25px">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column prop="userlevel" label="等级" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="seePsw(scope.$index)">查看密码</el-button>
                <!-- <el-button size="mini" @click="intoVerify(scope.$index, 1 , 0)">不通过</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="users.page" :page-size="6" :current-page="userPage" @current-change="usersPageChange">
          </el-pagination>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card style="margin-left:45px;margin-bottom: 25px">
          <div slot="header" class="clearfix">
            <p class="setting-card-heading">用户信息</p>

          </div>
          <p v-if="$store.state.user.userlevel==1" style="margin-left:45px"> 用户身份：教师</p>
          <p v-else-if="$store.state.user.userlevel==0" style="margin-left:45px">用户身份：学生</p>
          <p v-else-if="$store.state.user.userlevel==3" style="margin-left:45px">用户身份：管理员</p>
          <br/>
          <el-form :model="mMsg" status-icon ref="mMsg" label-width="100px" style="margin-right: 100px">
            <el-form-item label="用户名">
              <el-input v-model="mMsg.name" auto-complete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="mMsg.phone" auto-complete="off" placeholder="电话号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="float: right;width: 100px;" size="small" type="success" @click="alterMsg">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-left:45px;">
          <div slot="header" class="clearfix">
            <p class="setting-card-heading">修改密码</p>
          </div>

          <el-form :model="xMsg" status-icon label-width="100px" style="margin-right: 100px">
            <el-form-item label="当前密码">
              <el-input v-model="xMsg.password" type="password" auto-complete="off" placeholder="当前密码"></el-input>
            </el-form-item>
            <el-form-item label="新的密码">
              <el-input v-model="xMsg.newpsw" type="password" auto-complete="off" placeholder="新的密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="xMsg.repsw" type="password" auto-complete="off" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="float: right;width: 100px;" size="small" type="success" @click="alterPsw" v-bind:disabled="pswV">修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        mMsg: {},
        xMsg: {
          password: "",
          newpsw: "",
          repsw: ""
        },
        nowPage: 1,
        tchisVerify: null,
        tchNoVerify: null,
        tchIsConfuse: null,
        tchisVerifys: [],
        tchNoVerifys: [],
        tchIsConfuses: [],

        users: [],
        userPage: 1,
        userPsw:'',
        dialogFormVisible: false,
      };
    },
    created: function () {
      var _this = this;
      this.postRequest("/user/usermsg", {
        id: this.$store.state.user.id,
      }).then(resp => {
        if (resp && resp.status == 200 && resp.data != "") {
          _this.mMsg = resp.data;
          console.log(resp.data);
        }
      });

      this.tchStatusVerifys(1, 0);

      this.postRequest("/admin/usersPage", {
        aid: this.$store.state.user.id,
        start: 0,
        page: 6
      }).then(resp => {
        if (resp && resp.status == 200 && resp.data != "") {
          _this.users = resp.data;
        }
      });
    },
    computed: {
      pswV: function () {
        return (
          this.xMsg.password.length < 3 ||
          this.xMsg.password.length > 20 ||
          this.xMsg.newpsw.length < 3 ||
          this.xMsg.newpsw.length > 20 ||
          this.xMsg.repsw.length < 3 ||
          this.xMsg.repsw.length > 20
        );
      }
    },
    methods: {
      alterMsg: function () {
        var _this = this;
        if (
          this.checkSpecialChar(this.mMsg.name) &&
          this.checkPhoneChar(this.mMsg.phone)
        ) {
          this.postRequest("/user/altermsg", {
            uid: this.$store.state.user.id,
            name: this.mMsg.name,
            phone: this.mMsg.phone
          }).then(resp => {
            if (resp && resp.status == 200 && resp.data != "") {
              _this.mMsg = resp.data;
              console.log(resp.data);
              _this.$store.commit("alterMsg", resp.data);
              this.$notify({
                title: "成功",
                message: "修改信息成功",
                type: "success",
                duration: 2000
              });
            } else
              _this.$notify.error({
                title: "修改失败",
                message: "请联系管理员"
              });
          });
        }
      },
      alterPsw: function () {
        var _this = this;
        if (this.checkpswChar(this.xMsg.newpsw, this.xMsg.repsw)) {
          this.postRequest("/user/alterpsw", {
            uid: this.$store.state.user.id,
            password: this.xMsg.password,
            newpsw: this.xMsg.newpsw
          }).then(resp => {
            if (resp && resp.status == 200) {
              if (resp.data == "密码更改成功") {
                this.$notify({
                  title: "成功",
                  message: "修改信息成功",
                  type: "success",
                  duration: 2000
                });
                _this.$store.commit("logout");
                _this.$router.replace({ path: "/Login" });
              } else if (resp.data == "当前密码错误") {
                this.$notify.error({
                  title: "当前密码错误",
                  message: "在修改成新的密码前必须当前的密码必须验证通过"
                });
              } else if (resp.data == "密码更改失败") {
                this.$notify.error({
                  title: "密码更改失败",
                  message: "请联系管理员"
                });
              }
            } else
              _this.$notify.error({
                title: "修改失败",
                message: "请联系管理员"
              });
          });
        }
      },
      intoVerify: function (index, rootr, choose) {
        var _this = this;
        var _tid = rootr == 2 ? this.tchisVerifys[index].id : (rootr == 1 ? this.tchNoVerifys[index].id : this.tchIsConfuses[index].id);
        this.postRequest("/admin/verifyTeacher", {
          aid: this.$store.state.user.id,
          start: (this.nowPage - 1) * 6,
          page: 6,
          tid: _tid,
          rootVerify: rootr,
          toVerify: choose
        }).then(resp => {
          if (resp && resp.status == 200) {
            if (rootr == 1) {
              if ((resp.data.users == "" || resp.data.users == null) && _this.tchNoVerify != 1) {
                _this.tchStatusVerifys(1, (_this.nowPage - 2) * 6)
                _this.nowPage = Math.ceil(_this.tchNoVerify / 6);
              } else { _this.tchNoVerifys = resp.data.users; _this.tchNoVerify = resp.data.page }
            } else if (rootr == 0) {
              if (resp.data == "" || resp.data == null) {
                _this.tchStatusVerifys(0, (_this.nowPage - 2) * 6)
              } else _this.tchIsConfuses = resp.data;
            } else {
              if (resp.data == "" || resp.data == null) {
                _this.tchStatusVerifys(2, (_this.nowPage - 2) * 6)
              } else _this.tchisVerifys = resp.data;
            }
            this.$notify({
              title: '成功',
              message: '审核该教师用户成功',
              type: 'success',
              duration: 2000
            });
          }
        });

      },

      NoVerifysPageChange: function (e) {
        console.log(e);
        this.nowPage = e;
        var _this = this;
        _this.postRequest("/admin/tchNoVerifysPage", {
          aid: _this.$store.state.user.id,
          verify: 1,
          start: (e - 1) * 6,
          page: 6
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data != "") {
            _this.tchNoVerifys = resp.data.users; _this.tchNoVerify = resp.data.page
          }
        });
      },
      seePsw: function (index) {
        var _this = this;
        this.postRequest("/admin/seePsw", {
          aid: this.$store.state.user.id,
          uid: this.users.users[index].id,
        }).then(resp => {
          if (resp && resp.status == 200) {
            _this.userPsw = resp.data;
            _this.dialogFormVisible = true;
          }
        });
      },
      usersPageChange: function (e) {
        this.userPage = e;
        var _this = this;

        this.postRequest("/admin/usersPage", {
          aid: this.$store.state.user.id,
          start: (e - 1) * 6,
          page: 6
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data != "") {
            _this.users = resp.data;
          }
        });

      },

      tchStatusVerifys: function (vrf, start) {
        var _this = this;
        _this.postRequest("/admin/tchNoVerifysPage", {
          aid: _this.$store.state.user.id,
          verify: vrf,
          start: start,
          page: 6
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data != "") {
            if (vrf == 0) { _this.tchIsConfuse = resp.data.page; _this.tchIsConfuses = resp.data.users; }
            if (vrf == 1) { _this.tchNoVerify = resp.data.page; _this.tchNoVerifys = resp.data.users; }
            if (vrf == 2) { _this.tchisVerifys = resp.data.users; }
          }
        });

      },

      checkSpecialChar: function (str) {
        var re = /[~#^$@%&!*()<>:;'"{}【】  ]/gi;
        if (re.test(str)) {
          this.$notify.error({
            title: "用户名非法",
            message: "用户名不能包含空格等特殊字符"
          });
          return false;
        }
        return true;
      },
      checkPhoneChar: function (str) {
        var dr = /\d{3,11}/g;
        if (!dr.test(str)) {
          this.$notify.error({
            title: "电话号非法",
            message: "电话号必须输入合法"
          });
          return false;
        }
        return true;
      },
      checkpswChar: function (psw, newPsw) {
        if (psw != newPsw) {
          this.$notify.error({
            title: "新密码和确认密码不同",
            message: "请检查,并重新输入"
          });
          return false;
        }
        return true;
      }
    }
  };
</script>
<style>
  .setting-card-heading {
    display: block;
    font-size: 20px;
    line-height: 28px;
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .form-control {
    background-color: transparent;
    background-image: none;
    border: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 0;
    color: inherit;
    display: block;
    font-size: 14px;
    height: 36px;
    line-height: 20px;
    padding: 8px 0 7px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  p {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    margin: 12px 0;
  }
</style>