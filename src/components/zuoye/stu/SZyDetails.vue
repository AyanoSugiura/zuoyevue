<template>
    <div>
        <div>
            <i class="el-icon-document titles ">{{$route.query.taskTitle}}</i>
        </div>
        <el-card style="background-color: white;width: 800px;margin-left: 56px;">
            <el-row>
                <el-col v-if="$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'" :span="22">
                    <el-upload class='ensure ensureButt' 
                    :action="importFileUrl" 
                    :onError="uploadError" 
                    :file-list="filesList"
                    :onSuccess="uploadSuccess" 
                    :on-change="onChanges"
                    :before-remove="bRemove" 
                    :beforeUpload="beforeAvatarUpload">
                        <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-bind:disabled="isKong">{{($route.query.stuStatus=='未批改') ? '更新提交':'提交'}}</el-button>
                    </el-upload>
                </el-col>

                <el-col v-else :span="22">

                </el-col>

                <el-col :span="2">
                    <p v-if="$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'">{{$route.query.stuStatus}}</p>
                    <p v-else>成绩：{{upLoadData.content}}</p>
                </el-col>
            </el-row>

            <div v-if="$route.query.stuStatus=='未提交'||$route.query.stuStatus=='未批改'">
                <el-form ref="upLoadData" :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="作业留言" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.title" placeholder="点击添加留言（仅老师可看）..."></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else>
                <el-row>
                    <el-col v-for="zy in (zuoye.files_links.split('|'))" :key="zy.length">
                        <div style="margin-bottom:5px">
                            <a :href="zy">{{zy.substring(zy.lastIndexOf("/")+1)}} </a>
                        </div>
                    </el-col>
                </el-row>
                <el-form :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="作业留言" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.title" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="upLoadData" label-width="70px" style="margin-top: 25px;">
                    <el-form-item label="作业留言" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="upLoadData.title" :disabled="true" placeholder="无"></el-input>
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
                zuoyes: []
            }
        },
        created: function () {
            var _this = this;
            if ($route.query.stuStatus == '未批改') {
                this.postRequest("/szy/flielist", {
                    stuId: $store.state.user.id,
                    taskId: $route.query.taskId
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        console.log(resp.data);
                        for (let fl in resp.data.split('|')) {
                            _this.filee.name=fl.substring(zy.lastIndexOf("/") + 1);
                            _this.filee.response=fl;
                            _this.filee.url=fl
                            _this.filesList.push(_this.filee);
                        }
                    }
                });
            }
        },
        computed: {
            isKong: function () {
                return this.upLoadData.title === "";
            }
        },
        methods: {
            submitUpload: function (file, fileList) {

            },
            onChanges: function (file, fileList) {
                //console.log(file);
                this.filesList = fileList;
            },
            uploadError: function () { },
            bRemove: function (file, fileList) {
                this.filesList = fileList;
            },
            uploadSuccess: function (response, file, fileList) {
                console.log(fileList);
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