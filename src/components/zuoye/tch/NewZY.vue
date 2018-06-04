<template>
    <div>
        <!-- 最新作业的为空时 -->
        <el-card v-if="tasks==null||tasks.length==0" style=" margin-left: 9%;margin-right: 5%; width: 80%;height: 100%;; margin-top:20px ">
            <div slot="header" class="clearfix">
                <p class="setting-card-heading">最新作业</p>
            </div>
            <el-table :data="tasks" style="width: 100%;margin-bottom: 25px">
                <el-table-column prop="id" />
            </el-table>
        </el-card>

        <!-- 每个任务修改对话框 -->
        <el-dialog :title="(tasks.length-ndx)+'、'+'  '+tassk.title" :visible.sync="dialogFormVisible" style="width: 1000px;margin-left: 300px ">
            <el-form :model="tassk" status-icon style="width: 100%;">
                <el-form-item label="标题" prop="name">
                    <el-input v-model="tassk.title" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="要求">
                    <el-input type="textarea" v-model="tassk.content" placeholder="作业简介，作业格式等要求"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload class='ensure ensureButt' :action="importFileUrl" :file-list="tasskFiles" :on-change="tasskFilesChanges" :before-remove="tasskFilesRemove">
                        <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="editSubmit" v-bind:disabled="taskFilesIsKong">保存</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 最新作业遍历 -->
        <el-card v-for="(task,index) in tasks" :key="task.id" style=" margin-left: 9%;margin-right: 5%; width: 80%;; margin-top:20px ">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="10">
                        <span>
                            <router-link style="text-decoration:none" :to="{ name: 'TZyDetails', query: { taskId: task.id }}">
                                <h3 class="work-title">{{(tasks.length-index)+'、'+' '+task.title}}</h3>
                            </router-link>
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <router-link :to="{ name: 'CourseDetails', query: { courseId: task.course.id }}">
                            <h3 class="work-title">{{task.course.name}}</h3>
                        </router-link>
                    </el-col>
                    <el-col :span="1" style="padding-top: 0px">
                        <h3 class="work-title">
                            <el-button @click="editTask(task,index)" style="float: right;padding-top: 0px " type="text">
                                <i class="el-icon-edit">编辑</i>
                            </el-button>
                        </h3>
                    </el-col>
                    <el-col :span="7">
                        <div style="float: right;margin-right: 15px">
                            <div style="float: left;" class="total-cont">
                                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{task.pgStatistics.isPg}}</p>
                                <p style=" color: green; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">已批</p>
                            </div>
                            <div style="float: left;" class="total-cont">
                                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{task.pgStatistics.noPg}}</p>
                                <p style=" color: grey; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">未批</p>
                            </div>
                            <div style="float: left;" class="total-cont">
                                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{task.pgStatistics.noSub}}</p>
                                <p style=" color: red; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">未交</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <div class="word">
                <div class="p">{{task.content}}</div>
            </div>
            <br/>
            <div v-if="(task.files_links)!=''">
                <div v-for="(zy,index) in (task.files_links.split('|'))" :key="index" style="margin-right: 20px;margin-bottom:50px;float: left;">

                    <div v-if="(zy.substring(zy.lastIndexOf('.')))=='.doc'||(zy.substring(zy.lastIndexOf('.')))=='.docx'||(zy.substring(zy.lastIndexOf('.')))=='.xls'||(zy.substring(zy.lastIndexOf('.')))=='.xlsx'||(zy.substring(zy.lastIndexOf('.')))=='.ppt'||(zy.substring(zy.lastIndexOf('.')))=='.pptx'||(zy.substring(zy.lastIndexOf('.')))=='.pdf'||(zy.substring(zy.lastIndexOf('.')))=='.txt'||(zy.substring(zy.lastIndexOf('.')))=='.zip'  ">
                        <img :src="'https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_'+((zy.substring(zy.lastIndexOf('.'))).substr(1))+'.png'"
                            height="80px" width="80px">
                    </div>
                    <div v-else>
                        <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_others.png" height="80px" width="80px">
                    </div>
                    <div>
                        <a :href="zy" style="text-decoration:none">{{((zy.substring(zy.lastIndexOf("/")+1).length)>5?((zy.substring(zy.lastIndexOf("/")+1)).substring(0,5)):(zy.substring(zy.lastIndexOf("/")+1)))+'...'}}
                        </a>
                    </div>

                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                importFileUrl: "http://localhost:8089/files/save",
                tassk: {},
                ndx: null,
                tasskFiles: [],
                tasskFilesHelps: [],
                dialogFormVisible: false,
                tasks: [],
            }
        },
        created: function () {
            var _this = this;
            if (this.$store.state.user.userlevel == 1) {
                this.postRequest("/task/tchnewtsk", {
                    tid: this.$store.state.user.id,
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        _this.tasks = resp.data;
                        console.log("统计");
                        console.log(resp.data);
                    }
                });
            }
        },
        computed: {
            taskFilesIsKong: function () {
                return this.tasskFiles.length == 0;
            }
        },
        methods: {
            btType: function (type) {
                if (type == "未提交") return "warning";
                else if (type == "已批改") return "success";
                else if (type == "未批改") return "info";
            },
            switchs: function (type, task) {
                console.log(task.title);
                this.$router.push({ name: 'SZyDetails', query: { taskId: task.id } });
            },

            //以下单个任务修改
            editTask: function (task, index) {
                this.tassk = task;
                this.ndx = index;
                this.tasskFiles = [];
                if (task.files_links != '') {
                    var fls = task.files_links.split('|');
                    for (let fl in fls) {
                        let filee = {};
                        this.$set(filee, 'name', (fls[fl]).substring(fls[fl].lastIndexOf("/") + 1));
                        this.$set(filee, 'response', fls[fl]);
                        this.$set(filee, 'url', fls[fl]);
                        this.$set(filee, 'status', 'success');
                        this.tasskFiles.push(filee);
                    }
                }
                this.dialogFormVisible = true;
            },

            editSubmit: function () {
                var _this = this;
                this.tasskFilesHelps = [];
                for (let fl in this.tasskFiles) {
                    this.tasskFilesHelps.push(this.tasskFiles[fl].response);
                }
                this.postRequest("/szy/taskalter", {
                    cid: this.tassk.course.id,
                    id: this.tassk.id,
                    title: this.tassk.title,
                    content: this.tassk.content,
                    files_links: this.tasskFilesHelps.join("|")
                }).then(resp => {
                    if (resp && resp.status == 200 && resp.data != "") {
                        _this.$set(_this.tasks, _this.ndx, resp.data);
                        _this.$notify({
                            title: "成功",
                            message: "作业修改成功",
                            type: "success",
                            duration: 2000
                        });
                        _this.tassk = {};
                        _this.tasskFiles = [];
                        _this.tasskFilesHelps = [];
                        _this.ndx = null
                        _this.dialogFormVisible = false;
                    } else
                        _this.$notify.error({
                            title: "作业修改失败",
                            message: "请联系管理员"
                        });
                });

            },


            tasskFilesChanges: function (file, fileList) {
                this.tasskFiles = fileList;
                console.log(this.tasskFiles);
            },
            tasskFilesRemove: function (file, fileList) {
                this.tasskFiles = fileList;
                console.log(this.tasskFiles);
            },

        }
    }
</script>
<style>
    .announce-cont-box .announce-cont .word .pr {
        color: #5b5b5b;
        overflow: hidden;
        line-height: 1.8;
    }

    .word {
        height: auto;
        overflow: auto;
        max-height: inherit;
    }

    h3 {
        color: #5b5b5b;
        display: block;
        font-size: 1.05em;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;
    }

    .clearfix {
        zoom: 1;
    }

    .download {
        color: #4d90fe;
        font-size: 12px;
        display: none;
        line-height: 24px;
    }

    .total-cont {
        border-left-style: solid;
        border-left-color: #c8c8c8;
        border-left-width: 1px;

        padding: 0px 43px 0px 18px;
    }
</style>