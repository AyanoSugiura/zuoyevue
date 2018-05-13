<template>
    <div>
        <!-- 修改课程名 -->
        <el-row>
            <el-col :span="12">
                <el-card style="width: 98%">
                    <div slot="header" class="clearfix">
                        <p class="setting-card-heading">课程细节设置</p>

                    </div>
                    <p>当前课程名称：{{' '+settingCourseName}}</p>
                    <p style="float: left;">是否批改评分设置 "阅"：{{' '}}</p>
                    <el-switch v-model="yueOpen" style="margin-top: 12px" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
                    </el-switch>
                    <br/>
                    <p v-if="yueOpen==true">"阅"对应分数：{{' '}}</p>

                    <br/>
                    <div v-for="(sl,index) in scroels" :key="index">
                        <p>{{sl}}}对应百分制</p>
                    </div>
                    <!-- <div>
                        <el-form :model="settingCourse" status-icon :rules="settingCourseNameRules" style="width: 100%;">
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item prop="name" style="margin-right:15px ;">
                                        <el-input v-model="settingCourse.name" placeholder="请输入课程名称" type="text" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-button type="text" @click.native.prevent="alterCourseName" :disabled="isKong" style="color: black;">
                                            <i class="el-icon-check">提交修改</i>
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div> -->
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card style="width: 85%;margin-left: 20px">
                    <div slot="header" class="clearfix">
                        <p class="setting-card-heading">修改课程名称</p>

                    </div>
                    <p>当前课程名称：{{' '+settingCourseName}}</p>
                    <br/>
                    <div>
                        <el-form :model="settingCourse" status-icon :rules="settingCourseNameRules" style="width: 100%;">
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item prop="name" style="margin-right:15px ;">
                                        <el-input v-model="settingCourse.name" placeholder="请输入课程名称" type="text" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-button type="text" @click.native.prevent="alterCourseName" :disabled="isKong" style="color: black;">
                                            <i class="el-icon-check">提交修改</i>
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        data() {
            var validateName = (rule, value, callback) => {
                var _this = this;
                this.postRequest("/course/jcnnamebt", {
                    name: _this.settingCourse.name,
                    tid: this.$store.state.user.id
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        console.log(resp.data);
                        if (
                            resp.data == "该课程名已存在" &&
                            _this.settingCourse.name != _this.settingCourseName
                        ) {
                            _this.nocanB = true;
                            callback(new Error("该课程名已存在"));
                        } else {
                            _this.nocanB = false;
                            callback();
                        }
                    } else callback();
                });
            };
            return {
                yueOpen: true,
                scroels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E'],
                settingCourse: {},
                nocanB: true,
                settingCourseName: "",
                settingCourseNameRules: {
                    name: [{ validator: validateName, trigger: "change" }]
                }
            };
        },
        created: function () {
            var _this = this;
            console.log(this.$store.state.courseId);
            this.postRequest("/course/findcourse", {
                cid: this.$store.state.courseId
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.settingCourse = resp.data;
                    _this.settingCourseName = _this.settingCourse.name;
                    console.log(_this.settingCourse);
                }
            });
        },
        computed: {
            isKong: function () {
                return (
                    this.settingCourse.name === "" ||
                    this.nocanB ||
                    this.settingCourse.name == this.settingCourseName
                );
            }
        },
        methods: {
            alterCourseName: function () {
                var _this = this;
                console.log(this.$store.state.courseId);
                this.postRequest("/course/altername", {
                    cid: this.$store.state.courseId,
                    name: this.settingCourse.name
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        _this.settingCourse = resp.data;
                        _this.settingCourseName = _this.settingCourse.name;
                        console.log(_this.settingCourse);
                    }
                });
            }
        }
    };
</script>
<style>
    .setting-card-heading {
        display: block;
        font-size: 20px;
        line-height: 28px;
        margin-top: 24px;
        margin-bottom: 24px;
    }

    .form-control {
        background-color: transparent;
        background-image: none;
        border: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 0;
        color: inherit;
        display: block;
        font-size: 14px;
        height: 36px;
        line-height: 20px;
        padding: 8px 0 7px;
        width: 100%;
        position: relative;
        z-index: 1;
    }

    p {
        display: block;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        margin: 12px 0;
    }
</style>