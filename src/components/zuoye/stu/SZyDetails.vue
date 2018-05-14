<template>
    <div>
        <div>
            <i class="el-icon-document titles ">{{stuZuoye.tassk.title==null?(this.$route.query.taskTitle):stuZuoye.tassk.title}}</i>
        </div>
        <el-card style="background-color: white;width: 800px;margin-left: 56px;">
            <el-row>
                <el-col v-if="stuZuoye==null||stuZuoye.isPg==0||$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'" :span="22">
                    <el-upload class='ensure ensureButt' :action="importFileUrl" :onError="uploadError" :file-list="filesList" :onSuccess="uploadSuccess"
                        :on-change="onChanges" :before-remove="bRemove" :beforeUpload="beforeAvatarUpload">
                        <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-bind:disabled="isKong">{{(stuZuoye.id==null) ? '提交':'更新提交'}}</el-button>
                    </el-upload>
                </el-col>

                <el-col v-else :span="22">

                </el-col>

                <el-col :span="2">
                    <p v-if="stuZuoye==null||stuZuoye.isPg==0||$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'">{{(stuZuoye==null)?'未提交':'未批改'}}</p>
                    <p v-else>成绩：{{stuZuoye.score}}</p>
                </el-col>
            </el-row>

            <div v-if="stuZuoye==null||stuZuoye.isPg==0||$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'">
                <el-form ref="upLoadData" :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="作业留言" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.liuyan" placeholder="点击添加留言（仅老师可看）..."></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else>
                <el-row>
                    <el-col v-for="zy in (stuZuoye.files_links.split('|'))" :key="zy.length">
                        <div style="margin-bottom:5px">
                            <a :href="zy">{{zy.substring(zy.lastIndexOf("/")+1)}} </a>
                        </div>
                    </el-col>
                </el-row>
                <el-form :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="作业留言" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.liuyan" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="老师评语" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.tchLiuyan" :disabled="true" placeholder="无"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </el-card>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                importFileUrl: "http://localhost:8089/files/save",
                files_links: "",
                upLoadData: {
                    liuyan: "",
                    tchLiuyan: "",
                    title: "",
                    content: "",
                    files: ""
                },
                filee: {
                    name: "",
                    response: "",
                    status: "success",
                    url: ""
                },
                courses: [],
                filesList: [],
                filesList2: [],
                stuZuoye: {
                    files_links: '',
                    tassk: {}
                }
            }
        },
        created: function () {
            var _this = this;

            this.postRequest("/szy/stuzy", {
                stuId: this.$store.state.user.id,
                taskId: this.$route.query.taskId
            }).then(resp => {
                console.log(resp);
                if (resp && resp.status == 200 && resp.data != "") {
                    _this.stuZuoye = resp.data;
                    _this.upLoadData.liuyan = (_this.stuZuoye.content == null) ? '' : _this.stuZuoye.content;
                    _this.upLoadData.tchLiuyan = (_this.stuZuoye.comment == null) ? '' : _this.stuZuoye.comment;
                    _this.filesList = [];
                    var fls = _this.stuZuoye.files_links.split('|');
                    for (let fl in fls) {
                        _this.filee={};
                        this.$set(this.filee, 'name', (fls[fl]).substring(fls[fl].lastIndexOf("/") + 1));
                        this.$set(this.filee, 'response', fls[fl]);
                        this.$set(this.filee, 'url', fls[fl]);
                        this.$set(this.filee, 'status', 'success');
                        _this.filesList.push(_this.filee);
                    }
                    console.log(_this.stuZuoye);
                }
            });

            // this.postRequest("/szy/szys", {
            //     stuId: this.$store.state.user.id,
            //     taskId: this.$route.query.taskId
            // }).then(resp => {
            //     console.log(resp);
            //     if (resp && resp.status == 200 ) {
            //         _this.stuZuoye = resp.data;
            //         console.log( _this.stuZuoye);
            //     }
            //     else _this.$notify.error({
            //         title: "没有该作业",
            //         message: "请输入正确的url"
            //     });
            // });


            // if (_this.stuZuoye.isPg == 0 || _this.$route.query.stuStatus == '未批改') {
            //     this.postRequest("/szy/flielist", {
            //         stuId: $store.state.user.id,
            //         taskId: $route.query.taskId
            //     }).then(resp => {
            //         if (resp && resp.status == 200) {
            //             console.log(resp.data);
            //             for (let fl in resp.data.split('|')) {
            //                 _this.filee.name = fl.substring(zy.lastIndexOf("/") + 1);
            //                 _this.filee.response = fl;
            //                 _this.filee.url = fl
            //                 _this.filesList.push(_this.filee);
            //             }
            //         }
            //     });
            // }
        },
        computed: {
            isKong: function () {
                return this.filesList.length == 0;
            }
        },
        methods: {
            submitUpload: function () {
                var _this = this;
                this.filesList2 = [];
                for (let fl in this.filesList) {
                    this.filesList2.push(this.filesList[fl].response);
                }
                this.postRequest("/szy/subzy", {
                    stuId: this.$store.state.user.id,
                    taskId: this.$route.query.taskId,
                    content: this.upLoadData.liuyan,
                    files_links: this.filesList2.join("|")
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        this.stuZuoye = resp.data;
                        _this.upLoadData.liuyan = _this.stuZuoye.content;
                        _this.upLoadData.tchLiuyan = _this.stuZuoye.comment;
                        if (resp.data.subStatus == "提交成功") {
                            _this.$notify({
                                title: "成功",
                                message: "作业提交成功",
                                type: "success",
                                duration: 2000
                            });
                        }
                        else if (resp.data.subStatus == "已重新提交") {
                            _this.$notify({ //已批改，不能提交
                                title: "成功",
                                message: "作业已重新提交",
                                type: "success",
                                duration: 2000
                            });
                        }
                        else if (resp.data.subStatus == "已重新提交") {
                            _this.$notify.error({
                                title: '提交失败',
                                message: '已批改，不能提交'
                            });
                        }


                    } else
                        _this.$notify.error({
                            title: "提交失败",
                            message: "请联系管理员"
                        });
                });
            },
            onChanges: function (file, fileList) {
                console.log(fileList);
                this.filesList = fileList;
            },
            uploadError: function () { },
            bRemove: function (file, fileList) {
                console.log(fileList);
                this.filesList = fileList;
            },
            uploadSuccess: function (response, file, fileList) {

            },
            beforeAvatarUpload: function () { }
        }


    }
</script>

<style>
    .titles {
        cursor: pointer;
        margin-left: 30px;
        margin-top: 30px;
        margin-bottom: 16px;
        padding-left: 23px;
        height: 16px;
        line-height: 16px;
        color: #272636;
        font-size: 16px;
    }

    .szy1 {
        background: #f6f6f6;
        border-bottom: 1px solid #dcdcdc;
        border-top: 1px solid #dcdcdc;
        line-height: 30px;
        padding: 14px 0 14px 25px;
        font-size: 0;
        cursor: text;
        zoom: 1;
    }

    .s1 {
        font-size: 14px;
        float: left;
        width: 80px;
    }

    .s2 {
        float: left;
        font-size: 14px;
        color: #818181;
        width: 685px;
        word-break: break-all;
        word-wrap: break-word;
    }
</style>