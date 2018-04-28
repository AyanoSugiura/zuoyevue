<template>
    <!-- <el-container> -->
    <!-- <el-header style="text-align: center;display: flex; align-items: center; justify-content: space-between;
        box-sizing: content-box;
        padding: 0px;"> -->
    <div>
        <el-menu mode="horizontal" unique-opened router style="text-align: center; display: flex;  align-items: center;">
            <el-menu-item index="/coursedetails/zuoye?courseId=1">作业</el-menu-item>
            <el-menu-item index="2">成员</el-menu-item>
            <el-menu-item index="3">消息中心</el-menu-item>
        </el-menu>
        <el-main >
            <router-view></router-view>
        </el-main> 
    </div>
    <!-- </el-header> -->

    <!-- </el-container> -->
</template>

<script>
    export default {
        data(){
            
        }
    }
</script>