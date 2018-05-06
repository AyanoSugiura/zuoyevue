<template>
    <el-card style=" margin-right: 150px;margin-left :80px; margin-bottom:15px ">
        <div slot="header" class="clearfix" style=" white-space:pre;">
            <span>{{course.name+' 教师：'+course.teacher.name+' 学生：'+studentCourses.length+'人'}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div>
            <el-table :data="studentCourses" style="width: 100%">
                <el-table-column prop="student.name" label="学生姓名">
                </el-table-column>
                <el-table-column prop="student.phone" label="电话" >
                </el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                course: {
                    teacher: {},
                },
                studentCourses: []
            }
        },
        created: function () {
            var _this = this;
            this.postRequest("/xk/member", {
                cid: this.$store.state.courseId,
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.studentCourses = resp.data;
                    console.log("课程成员");
                    console.log(_this.studentCourses);
                }
            });
            this.postRequest("/course/findcourse", {
                cid: this.$store.state.courseId,
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.course = resp.data;
                    console.log("课程信息");
                    console.log(_this.course);
                }
            });
        }
    }
</script>

<style>
</style>