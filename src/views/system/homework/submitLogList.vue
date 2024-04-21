<template>
  <div>

    <el-card>
      <el-descriptions title="作业详情" :column="1" style="padding: 10px 20px">
        <el-descriptions-item label="作业名称">{{ homeworkDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="作业要求">{{ homeworkDetail.remark }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ homeworkDetail.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ homeworkDetail.endTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <h2>学生列表：</h2>
      <el-table v-loading="loading" :data="studentList">
        <el-table-column label="专业" align="center" prop="major"/>
        <el-table-column label="班级" align="center" prop="class"/>
        <el-table-column label="学生姓名" align="center" prop="name"/>
        <el-table-column label="学号" align="center" prop="no"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="'/system/correctPage/index/' + homeworkId + '/' +  scope.row.studentId" class="link-type">
              <el-link type="primary">查看</el-link>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>


</template>
<script>
import { getById } from '@/api/system/homework'
import { listByLessonId } from '@/api/oj/student'

export default {
  name: 'submitLogList',
  data() {
    return {
      studentList: [],
      homeworkId: this.$route.params.homeworkId,
      lessonId: this.$route.params.lessonId,
      homeworkDetail: {},
      questionList: [],
      loading: false,
      submitLogList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        homeworkId: this.$route.params.homeworkId,
        questionId: null,
        studentId: null
      }
    }
  },
  methods: {
    getQuestionListByHomeworkId() {
      getById(this.homeworkId).then(response => {
        this.homeworkDetail = response.data
        this.questionList = response.data.questionList
      })
    },
    listStudent() {
      listByLessonId(this.lessonId).then(response => {
        this.studentList = this.formatData(response)
        console.log(this.studentList)
      })
    },
    // 格式化数据函数
    formatData(rawData) {
      return rawData.map(classData => {
        const className = Object.keys(classData)[0]
        const students = classData[className].map(student => ({
          studentId: student.studentId,
          no: student.no,
          name: student.sysUser.nickName,
          class: className,
          major: student.major,
          remark: student.remark
        }))
        return students
      }).flat() // 使用 flat 方法将嵌套数组展平
    }

  },
  created() {
    this.getQuestionListByHomeworkId()
    this.listStudent()
  }
}

</script>

<style scoped>

</style>
