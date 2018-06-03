<template>
    <!-- default-active="/coursedetails/zuoye" -->
   
    <div>
        <el-menu mode="horizontal" unique-opened router :default-active="defaultAct"  style="text-align: center; display: flex;  align-items: center;">
            <el-menu-item index="/coursedetails/zuoye" style="margin-left: 67px">作业</el-menu-item>
            <el-menu-item index="/coursedetails/member">成员</el-menu-item>
            <el-menu-item index="/coursedetails/tchstatistic">统计</el-menu-item>
            <el-menu-item v-if="this.$store.state.user.userlevel" index="/coursedetails/setting">设置</el-menu-item>
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
                defaultAct:''
            }
        },
        created: function () {
            if (this.$route.query.courseId != null || (typeof (this.$route.query.courseId) === 'undefined') == false) {
                this.$store.commit('setCourseId', this.$route.query.courseId);
            }
            if(this.$route.name=='CourseDetails'){
                this.defaultAct='/coursedetails/zuoye';
                this.$router.replace({path:'/coursedetails/zuoye'});
            }else{
                this.defaultAct=this.$route.path;
            }
            //this.$router.replace({path:'/coursedetails/zuoye'});
        }
    }
</script>