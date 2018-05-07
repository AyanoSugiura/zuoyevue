<template>
    <!-- <el-container> -->
    <!-- <el-header style="text-align: center;display: flex; align-items: center; justify-content: space-between;
        box-sizing: content-box;
        padding: 0px;"> -->
    <div>
        <el-menu mode="horizontal" unique-opened router default-active="/coursedetails/zuoye" style="text-align: center; display: flex;  align-items: center;">
            <el-menu-item index="/coursedetails/zuoye">作业</el-menu-item>
            <el-menu-item index="/coursedetails/member">成员</el-menu-item>
            <el-menu-item index="3">统计</el-menu-item>
        </el-menu>
        <el-main>
            <router-view></router-view>
        </el-main>
    </div>

    <!-- </el-header> -->

    <!-- </el-container> -->
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        created: function () {
            if (this.$route.query.courseId != null || (typeof (this.$route.query.courseId) === 'undefined') == false) {
                this.$store.commit('setCourseId', this.$route.query.courseId);
            }
            this.$router.replace({path:'/coursedetails/zuoye'});
        }
    }
</script>