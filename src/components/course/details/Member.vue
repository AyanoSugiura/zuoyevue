<template>
    <div>
        <el-card class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>{{course.name+' 教师：'+course.teacher.name+' 学生：'+xkIsVerify.length+'人'}}</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div>
                <el-table :data="xkIsVerify" style="width: 100%">
                    <el-table-column prop="student.name" label="学生姓名">
                    </el-table-column>
                    <el-table-column prop="student.phone" label="电话">
                    </el-table-column>
                </el-table>
                <br/>
            </div>
        </el-card>
        <br/>
        <el-card class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>加入待审核</span>
                <el-button style="float: right; padding: 3px 0" type="text">全部通过</el-button>
            </div>
            <el-table :data="xkNoVerify" style="width: 100%">
                <el-table-column prop="student.name" label="学生姓名">
                </el-table-column>
                <el-table-column prop="student.phone" label="电话">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="intoVerify(scope.$index, 1 , 2)">通过</el-button>
                        <el-button size="mini" @click="intoVerify(scope.$index, 1 , 0)">不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
        <br/>
        <el-card class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>审核未通过</span>
                <el-button style="float: right; padding: 3px 0" type="text">全部通过</el-button>
            </div>
            <el-table :data="xkIsConfuse" style="width: 100%">
                <el-table-column prop="student.name" label="学生姓名">
                </el-table-column>
                <el-table-column prop="student.phone" label="电话">
                </el-table-column>
            </el-table>
        </el-card>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                course: {
                    teacher: {},
                },
                xkNoVerify: [],
                xkIsVerify: [],
                xkIsConfuse: []
            }
        },
        created: function () {
            var _this = this;
            this.memberTypesSele(1);
            this.memberTypesSele(0);
            this.memberTypesSele(2);
            this.postRequest("/course/findcourse", {
                cid: this.$store.state.courseId,
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.course = resp.data;
                    console.log("课程信息");
                    console.log(_this.course);
                }
            });
        },
        methods: {
            intoVerify: function (index, rootr, choose) {
                console.log("通过");
                var _this = this;
                var _sid = rootr == 2 ? this.xkIsVerify[index].student.id : (rootr == 1 ? this.xkNoVerify[index].student.id : this.xkNoVerify[index].student.id);
                console.log(_sid);
                this.postRequest("/xk/verify", {
                    sid: _sid,
                    cid: this.$store.state.courseId,
                    rootVerify: rootr,
                    toVerify: choose
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (rootr == 1) {
                            _this.xkNoVerify = resp.data;
                            this.memberTypesSele(0);
                            this.memberTypesSele(2);
                        } else if (rootr == 0) {
                            _this.xkIsConfuse = resp.data;
                            this.memberTypesSele(1);
                            this.memberTypesSele(2);
                        } else {
                            _this.xkIsVerify = resp.data;
                            this.memberTypesSele(0);
                            this.memberTypesSele(1);
                        }
                    }
                });
            },

            memberTypesSele: function (vrf) {
                var _this = this;
                this.postRequest("/xk/member", {
                    cid: this.$store.state.courseId,
                    verify: vrf
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (vrf == 0) _this.xkIsConfuse = resp.data;
                        if (vrf == 1) _this.xkNoVerify = resp.data;
                        if (vrf == 2) _this.xkIsVerify = resp.data;
                    }
                });
            },
        }
    }
</script>

<style>
    .member-el-card {
        margin-right: 130px;
        margin-left: 70px;
        margin-bottom: 15px
    }
</style>