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
        <div v-if="selectForm.type=='未交'">
            <p v-for="unSub in unSubs" :key="unSub.id">{{unSub.name}}</p>
        </div>

        <div v-else>
            <el-collapse v-for="stuZuoye in stuZuoyes" :key="stuZuoye.id" style="background-color: white;width: 1100px;margin-left: 80px;margin-bottom : 15px;"
                accordion>
                <el-collapse-item :title="stuZuoye.student.name" name="1" style="padding-left: 20px">

                    <el-row>
                        <el-col v-for="zyf in (stuZuoye.files_links.split('|'))" :key="zyf.length">
                            <div style="margin-bottom:5px">
                                <a :href="zyf">{{zyf.substring(zyf.lastIndexOf("/")+1)}} </a>
                            </div>
                        </el-col>
                    </el-row>

                    <el-form label-width="70px" style="margin-top: 25px;">
                        <el-form-item label="作业留言" style="margin-right: 55px;">
                            <el-input type="textarea" v-model="stuZuoye.content" :disabled="true" placeholder="无"></el-input>
                        </el-form-item>
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
                    <!-- <el-select v-if="selectForm.type=='未批'" v-model="value" placeholder="请打分" style="margin-right: 55px;margin-bottom : 35px;float: right;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select> -->

                </el-collapse-item>
            </el-collapse>
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
                        label: "D"
                    },
                    {
                        value: 8,
                        label: "E"
                    },
                    {
                        value: 9,
                        label: "0"
                    },
                ],
                //value: '',
                selectForm: {
                    type: "未批"
                },
                upLoadData: {
                    liuyan: "",
                    tchLiuyan: "",
                },
                stuZuoyes: [],
                unSubs: []
            }
        },
        computed: {
            isKong: function () {
                return this.value == '';
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
                                message: _type==1?'作业已更新批改':'批改成功',
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
                }
                else if (this.selectForm.type == "未批") {
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
                return szyScr == null ? '' : szyScr;
            }

        },
    }
</script>