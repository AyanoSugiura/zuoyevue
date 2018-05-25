<template>
  <el-menu style=" width: 180px; background-color: #ECECEC;" unique-opened router default-active="/stucourse">
    <el-menu-item class="el-menu-item" index="/stucourse">我的课程</el-menu-item>
    <el-menu-item class="el-menu-item" index="/stuzuoye">最新作业 </el-menu-item>
    <el-menu-item class="el-menu-item" index="/stucj">成绩查询 </el-menu-item>
    <el-menu-item index="/selfm">个人中心 </el-menu-item>
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