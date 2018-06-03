<template>
    <div>
        <div>
            <el-table :data="studentWorks"  style=" margin-left: 10%;margin-right: 8%; width: 75%;; margin-top:20px ">
                <el-table-column prop="tassk.course.name" label="课程名字">
                </el-table-column>
                <el-table-column prop="tassk.title" label="作业名">
                </el-table-column>
                <el-table-column prop="score" label="成绩">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                studentWorks: [],
            }
        },
        created: function () {
            var _this = this;
            if (this.$store.state.user.userlevel == 0) {
                this.postRequest("/szy/chengji", {
                    sid: this.$store.state.user.id,
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        _this.studentWorks = resp.data;
                        console.log("成绩");
                        console.log(resp.data);
                    }
                });
            }
        },
        methods: {
            btType: function (type) {
                if (type == "未提交") return "warning";
                else if (type == "已批改") return "success";
                else if (type == "未批改") return "info";
            },
            switchs: function (type, task) {
                console.log(task.title);
                this.$router.push({ name: 'SZyDetails', query: { taskId: task.id } });
            },
        }
    }
</script>