<template>
    <el-container id="container" style="overflow: scroll;height: 100%;">
        <!-- <div class='pdf-page'> -->


        <el-main v-loading="isLoading" element-loading-text="拼命转码中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <canvas id="the-canvas"></canvas>

        </el-main>
        <el-aside width="400px" style="float: right;">
            <div v-if='pdfDoc'>
                <!-- <button v-if="pageNum>1" @click="onPrevPage">上一页</button>
                <button v-if="pageNum<pdfDoc.numPages" @click="onNextPage">下一页</button> -->
                <el-pagination v-if="pdfDoc.numPages>1" layout="prev, pager, next" :total="pdfDoc.numPages" :page-size="1" :current-page="pageNum"
                    @current-change="pdfPageChange" />
            </div>
            <div>
                <el-button type="text" style="float: right;" @click="returnPre">
                    <i style="font-size:50px;" class="el-icon-close" />
                </el-button>
                <el-select v-model="selectFile" style="margin-left: 82px;width: 62%;margin-top: 21px;" @change="onChangeFile">
                    <el-option v-for="(item,index) in aFilesList" :key="index" :label="item.substring(item.lastIndexOf('/')+1)" :value="item"
                    />
                </el-select>

            </div>
            <span style="clear:both" />
            <el-form label-width="70px" style="margin-top: 25px;margin-left: 22px;color: white;">
                <el-form-item class="upput_msg" label="学生留言" style="margin-right: 55px;">
                    <el-input type="textarea" v-model="stuZuoye.content" :autosize="{ minRows: 2, maxRows: 6 }" :disabled="true" placeholder="无"></el-input>
                </el-form-item>
                <el-form-item class="upput_msg" label="老师评语" style="margin-right: 55px;">
                    <el-input type="textarea" v-model="stuZuoye.comment" :autosize="{ minRows: 5, maxRows: 13 }" placeholder="点击添加评论（仅该作业的学生可看）..."></el-input>
                </el-form-item>
            </el-form>
            <el-button style="margin-right: 55px;margin-bottom : 35px;float: right;" size="mini" type="success" plain @click="submitPg">{{(stuZuoye.isPg==0) ? '提交':'更改批改'}}</el-button>
            <el-select size="mini" v-model="stuZuoye.score" style="margin-right: 10px;margin-bottom : 35px;float: right;width: 70px;">
                <el-option v-for="(item,index) in pgSelect" :key="index" :label="item" :value="item" />
            </el-select>
        </el-aside>

        <!-- </div> -->
    </el-container>
