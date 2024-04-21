<template>
  <div>
    <el-card>
      <el-select v-model="questionId" placeholder="请选择题目" @change="handleChange">
        <el-option
          v-for="item in questionList"
          :key="item.questionId"
          :label="item.name"
          :value="item.questionId"
        >
        </el-option>
      </el-select>
    </el-card>
    <el-card v-for="(item,index) in submitLogs" :key="item.submitLogId">
      <el-descriptions title="提交详情" :column="1" style="padding: 10px 20px">
        <el-descriptions-item label="状态">
          <template slot-scope="">
            <el-tag v-if="item.status === '1'" type="success">通过</el-tag>
            <el-tag v-else-if="item.status === '2'" type="warning">样例未全部通过</el-tag>
            <el-tag v-else type="danger">编译失败</el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="通过样例数">{{ item.passNum }}</el-descriptions-item>
      </el-descriptions>
      <span>打分：</span>
      <el-input-number v-model="item.num" :step="1" :max="25" step-strictly></el-input-number>
      <el-button type="primary" @click="doSubmit(item.num,item.submitLogId)" style="margin-left: 30px">确定</el-button>
    </el-card>
    <el-divider/>
  </div>

</template>
<script>
import { list } from '@/api/system/submitLog'
import { addScore } from '@/api/system/score'
import { getQuestion } from '@/api/system/question'
import { getById } from '@/api/system/homework'

export default {
  name: 'correctPage',
  data() {
    return {
      studentDetail: {},
      submitLogs: [],
      questionList: [],
      studentId: this.$route.params.studentId,
      homeworkId: this.$route.params.homeworkId,
      questionId: null
    }
  },
  methods: {
    getList() {
      list({ studentId: this.studentId, homeworkId: this.homeworkId, questionId: this.questionId }).then(response => {
        this.submitLogs = response.rows
      })
    },
    doSubmit(num, submitLogId) {
      // 提交打分，保存打分记录
      addScore({ score: num, submitLogId: submitLogId }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '打分成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    getQuestionListByHomeworkId() {
      getById(this.$route.params.homeworkId).then(response => {
        this.questionList = response.data.questionList
      })
    },
    handleChange(e) {
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getQuestionListByHomeworkId()
  }
}

</script>

<style scoped>
</style>
