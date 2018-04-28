<template>
    <el-container style="text-align: left; margin: 10px">
        <el-form :inline="true" :model="course" status-icon style="text-align: left; margin: 10px">
            <el-form-item label="查询教师课程" prop="phone">
                <el-input v-model="course.phone" placeholder="请输入教师电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native.prevent="submitClick" v-bind:disabled="isKong">查询教师课程</el-button>
            </el-form-item>
            <el-table :data="tchCourses" style="width: 100%">
                <el-table-column prop="name" label="教师课程名称" width="180"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="xuanke(scope.$index)">选课</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <br/>
            <el-table :data="stuCourses" style="width: 100%">
                <el-table-column prop="name" label="已选课程名称" width="180"> </el-table-column>
            </el-table>
        </el-form>



    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                course: {
                    id: this.$store.state.user.id,
                    phone: '',
                    name: ''
                },
                stuCourses: [],
                tchCourses: []
            }
        },
        created: function () {
            var _this = this;
            console.log(this.$store.state.user.id);
            this.postRequest("/xk/stucourses", {
                sid: this.$store.state.user.id
            }).then(resp => {
                if (resp && resp.status == 200) {
                    console.log(resp.data);
                    _this.stuCourses = resp.data;
                }
            });
        },
        computed: {
            isKong: function () {
                return this.course.phone === "";
            }
        },
        methods: {
            submitClick() {
                var _this = this;
                this.postRequest("/course/tchcoursesbp", {
                    phone: this.course.phone,
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (resp.data != "") {
                            console.log(resp.data);
                            _this.tchCourses = resp.data;
                        }
                        else _this.$notify({
                            title: '查找不到课程信息',
                            message: '请重新输入'
                        });
                    }
                    else _this.$notify.error({
                        title: '查询错误',
                        message: '请联系管理员'
                    });
                });
            },
            xuanke(index) {
                var _this = this;
                console.log(index);
                this.postRequest("/xk/apply", {
                    sid: this.$store.state.user.id,
                    cid: this.tchCourses[index].id
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (resp.data == "你已经选了该门课") {
                            _this.$notify.error({
                                title: '选课失败',
                                message: '你已经选了该门课'
                            });
                        }
                        else if (resp.data == "申请成功待审核") {
                            _this.$notify({
                                title: '申请选课成功',
                                message: '申请选课成功等待您的老师审核审核'
                            });
                            var _this2 = _this;
                            this.postRequest("/xk/stucourses", {
                                sid: _this.$store.state.user.id
                            }).then(resp => {
                                if (resp && resp.status == 200) {
                                    console.log(resp.data);
                                    _this2.stuCourses = resp.data;
                                }
                            });
                        }
                        else _this.$notify.error({
                            title: '申请选课失败',
                            message: '请联系管理员'
                        });
                    }
                    else _this.$notify.error({
                        title: '申请选课失败',
                        message: '请联系管理员'
                    });
                });
            }
        }
    }
</script>