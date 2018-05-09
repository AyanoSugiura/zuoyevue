<template>
  <el-menu style="width: 180px;background-color: #ECECEC;" unique-opened router>
    <el-menu-item class="el-submenu" index="/tchcourse">我的课程</el-menu-item>
    <el-menu-item index="/tchnewzy">最新作业 </el-menu-item>
    <el-menu-item index="/tchcreatezy">发布作业 </el-menu-item>
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