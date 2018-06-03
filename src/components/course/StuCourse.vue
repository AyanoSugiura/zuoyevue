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

            <el-card v-for="stuCourse in stuCourses" :key="stuCourse.id" style="width: 206px; height: 206px; margin: 10px; float:left"
                :body-style="{ padding: '0px' }">
                <span style="font-family:'Microsoft YaHei';font-size:18px;color: white">
                    <div style="position: relative; width: 170px; height: 89px;">
                        <img :src="'http://assets.ketangpai.com/theme/min/'+  (stuCourse.course.id<10?( '0' +stuCourse.course.id): (stuCourse.course.id%31) ) +'.jpg'"
                            style="width:206px;height:103px">
                        <span style="position: absolute;top:15px;left: 15px; ">
                            <router-link v-if="stuCourse.verify==2" style="color:white;text-decoration:none" :to="{ name: 'CourseDetails', query: { courseId: stuCourse.course.id }}">{{stuCourse.course.name}}</router-link>
                            <span v-if="stuCourse.verify==1" style="color:white">{{stuCourse.course.name}}</span>
                        </span>
                    </div>
                </span>

                <div style="padding-top: 20px;padding-left: 14px;padding-right: 14px;margin-bottom: 13px; white-space:pre;">
                    <span>课程号:{{stuCourse.course.id+' '}}</span>
                    <span v-if="stuCourse.verify==1" style="color:red;">待审核</span>
                </div>
                <div style="margin-bottom: 6px" v-if="stuCourse.verify==2">
                    <span class="recent_work">近期作业</span>
                </div>
                <div v-if="stuCourse.course.recentTriTaskId!=null&&stuCourse.verify==2">
                    <span class="recent_work2" :title="stuCourse.course.recentTriTaskTitle.length>9?stuCourse.course.recentTriTaskTitle.substring(0,9)+'...':stuCourse.course.recentTriTaskTitle">
                        <router-link style="text-decoration:none" v-if="$store.state.user.userlevel==0" :to="{ name: 'SZyDetails', query: { taskId: stuCourse.course.recentTriTaskId }}">
                            {{stuCourse.course.recentTriTaskTitle.length>7?stuCourse.course.recentTriTaskTitle.substring(0,7)+'...':stuCourse.course.recentTriTaskTitle}}
                        </router-link>
                    </span>
                </div>
                <div v-else>
                    <br/>
                </div>

                <div style="padding-right:5px ;margin-bottom:5px " v-if="stuCourse.verify==2">
                    <span class="cardmbr hy">成员{{stuCourse.course.stuNum}}</span>
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
<style>
  .ktcon {
    padding-left: 40px;
    height: 100%;
    overflow: hidden;
    background: #ececec;
    padding-top: 93px;
  }

  .ktcon1l {
    cursor: pointer;
    padding-left: 23px;
    height: 16px;
    line-height: 16px;
    color: #272636;
    font-size: 16px;
  }

  .fl {
    float: left;
  }

  .ktcon1 {
    height: 16px;
    padding-bottom: 25px;
    padding-right: 40px;
    position: relative;
    z-index: 1;
  }

  .cl {
    clear: both;
  }

  .hide {
    display: none;
  }

  .clearfix {
    zoom: 1;
  }

  .cardmbr.hy {
    cursor: pointer;
    display: block;
    line-height: 20px;
    font-size: 12px;
    float: right;
    padding-left: 24px;
    height: 20px;
    color: #818181;
    background: url(http://www.ketangpai.com/Public/Common/img/ren.png) 0 1px no-repeat;
  }

  .recent_work {
    padding: 14px;
    font-size: 14px;
    font-family: 微软雅黑;
    color: #ababab;
  }
  .recent_work2 {
    padding: 14px;
    font-size: 13px;
    font-family: 微软雅黑;
    color: black;
  }
</style>