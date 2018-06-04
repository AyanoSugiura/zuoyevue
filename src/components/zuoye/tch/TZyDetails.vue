<template>
    <div>
        <el-form ref="selectForm" :model="selectForm" label-width="80px">
            <el-form-item label="批改情况">
                <el-radio-group v-model="selectForm.type" @change="onChanges">
                    <el-radio label="未批"></el-radio>
                    <el-radio label="已批"></el-radio>
                    <el-radio label="未交"></el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <br/>
        <!-- 最新作业的为空时 -->
        <el-card v-if="((stuZuoyes==null||stuZuoyes.length==0)&&(selectForm.type=='已批'||selectForm.type=='未批'))||((unSubs==null||unSubs.length==0)&&(selectForm.type=='未交'))"
            style=" margin-left: 9%;margin-right: 5%; width: 80%;height: 100%;; margin-top:20px ">
            <div slot="header" class="clearfix">
                <p class="setting-card-heading">作业情况</p>
            </div>
            <el-table v-if="selectForm.type=='未交'" :data="unSubs" style="width: 100%;margin-bottom: 25px">
                <el-table-column prop="id" />
            </el-table>
            <el-table v-else :data="stuZuoyes" style="width: 100%;margin-bottom: 25px">
                <el-table-column prop="id" />
            </el-table>
        </el-card>

        <div v-if="selectForm.type=='未交'">
            <el-table :data="unSubs" style=" margin-left: 9%;margin-right: 5%; width: 80%;height: 100%;; margin-top:20px ">
                <el-table-column prop="id" label="学号" />
                <el-table-column prop="name" label="姓名" />
            </el-table>
        </div>

        <div v-else>
            <el-card v-for="(stuZuoye,index) in stuZuoyes" :key="stuZuoye.id" style="margin-left: 50px; margin-right: 450px; margin-bottom:15px ">

                <div class="clearfix" style="margin-bottom: 0px">
                    <el-row>
                        <el-col :span="18">
                            <span>
                                <h3 class="work-title" style="margin-left:15px ">{{stuZuoye.student.name}}</h3>
                            </span>
                        </el-col>
                        <el-col v-if="selectForm.type=='已批'" :span="6">
                            <h3 class="work-title" style="color: red;float: right;margin-right:55px ">成绩：{{stuZuoye.score}}</h3>
                        </el-col>
                    </el-row>
                </div>


                <el-collapse style="background-color: white;margin-bottom : 15px;margin-top: 0px" accordion>
                    <el-collapse-item title="作业文件、留言等详情,点击展开" name="1" style="padding-left: 20px">

                        <!-- <el-row>
                            <el-col v-for="zyf in (stuZuoye.files_links.split('|'))" :key="zyf.length">
                                <div style="margin-bottom:5px">
                                    <a :href="zyf">{{zyf.substring(zyf.lastIndexOf("/")+1)}} </a>
                                </div>
                            </el-col>
                        </el-row> -->

                        <div v-for="(zy,index) in (stuZuoye.files_links.split('|'))" :key="index" style="margin-right: 20px;margin-bottom:50px;float: left;">

                            <div v-if="(zy.substring(zy.lastIndexOf('.')))=='.doc'||(zy.substring(zy.lastIndexOf('.')))=='.docx'||(zy.substring(zy.lastIndexOf('.')))=='.xls'||(zy.substring(zy.lastIndexOf('.')))=='.xlsx'||(zy.substring(zy.lastIndexOf('.')))=='.ppt'||(zy.substring(zy.lastIndexOf('.')))=='.pptx'||(zy.substring(zy.lastIndexOf('.')))=='.pdf'">
                                <router-link :to="{ name: 'ZyPdfView', query: { stuZuoyeId: stuZuoye.id,index:index }}">
                                    <img :src="'https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_'+((zy.substring(zy.lastIndexOf('.'))).substr(1))+'.png'"
                                        height="80px" width="80px" />
                                </router-link>
                            </div>
                            <div v-else-if="(zy.substring(zy.lastIndexOf('.')))=='.txt'||(zy.substring(zy.lastIndexOf('.')))=='.zip'  ">
                                <img :src="'https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_'+((zy.substring(zy.lastIndexOf('.'))).substr(1))+'.png'"
                                    height="80px" width="80px" />
                            </div>
                            <div v-else>
                                <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_others.png" height="80px" width="80px">
                            </div>
                            <div>
                                <a :href="zy" class="file_font" style="text-decoration:none">{{((zy.substring(zy.lastIndexOf("/")+1).length)>6?((zy.substring(zy.lastIndexOf("/")+1)).substring(0,6)):(zy.substring(zy.lastIndexOf("/")+1)))+'...'}}
                                </a>
                            </div>

                        </div>
                        <el-form label-width="70px" style="margin-top: 25px;clear:both">
                            <el-form-item label="作业留言" style="margin-right: 55px;">
                                <el-input :id="'xsly_'+index" type="textarea" v-model="stuZuoye.content" :disabled="true" placeholder="无"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>

                <el-form label-width="70px" style="margin-top: 25px;margin-left: 22px;">
                    <el-form-item label="老师评语" style="margin-right: 55px;">
                        <el-input type="textarea" v-model="stuZuoye.comment" placeholder="点击添加评论（仅改作业的学生可看）..."></el-input>
                    </el-form-item>
                </el-form>
                <el-button style="margin-right: 55px;margin-bottom : 35px;float: right;" type="success" plain @click="submitPg(stuZuoye)"
                    v-bind:disabled="isKong">{{(stuZuoye.isPg==0) ? '提交':'更改批改'}}</el-button>
                <el-select v-model="stuZuoye.score" placeholder="请打分" style="margin-right: 55px;margin-bottom : 35px;float: right;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                    </el-option>
                </el-select>
            </el-card>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [
                    {
                        value: 1,
                        label: "A+"
                    },
                    {
                        value: 2,
                        label: "A"
                    },
                    {
                        value: 3,
                        label: "B+"
                    },
                    {
                        value: 4,
                        label: "B"
                    },
                    {
                        value: 5,
                        label: "C+"
                    },
                    {
                        value: 6,
                        label: "C"
                    },
                    {
                        value: 7,
                        label: "D+"
                    },
                    {
                        value: 8,
                        label: "D"
                    },
                    {
                        value: 9,
                        label: "E"
                    },
                    {
                        value: 10,
                        label: "0"
                    }
                ],
                //value: '',
                selectForm: {
                    type: "未批"
                },
                upLoadData: {
                    liuyan: "",
                    tchLiuyan: ""
                },
                stuZuoyes: [],
                unSubs: []
            };
        },
        computed: {
            isKong: function () {
                return this.value == "";
            }
        },
        created: function () {
            var _this = this;
            this.postRequest("/szy/ispg", {
                taskId: this.$route.query.taskId,
                isPg: 0
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.stuZuoyes = resp.data;
                    //_this.upLoadData.liuyan = _this.stuZuoyes.content;
                    //_this.upLoadData.tchLiuyan = _this.stuZuoyes.comment;
                    console.log(resp.data);
                }
            });

            this.postRequest("/szy/unsub", {
                taskId: this.$route.query.taskId,
                courseId: this.$store.state.courseId
            }).then(resp => {
                if (resp && resp.status == 200) {
                    _this.unSubs = resp.data;
                }
            });
        },

        // computed: {
        //     isChanges: function () {
        //         var _this = this;
        //         if (this.selectForm.type == "已批") {
        //             this.postRequest("/szy/ispg", {
        //                 taskId: this.$route.query.taskId,
        //                 isPg: 1
        //             }).then(resp => {
        //                 if (resp && resp.status == 200) {
        //                     _this.stuZuoyes = resp.data;
        //                 }
        //             });
        //         }
        //         else if (this.selectForm.type == "未批") {
        //             this.postRequest("/szy/ispg", {
        //                 taskId: this.$route.query.taskId,
        //                 isPg: 0
        //             }).then(resp => {
        //                 if (resp && resp.status == 200) {
        //                     _this.stuZuoyes = resp.data;
        //                 }
        //             });
        //         }
        //         console.log("分隔");
        //         console.log(this.stuZuoyes);
        //         return this.stuZuoyes;
        //     }

        // },

        methods: {
            submitPg: function (stuZuoye) {
                var _this = this;
                var _type = 3;
                if (this.selectForm.type == "已批") _type = 1;
                else if (this.selectForm.type == "未批") _type = 0;
                if (stuZuoye.comment == null) stuZuoye.comment = '';
                if (stuZuoye.tassk.course.teacher.id == this.$store.state.user.id) {
                    this.postRequest("/szy/tchpg", {
                        id: stuZuoye.id,
                        comment: stuZuoye.comment,
                        score: stuZuoye.score,
                        isPg: 1,
                        type: _type,
                        taskId: this.$route.query.taskId
                    }).then(resp => {
                        if (resp && resp.status == 200) {
                            _this.stuZuoyes = resp.data;
                            _this.$notify({
                                title: "成功",
                                message: _type == 1 ? "作业已更新批改" : "批改成功",
                                type: "success",
                                duration: 2000
                            });
                        }
                    });
                }
            },
            onChanges: function () {
                var _this = this;
                if (this.selectForm.type == "已批") {
                    this.postRequest("/szy/ispg", {
                        taskId: this.$route.query.taskId,
                        isPg: 1
                    }).then(resp => {
                        if (resp && resp.status == 200) {
                            _this.stuZuoyes = resp.data;
                        }
                    });
                } else if (this.selectForm.type == "未批") {
                    this.postRequest("/szy/ispg", {
                        taskId: this.$route.query.taskId,
                        isPg: 0
                    }).then(resp => {
                        if (resp && resp.status == 200) {
                            _this.stuZuoyes = resp.data;
                        }
                    });
                }
                console.log("分隔");
                console.log(this.stuZuoyes);
            },

            stuZyScore: function (szyScr) {
                return szyScr == null ? "" : szyScr;
            }
        }
    };
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

    .file_font {
        font-size: 12.6px;
        font-family: 微软雅黑;
    }

    [id^='xsly_'] {
        background-color: white;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }
</style>