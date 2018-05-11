<template>
    <div>
        <el-card v-for="task in tasks" :key="task.id" style=" margin-right: 50px; margin-bottom:15px ">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="15">
                        <span>
                            <router-link v-if="$store.state.user.userlevel==1" style="text-decoration:none" :to="{ name: 'TZyDetails', query: { taskId: task.id }}">
                                <h3 class="work-title">{{task.title}}</h3>
                            </router-link>
                        </span>
                    </el-col>
                    <el-col :span="9">
                        <router-link  :to="{ name: 'CourseDetails', query: { courseId: task.course.id }}"><h3 class="work-title">{{task.course.name}}</h3> </router-link>
                    </el-col>
                </el-row>
            </div>

            <div class="word">
                <div class="p">{{task.content}}</div>
            </div>
            <br/>

            <el-row>
                <el-col v-for="(zy,index) in (task.files_links.split('|'))" :key="index">
                    <div style="margin-bottom:5px">
                        <a :href="zy">{{zy.substring(zy.lastIndexOf("/")+1)}} </a>
                    </div>
                </el-col>
            </el-row>

        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tasks: [
                   
                ],
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
        }
    }
</script>