</template>
<script>  
    import PDFJS from 'pdfjs-dist'

    export default {
        data() {
            return {
                pdfDoc: null,
                pageNum: 1,
                pageRendering: false,
                pageNumPending: null,
                scale: 1.763,
                isLoading: true,
                stuZuoye: {},
                aFilesList: [],
                selectFile: '',
                pgSelect: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', '阅'],
            }
        },
        created: function () {
            var _this = this;
            this.postRequest("/szy/getById", {
                sw_id: this.$route.query.stuZuoyeId,
            }).then(resp => {
                if (resp && resp.status == 200 && resp.data != "") {
                    _this.stuZuoye = resp.data;
                    let fls = _this.stuZuoye.files_links.split('|');
                    _this.aFilesList = [];
                    for (let fl in fls) {
                        let ffl = fls[fl].substring(fls[fl].lastIndexOf('.'));
                        if (ffl == '.doc' || ffl == '.docx' || ffl == '.xls' || ffl == '.xlsx' || ffl == '.ppt' || ffl == '.pptx' || ffl == '.pdf') {
                            _this.aFilesList.push(fls[fl]);
                        }
                    }
                    _this.selectFile = fls[_this.$route.query.index];
                    if (_this.selectFile.length > 0 && (_this.selectFile.substring(_this.selectFile.lastIndexOf('.')) == '.pdf')) {
                        _this.showPDF(_this.selectFile);
                    } else if (_this.selectFile.length > 0) {
                        _this.showPDF('http://localhost:8089/files/getfiletopdf/' + _this.selectFile.substring(_this.selectFile.lastIndexOf("/") + 1));
                    }
                }
            });
            //this.showPDF('http://localhost:8089/files/get/241993_240093.pdf');
        },
        methods: {
            onChangeFile: function () {
                if ((this.selectFile.substring(this.selectFile.lastIndexOf('.'))) == '.pdf') {
                    this.showPDF(this.selectFile);
                } else {
                    this.showPDF('http://localhost:8089/files/getfiletopdf/' + this.selectFile.substring(this.selectFile.lastIndexOf('/') + 1));
                }

            },

            submitPg: function () {
                var _this = this;
                var _type = this.stuZuoye.isPg;
                console.log
                if (this.stuZuoye.tassk.course.teacher.id == this.$store.state.user.id) {
                    this.postRequest("/szy/tchPgOne", {
                        tid: this.$store.state.user.id,
                        sw_id: this.stuZuoye.id,
                        comment: this.stuZuoye.comment,
                        score: this.stuZuoye.score
                    }).then(resp => {
                        if (resp && resp.status == 200 && resp.data != "") {
                            if (resp.data == "你无权批改此作业") {
                                this.$notify.error({
                                    title: '批改失败',
                                    message: "你无权批改此作业"
                                });
                            } else {
                                _this.stuZuoyes = resp.data;
                                _this.$notify({
                                    title: "成功",
                                    message: _type == 1 ? "作业已更新批改" : "批改成功",
                                    type: "success",
                                    position: 'bottom-right'
                                });
                            }
                        }
                    });
                }
            },

            showPDF(url) {
                let _this = this
                this.isLoading = true;
                PDFJS.getDocument(url).then(function (pdf) {
                    _this.pdfDoc = pdf
                    _this.renderPage(1)
                    _this.isLoading = false;

                })
            },
            renderPage(num) {
                this.pageRendering = true
                let _this = this
                this.pdfDoc.getPage(num).then(function (page) {
                    var viewport = page.getViewport(_this.scale)
                    let canvas = document.getElementById('the-canvas')
                    let _div = document.getElementById('container')
                    canvas.height = viewport.height
                    //canvas.height = _div.height
                    canvas.width = viewport.width

                    // Render PDF page into canvas context  
                    var renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: viewport
                    }
                    var renderTask = page.render(renderContext)

                    // Wait for rendering to finish  
                    renderTask.promise.then(function () {
                        _this.pageRendering = false
                        if (_this.pageNumPending !== null) {
                            // New page rendering is pending  
                            this.renderPage(_this.pageNumPending)
                            _this.pageNumPending = null
                        }
                    })
                })
            },
            queueRenderPage(num) {
                if (this.pageRendering) {
                    this.pageNumPending = num
                } else {
                    this.renderPage(num)
                }
            },
            pdfPageChange: function (e) {
                this.pageNum = e;
                this.queueRenderPage(this.pageNum)
            },
            onPrevPage() {
                if (this.pageNum <= 1) {
                    return
                }
                this.pageNum--
                this.queueRenderPage(this.pageNum)
            },
            onNextPage() {
                if (this.pageNum >= this.pdfDoc.numPages) {
                    return
                }
                this.pageNum++
                this.queueRenderPage(this.pageNum)
            },
            returnPre: function () {
                this.$router.push({ path: '/tzydetails', query: { taskId: this.stuZuoye.tassk.id } })
            }
        }
    }  
</script>

<style>
    #container {
        background-color: rgba(0, 0, 0, 0.75);
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        text-align: center;
        padding: 5px;
    }

    .pdf-page {}

    .foot {
        position: fixed;
        transform: translate(-50%, 0);
        left: 50%;
    }
</style>

<style lang="scss">
    .upput_msg {
        label {
            color: white;
        }
    }
</style>