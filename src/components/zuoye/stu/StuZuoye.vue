<template>
  <div>
    <el-card v-for="task in tasks" :key="task.id" style=" margin-right: 50px; margin-bottom:15px ">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="15">
            <span>
              <router-link v-if="$store.state.user.userlevel==0" style="text-decoration:none" :to="{ name: 'SZyDetails', query: { taskId: task.id }}">
                <h3 class="work-title">{{task.title}}</h3>
              </router-link>
            </span>
          </el-col>
          <el-col :span="9">
            <el-button v-if="$store.state.user.userlevel==0" style="margin-right: 30px;float: right;" size="small" :type="btType(task.isSub)"
              @click="switchs(task.isSub,task)">{{ task.isSub }}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tasks: {}
      }
    },
    created: function () {
      var _this = this;
      if (this.$store.state.user.userlevel == 0) {
        this.postRequest("/task/stunewzy", {
          sid: this.$store.state.user.id,
        }).then(resp => {
          if (resp && resp.status == 200) {
            _this.tasks = resp.data;
            console.log("最新作业");
            console.log(_this.tasks);
          }
        });
      }
    },
    methods:{
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