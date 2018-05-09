<template>
    <div>
        <div>
            <el-table :data="tchStatistics" style="width: 100%">
                <el-table-column prop="student.id" label="学号">
                </el-table-column>
                <el-table-column prop="student.name" label="名字">
                </el-table-column>

                <el-table-column v-for="(scrs,index) in tchStatistics[0].score" :key="index" :label="index+1+''">

                    <template slot-scope="scope">
                        <p>{{scope.row.score[index].score}}</p>
                        <p></p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tchStatistics: [{ score: [{ score: null }] }],
            }
        },
        created: function () {
            var _this = this;
            console.log(this.$store.state.courseId);
            //if (this.$store.state.user.userlevel == 0) {
            this.postRequest("/task/tchstatistic", {
                cid: this.$store.state.courseId,
            }).then(resp => {
                if (resp && resp.status == 200 && resp.data != '') {
                    _this.tchStatistics = resp.data;
                    console.log("统计");
                    console.log(resp.data);
                }
            });
            //}
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