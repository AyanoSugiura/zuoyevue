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
            <el-collapse v-for="stuZuoye in stuZuoyes" :key="stuZuoye.id" style="margin-right: 50px;" accordion>
                <el-collapse-item :title="stuZuoye.student.name" name="1">
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectForm: {
                    type: "未批"
                },
                stuZuoyes: [],
                unSubs: []
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



        },
    }
</script>