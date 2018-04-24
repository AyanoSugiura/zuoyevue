<template>
  <el-menu style="background: #ececec;width: 180px;" unique-opened router>
    <el-menu-item class="el-menu-item"  index="/stucourse">课程</el-menu-item>
    <el-menu-item class="el-menu-item"  index="/stuzuoye">最新作业 </el-menu-item>
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
    
  }
</style>