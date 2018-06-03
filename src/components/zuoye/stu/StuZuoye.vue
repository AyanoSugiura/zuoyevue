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

    <el-card v-for="(task,index) in tasks" :key="index" style=" margin-left: 10%;margin-right: 8%; width: 75%;; margin-top:20px ">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="10">
            <span>
              <router-link v-if="$store.state.user.userlevel==0" style="text-decoration:none" :to="{ name: 'SZyDetails', query: { taskId: task.id }}">
                <h3 class="work-title">{{task.title}}</h3>
              </router-link>
            </span>
          </el-col>
          <el-col :span="6">
            <router-link :to="{ name: 'CourseDetails', query: { courseId: task.course.id }}">
              <h3 class="work-title">{{task.course.name}}</h3>
            </router-link>
          </el-col>
          <el-col :span="8">
            <el-button v-if="$store.state.user.userlevel==0" style="margin-right: 30px;float: right;" size="small" :type="btType(task.isSub)"
              @click="switchs(task.isSub,task)">{{ task.isSub }}</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="word">
        <div class="pr">{{task.content}}</div>
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
    methods: {
      btType: function (type) {
        if (type == "未提交") return "warning";
        else if (type == "已批改") return "success";
        else if (type == "未批改") return "info";
      },
      switchs: function (type, task) {
        console.log(task.title);
        this.$router.push({ name: 'SZyDetails', query: { taskId: task.id, taskTitle: task.title, stuStatus: type } });
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