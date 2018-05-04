<template>
    <el-container style="text-align: left; margin: 10px">
        <!-- <el-form :inline="true" :model="course" status-icon style="text-align: left; margin: 10px">
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
        </el-form> -->

        <el-header style=" display: flex;height: 38px;">
            <el-button class="ktcon1l fl" type="text" @click="dialogFormVisible = true">
                <i class="el-icon-plus">加入课程</i>
            </el-button>
        </el-header>
        <el-dialog title="加入课程" :visible.sync="dialogFormVisible" style="width: 850px">
            <el-form :inline="true" :model="course" status-icon :rules="rules">
                <el-form-item label="课程号" prop="name">
                    <el-input v-model="course.id" placeholder="请输入课程号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native.prevent="xuanke" v-bind:disabled="isKong">申请加入</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-main>

            <el-card v-for="course in stuCourses" :key="course.id" style="width: 200px; height: 200px; margin: 10px; float:left" :body-style="{ padding: '0px' }">
                <span style="font-family:'Microsoft YaHei';font-size:18px;color: white">
                    <div style="position: relative; width: 170px; height: 89px;">
                        <img :src="'http://assets.ketangpai.com/theme/min/'+  (course.id<10?( '0' +course.id):course.id) +'.jpg'" style="width:200px;height:100px">
                        <span style="position: absolute;top:15px;left: 15px; ">
                            <router-link style="color:white;text-decoration:none" :to="{ name: 'CourseDetails', query: { courseId: course.id }}">{{course.name}}</router-link>
                        </span>
                    </div>
                </span>

                <div style="padding: 14px;">
                    <span>课程号:{{course.id}}</span>
                    <div class="bottom clearfix">
                        <time class="time"></time>
                        <el-button type="text" class="button">操作按钮</el-button>
                    </div>
                </div>
            </el-card>

        </el-main>


    </el-container>

</template>

<script>
    export default {
        data() {

            var validateName = (rule, value, callback) => {
                var _this = this;
                if (this.course.id === "") return;
                this.postRequest("/xk/stuisc", {
                    cid: _this.course.id,
                    sid: this.$store.state.user.id
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        console.log(resp.data);
                        if (resp.data == "你已经选了该门课") {
                            _this.nocanB = true;
                            callback(new Error("你已经选了该门课"));
                        }
                        else if (resp.data == "课号错误,请检查") {
                            _this.nocanB = true;
                            callback(new Error("课号错误,请检查"));
                        }

                        else {
                            _this.nocanB = false
                            callback();
                        };
                    }
                    else callback();
                })
            };

            return {
                course: {
                    id: null,
                    phone: '',
                    name: ''
                },
                nocanB: true,
                dialogFormVisible: false,
                stuCourses: [],
                tchCourses: [],
                rules: {
                    name: [{ validator: validateName, trigger: "change" }],

                },
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
                return this.course.id == "" || this.nocanB;
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
                    cid: this.course.id
                    // cid: this.tchCourses[index].id
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
                this.course.id = "";
                this.dialogFormVisible = false;
            }
        }
    }
</script>