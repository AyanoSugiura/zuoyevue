<template lang="html">
  <el-container class="home-container">
    <el-header class="home-header">
      <span class="home_title">微作业</span>
      <div style="display: flex;align-items: center;margin-right: 7px">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
            {{this.$store.state.user.name}}
            <i>
              <img :src="'http://static.hdslb.com/images/akari.jpg'" style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"
              />
            </i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="180px" class="home-aside">
        <div v-if="ulevel==0" style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
          <stum/>
        </div>
        <div v-else-if="ulevel==1" style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
          <tchm/>
        </div>
      </el-aside>
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        ulevel: this.$store.state.user.userlevel,
        isDot: false
      }
    },
    computed: {
      courseIs: function () {
        if (this.ulevel == 0) { return "/stucourse"; }
        else if (this.ulevel == 1) { return "/tchcourse"; }
        else return null;
      },
      zuoyeIs: function () {
        if (this.ulevel == 0) { return "/stuzuoye"; }
        else if (this.ulevel == 1) { return "/tchzuoye"; }
        else return null;
      }
    },
    methods: {
      handleCommand(cmd) {
        var _this = this;
        if (cmd == 'logout') {
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$store.commit('logout');
            _this.$router.replace({ path: '/Login' });
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }
      }
    }
  }
</script>

<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -ms-flex-negative: 0;
    flex-shrink: 0
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: left;
    margin: 20px;
    padding: 0px;
    ;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>