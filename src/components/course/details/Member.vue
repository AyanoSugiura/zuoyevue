<template>
    <div>
        <el-dialog title="密码" :visible.sync="dialogFormVisible" style="width: 25%;margin-left: 30%">
            <p>{{stuPsw}}</p>
        </el-dialog>

        <el-card class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>{{course.name+' 教师：'+course.teacher.name+' 学生：'+xkIsVerify.page+'人'}}</span>
                <el-upload v-if="$store.state.user.userlevel==1" class='ensure ensureButt' style="float: right;padding: 3px 0" :limit="1"
                    :show-file-list="false" :action="importFileUrl" :data="ccid" :onError="uploadError" :onSuccess="uploadSuccess"
                    :on-change="onChanges" :before-remove="bRemove" :beforeUpload="beforeAvatarUpload">
                    <el-button style="float: right; padding: 3px 0" type="text">使用excel灵活添加学生</el-button>
                </el-upload>
            </div>
            <div>
                <el-table :data="xkIsVerify.studentCourses" stripe border style="width: 100%">
                    <el-table-column prop="student.id" label="uid" />
                    <el-table-column prop="student.name" label="学生姓名" />
                    <el-table-column prop="student.phone" label="电话" />
                    <el-table-column v-if="$store.state.user.userlevel==1" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="cutOne(scope.$index, 2 )">踢出</el-button>
                            <el-button size="mini" @click="seePsw(scope.$index)">查看密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next" :total="xkIsVerify.page" :page-size="10" :current-page="isnowPage" @current-change="xkIsVerifysPageChange"
                />
                <br/>
            </div>
        </el-card>
        <br/>
        <el-card v-if="$store.state.user.userlevel==1" class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>加入待审核</span>
                <el-button style="float: right; padding: 3px 0" type="text"></el-button>
            </div>
            <el-table :data="xkNoVerify.studentCourses" style="width: 100%" stripe border>
                <el-table-column prop="student.id" label="uid" />
                <el-table-column prop="student.name" label="学生姓名">
                </el-table-column>
                <el-table-column prop="student.phone" label="电话">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="intoVerify(scope.$index, 1 , 2)">通过</el-button>
                        <el-button size="mini" @click="intoVerify(scope.$index, 1 , 0)">不通过</el-button>
                        <el-button size="mini" @click="cutOne(scope.$index, 1)">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="xkNoVerify.page" :page-size="10" :current-page="nonowPage" @current-change="xkNoVerifysPageChange"
            />
        </el-card>
        <br/>
        <el-card v-if="$store.state.user.userlevel==1" class="member-el-card">
            <div slot="header" class="clearfix" style=" white-space:pre;">
                <span>审核未通过</span>
                <el-button style="float: right; padding: 3px 0" type="text">全部清除</el-button>
            </div>
            <el-table :data="xkIsConfuse.studentCourses" style="width: 100%" stripe border>
                <el-table-column prop="student.name" label="学生姓名" />
                <el-table-column prop="student.phone" label="电话" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="intoVerify(scope.$index, 0 , 2)">通过</el-button>
                        <el-button size="mini" @click="cutOne(scope.$index, 0)">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="xkIsConfuse.page" :page-size="10" :current-page="renowPage" @current-change="xkIsConfusesPageChange"
            />
        </el-card>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                importFileUrl: 'http://localhost:8089/xk/exceladdmember',
                course: {
                    teacher: {},
                },
                stuPsw: '',
                dialogFormVisible: false,
                isnowPage: 1,
                nonowPage: 1,
                renowPage: 1,
                xkNoVerify: {},
                xkIsVerify: {},
                xkIsConfuse: {}
            }
        },
        created: function () {
            var _this = this;
            if (this.$store.state.user.userlevel == 1) {
                this.memberTypesSele(1, 0);
                this.memberTypesSele(0, 0);
            }
            this.memberTypesSele(2, 0);
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
        computed: {
            ccid: function () {
                return { cid: this.$store.state.courseId, tid: this.$store.state.user.id, start: (this.isnowPage - 1) * 10, page: 10 }
            }
        },
        methods: {
            intoVerify: function (index, rootr, choose) {
                console.log("通过");
                var _this = this;
                var _page = rootr == 2 ? this.isnowPage : (rootr == 1 ? this.nonowPage : this.renowPage)
                var _sid = rootr == 2 ? this.xkIsVerify.studentCourses[index].student.id : (rootr == 1 ? this.xkNoVerify.studentCourses[index].student.id : this.xkIsConfuse.studentCourses[index].student.id);
                console.log(_sid);
                this.postRequest("/xk/verify", {
                    sid: _sid,
                    cid: this.$store.state.courseId,
                    tid: this.$store.state.user.id,
                    start: (_page - 1) * 10,
                    page: 10,
                    rootVerify: rootr,
                    toVerify: choose
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (rootr == 1) {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkNoVerify.page != 1) {
                                _this.memberTypesSele(rootr, (_this.nonowPage - 2) * 10);
                                _this.nonowPage = _this.xkNoVerify.page;
                            } else { _this.xkNoVerify = resp.data; }
                            _this.memberTypesSele(0, (_this.nonowPage - 1) * 10);
                            _this.memberTypesSele(2, (_this.nonowPage - 1) * 10);
                        } else if (rootr == 0) {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkIsConfuse.page != 1) {
                                _this.memberTypesSele(rootr, (_this.renowPage - 2) * 10);
                                _this.renowPage = _this.xkIsConfuse.page;
                            } else { _this.xkIsConfuse = resp.data; }
                            _this.memberTypesSele(1, (_this.renowPage - 1) * 10);
                            _this.memberTypesSele(2, (_this.renowPage - 1) * 10);
                        } else {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkIsVerify.page != 1) {
                                _this.memberTypesSele(rootr, (_this.isnowPage - 2) * 10);
                                _this.isnowPage = _this.xkIsVerify.page;
                            } else { _this.xkIsVerify = resp.data; }
                            _this.memberTypesSele(0, (_this.isnowPage - 1) * 10);
                            _this.memberTypesSele(1, (_this.isnowPage - 1) * 10);
                        }
                        this.$notify({
                            title: "成功",
                            message: "已审核该学生",
                            type: "success",
                            duration: 2000
                        });
                    }
                });
            },

            cutOne: function (index, rootr) {
                var _this = this;
                var _page = rootr == 2 ? this.isnowPage : (rootr == 1 ? this.nonowPage : this.renowPage)
                console.log(_page);
                var _sid = rootr == 2 ? this.xkIsVerify.studentCourses[index].student.id : (rootr == 1 ? this.xkNoVerify.studentCourses[index].student.id : this.xkIsConfuse.studentCourses[index].student.id);
                this.postRequest("/xk/cutOne", {
                    sid: _sid,
                    cid: this.$store.state.courseId,
                    tid: this.$store.state.user.id,
                    start: (_page - 1) * 10,
                    page: 10,
                    rootVerify: rootr
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (rootr == 1) {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkNoVerify.page != 1) {
                                _this.memberTypesSele(rootr, (_this.nonowPage - 2) * 10);
                                _this.nonowPage = Math.ceil(_this.xkNoVerify.page / 10);
                            } else { _this.xkNoVerify = resp.data; }
                            _this.memberTypesSele(0, (_this.renowPage - 1) * 10);
                            _this.memberTypesSele(2, (_this.isnowPage - 1) * 10);
                        } else if (rootr == 0) {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkIsConfuse.page != 1) {
                                _this.memberTypesSele(rootr, (_this.renowPage - 2) * 10);
                                _this.renowPage = Math.ceil(_this.xkIsConfuse.page / 10);
                            } else { _this.xkIsConfuse = resp.data; }
                            _this.memberTypesSele(1, (_this.nonowPage - 1) * 10);
                            _this.memberTypesSele(2, (_this.isnowPage - 1) * 10);
                        } else {
                            if ((resp.data.studentCourses == "" || resp.data.studentCourses == null) && _this.xkIsVerify.page != 1) {
                                _this.memberTypesSele(rootr, (_this.isnowPage - 2) * 10);
                                _this.isnowPage = Math.ceil(_this.xkIsVerify.page / 10);
                            } else { _this.xkIsVerify = resp.data; }
                            _this.memberTypesSele(0, (_this.renowPage - 1) * 10);
                            _this.memberTypesSele(1, (_this.nonowPage - 1) * 10);
                        }
                        this.$notify({
                            title: "成功",
                            message: "已将该学生清除课程",
                            type: "success",
                            duration: 2000
                        });
                    }
                });
            },
            seePsw: function (index) {
                var _this = this;
                this.postRequest("/xk/tchSeeStuPsw", {
                    tid: this.$store.state.user.id,
                    sid: this.xkIsVerify.studentCourses[index].student.id,
                    cid: this.$store.state.courseId,
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        _this.stuPsw = resp.data;
                        _this.dialogFormVisible = true;
                    }
                });
            },
            memberTypesSele: function (vrf, strt) {
                var _this = this;
                this.postRequest("/xk/member", {
                    tid: this.$store.state.user.id,
                    cid: this.$store.state.courseId,
                    verify: vrf,
                    start: strt,
                    page: 10
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        if (vrf == 0) _this.xkIsConfuse = resp.data;
                        if (vrf == 1) _this.xkNoVerify = resp.data;
                        if (vrf == 2) _this.xkIsVerify = resp.data;
                    }
                });
            },

            xkIsVerifysPageChange: function (e) {
                this.isnowPage = e;
                var _this = this;
                _this.postRequest("/xk/member", {
                    tid: this.$store.state.user.id,
                    cid: this.$store.state.courseId,
                    verify: 2,
                    start: (e - 1) * 10,
                    page: 10
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        _this.xkIsVerify = resp.data;
                    }
                });
            },
            xkNoVerifysPageChange: function (e) {
                this.nonowPage = e;
                var _this = this;
                _this.postRequest("/xk/member", {
                    tid: this.$store.state.user.id,
                    cid: this.$store.state.courseId,
                    verify: 1,
                    start: (e - 1) * 10,
                    page: 10
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        _this.xkNoVerify = resp.data;
                    }
                });
            },
            xkIsConfusesPageChange: function (e) {
                this.renowPage = e;
                var _this = this;
                _this.postRequest("/xk/member", {
                    tid: this.$store.state.user.id,
                    cid: this.$store.state.courseId,
                    verify: 0,
                    start: (e - 1) * 10,
                    page: 10
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        _this.xkIsConfuse = resp.data;
                    }
                });
            },


            onChanges: function (file, fileList) {
                //console.log(file);
                //this.filesList = fileList;
            },
            uploadError: function () { },
            bRemove: function (file, fileList) {
                //this.filesList = fileList;
            },
            uploadSuccess: function (response, file, fileList) {
                console.log("成功");
                this.xkIsVerify = response;
                console.log(fileList);
                console.log(response);
                this.$notify({
                    title: "成功",
                    message: "学生成员导入成功",
                    type: "success",
                    duration: 2000
                });
            },
            beforeAvatarUpload: function (file) {
                var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
                const extension = testmsg === 'xls';
                const extension2 = testmsg === 'xlsx';
                if (!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                return extension || extension2;
            }
        }
    }
</script>

<style>
    .member-el-card {
        width: 80%;
        margin-right: 6%;
        margin-left: 8%;
        margin-bottom: 15px
    }

    /* .member-el-card {
        margin-right: 130px;
        margin-left: 70px;
        margin-bottom: 15px
    } */
</style>