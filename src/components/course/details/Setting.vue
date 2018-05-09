<template>
    <div>
        <el-table :data="tchStatistics" style="width: 100%">
            <el-table-column label="申请选课未审核的学生"></el-table-column>
            <el-table-column prop="xkNoVerifys.student.id" label="学号"> </el-table-column>
            <el-table-column prop="student.student.name" label="名字"></el-table-column>
            <el-table-column prop="student.student.phone" label="电话"></el-table-column>

            <el-table-column label="审核">

                <template slot-scope="scope">
                    <el-button size="mini" @click="VerifyOk(scope.$index)">通过</el-button>
                    <el-button size="mini" @click="VerifyNo(scope.$index)">不通过</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                xkNoVerifys: []
            }
        },
        created: function () {
            var _this = this;
            console.log(this.$store.state.courseId);
            this.postRequest("/xk/xkv", {
                cid: this.$store.state.courseId,
                verify: 1
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.xkNoVerifys = resp.data;
                    console.log("申请未审核");
                    console.log(_this.xkNoVerifys);
                }
            });
        },
        mounted : {
            
        }
    }
</script>