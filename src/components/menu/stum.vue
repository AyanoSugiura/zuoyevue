<template>
  <el-menu style=" width: 180px; background-color: #ECECEC;" unique-opened router default-active="/stucourse">
    <el-menu-item class="el-menu-item" index="/stucourse"><i class="el-icon-date" style="color: #2196f3;"></i><span>我的课程</span></el-menu-item>
    <el-menu-item class="el-menu-item" index="/stuzuoye"><i class="el-icon-document" style="color:#ff5722"></i><span>最新作业</span> </el-menu-item>
    <el-menu-item class="el-menu-item" index="/stucj"><i class="el-icon-view" style="color: #4caf50;"></i><span>成绩查询</span></el-menu-item>
    <el-menu-item index="/selfm"><i class="el-icon-setting" style="color: #795548;"></i><span>个人中心</span> </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    data() {
      return {
        courses: [],
        zuoyes: []
      }
    }
  }
</script>



<style>
  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
    background-color: #ECECEC;
  }
</style>