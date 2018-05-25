<template>
    <div>
        <!-- 修改课程名 -->
        <el-card style="width: 60%;margin-left: 18%;margin-top: 25px">
            <div slot="header" class="clearfix">
                <p class="setting-card-heading">用户信息</p>

            </div>
            <p v-if="$store.state.user.userlevel==1" style="margin-left:45px"> 用户身份：教师</p>
            <p v-else-if="$store.state.user.userlevel==0" style="margin-left:45px">用户身份：学生</p>
            <br/>
            <el-form :model="mMsg" status-icon ref="mMsg" label-width="100px" style="margin-right: 100px">
                <el-form-item label="用户名">
                    <el-input v-model="mMsg.name" auto-complete="off" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="mMsg.phone" auto-complete="off" placeholder="电话号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="float: right;width: 100px;" size="small" type="success" @click="alterMsg">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="width: 60%;margin-left: 18%;margin-top: 25px">
            <div slot="header" class="clearfix">
                <p class="setting-card-heading">修改密码</p>
            </div>

            <el-form :model="xMsg" status-icon label-width="100px" style="margin-right: 100px">
                <el-form-item label="当前密码">
                    <el-input v-model="xMsg.password" type="password" auto-complete="off" placeholder="当前密码"></el-input>
                </el-form-item>
                <el-form-item label="新的密码">
                    <el-input v-model="xMsg.newpsw" type="password" auto-complete="off" placeholder="新的密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="xMsg.repsw" type="password" auto-complete="off" placeholder="确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="float: right;width: 100px;" size="small" type="success" @click="alterPsw" v-bind:disabled="pswV">修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
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
                nocanA: true,
                nocanB: true,
                mMsg: {
                },
                xMsg: {
                    password: "",
                    newpsw: "",
                    repsw: ""
                },
                settingCourseName: "",
                selectscr: [],
                settingCourseNameRules: {
                    name: [{ validator: validateName, trigger: "change" }]
                }
            };
        },
        created: function () {
            var _this = this;

            this.postRequest("/user/usermsg", {
                id: this.$store.state.user.id
            }).then(resp => {
                if (resp && resp.status == 200 && resp.data != "") {
                    _this.mMsg = resp.data;
                    console.log(resp.data);
                }
            });
        },
        computed: {
            pswV: function () {
                return this.xMsg.password.length < 3 || this.xMsg.password.length > 20 || this.xMsg.newpsw.length < 3 || this.xMsg.newpsw.length > 20 || this.xMsg.repsw.length < 3 || this.xMsg.repsw.length > 20;
            }
        },
        methods: {
            alterMsg: function () {
                var _this = this;
                if (this.checkSpecialChar(this.mMsg.name) && this.checkPhoneChar(this.mMsg.phone)) {
                    this.postRequest("/user/altermsg", {
                        uid: this.$store.state.user.id,
                        name: this.mMsg.name,
                        phone: this.mMsg.phone
                    }).then(resp => {
                        if (resp && resp.status == 200 && resp.data != "") {
                            _this.mMsg = resp.data;
                            console.log(resp.data);
                            _this.$store.commit('alterMsg', resp.data);
                            this.$notify({
                                title: '成功',
                                message: '修改信息成功',
                                type: 'success',
                                duration: 2000
                            });
                        } else _this.$notify.error({
                            title: '修改失败',
                            message: '请联系管理员'
                        });
                    });
                }
            },
            alterPsw: function () {
                var _this = this;
                if (this.checkpswChar(this.xMsg.newpsw, this.xMsg.repsw)) {
                    this.postRequest("/user/alterpsw", {
                        uid: this.$store.state.user.id,
                        password: this.xMsg.password,
                        newpsw: this.xMsg.newpsw
                    }).then(resp => {
                        if (resp && resp.status == 200) {
                            if (resp.data == "密码更改成功") {
                                this.$notify({
                                    title: '成功',
                                    message: '修改信息成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                _this.$store.commit('logout');
                                _this.$router.replace({ path: '/Login' });
                            } else if (resp.data == "当前密码错误") {
                                this.$notify.error({
                                    title: '当前密码错误',
                                    message: '在修改成新的密码前必须当前的密码必须验证通过'
                                });
                            }else if (resp.data == "密码更改失败") {
                                this.$notify.error({
                                    title: '密码更改失败',
                                    message: '请联系管理员'
                                });
                            }

                        } else _this.$notify.error({
                            title: '修改失败',
                            message: '请联系管理员'
                        });
                    });
                }
            },
            checkSpecialChar: function (str) {
                var re = /[~#^$@%&!*()<>:;'"{}【】  ]/gi;
                if (re.test(str)) {
                    this.$notify.error({
                        title: '用户名非法',
                        message: '用户名不能包含空格等特殊字符'
                    });
                    return false;
                }
                return true;
            },
            checkPhoneChar: function (str) {
                var dr = /\d{3,11}/g
                if (!(dr.test(str))) {
                    this.$notify.error({
                        title: '电话号非法',
                        message: '电话号必须输入合法'
                    });
                    return false;
                }
                return true;
            },
            checkpswChar: function (psw, newPsw) {
                if (psw != newPsw) {
                    this.$notify.error({
                        title: '新密码和确认密码不同',
                        message: '请检查,并重新输入'
                    });
                    return false;
                }
                return true;
            },
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