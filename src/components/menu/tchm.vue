<template>
  <el-menu style="width: 180px;background-color: #ECECEC;" unique-opened router>
    <el-menu-item class="el-submenu" index="/tchcourse"><i class="el-icon-date" style="color: #2196f3;"></i><span>我的课程</span></el-menu-item>
    <el-menu-item index="/tchnewzy"><i class="el-icon-document" style="color:#ff5722"></i><span>最新作业</span> </el-menu-item>
    <el-menu-item index="/selfm"><i class="el-icon-setting" style="color: #795548;"></i><span>个人中心</span> </el-menu-item>
  </el-menu>
</template>

<script>
  export default {

  }
</script>

<style>
  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
    background-color: #ECECEC;
  }
</style>