<template>
  <div class="app-container">
    <div slot="header" class="clearfix">
      <h1>当前课程：{{ lessonDetail.name }}</h1>
    </div>
    <h2>作业列表：</h2>
    <el-table v-loading="loading" :data="homeworkList" @selection-change="handleSelectionChange">
      <el-table-column label="作业名称" align="center" prop="name"/>
      <el-table-column label="要求" align="center" prop="remark"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 0">未开始</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status === 1">进行中</el-tag>
          <el-tag type="danger" v-else>已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-link type="primary" @click="checkHomework(scope.row)">查看作业</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看作业详情 -->
    <el-dialog
      title="作业详情"
      :visible.sync="open"
      width="30%"
    >
      <el-descriptions border :column="1" :label-style="{width: '30%'}">
        <el-descriptions-item label="作业名称">{{ homeWorkDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="作业要求">{{ homeWorkDetail.remark }}</el-descriptions-item>
        <el-descriptions-item label="作业状态">
          <el-tag type="success" v-if="homeWorkDetail.status === 0">未开始</el-tag>
          <el-tag type="warning" v-else-if="homeWorkDetail.status === 1">进行中</el-tag>
          <el-tag type="danger" v-else>已结束</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ homeWorkDetail.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ homeWorkDetail.endTime }}</el-descriptions-item>
      </el-descriptions>
      <h3>题目列表</h3>
      <el-table border style="margin-top: 10px" v-loading="loading" :data="homeWorkDetail.questionList" @selection-change="handleSelectionChange">
        <el-table-column label="题目名称" align="center" prop="name"/>
        <el-table-column label="题目难度等级" align="center" prop="difficultyLevel">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.difficultyLevel === 'easy'">简单</el-tag>
            <el-tag type="warning" v-else-if="scope.row.difficultyLevel === 'middle'">中等</el-tag>
            <el-tag type="danger" v-else>困难</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <router-link :to="'/system/doQuestion/index/' + scope.row.questionId" class="link-type">
              <el-link type="primary">做题</el-link>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="open = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  listQuestion,
  getQuestion,
  delQuestion,
  addQuestion,
  updateQuestion,
  selectOjQuestionListByLessonId,
  listAllQuestion
} from '@/api/system/question'
import { listLesson, getLesson } from '@/api/system/lesson'
import { listByLessonId } from '@/api/oj/student'
import {
  listHomework,
  getHomework,
  delHomework,
  addHomework,
  updateHomework,
  listHomeworkByLessonId,
  getById
} from '@/api/system/homework'

export default {
  dicts: ['question_difficulty_level'],
  name: 'Question',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      homeWorkDetail: {},
      classStuTree: [],
      lessonId: null,
      lessonDetail: [],
      questionList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 作业管理表格数据
      homeworkList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        lessonId: null,
        teacherId: null,
        questionIds: null,
        status: null,
        startTime: null,
        endTime: null
      },
      lessonQueryParams: {
        pageNum: 1,
        pageSize: 10,
        lessonId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.lessonId = this.$route.params.lessonId
    this.form.lessonId = this.$route.params.lessonId
    this.getList()
    this.getNowLesson(this.lessonId)
  },
  methods: {
    checkHomework(row) {
      this.open = true
      getById(row.homeworkId).then(response => {
        console.log(response)
        this.homeWorkDetail = response.data
      })
    },
    getNowLesson(lessonId) {
      getLesson(lessonId).then(response => {
        this.lessonDetail = response.data
      })
    },
    /** 根据当前课程查询作业列表 */
    getList() {
      this.loading = true
      listHomeworkByLessonId(this.lessonId).then(response => {
        this.homeworkList = response.data
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        homeworkId: null,
        name: null,
        remark: null,
        lessonId: null,
        teacherId: null,
        questionIds: null,
        status: null,
        startTime: null,
        endTime: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.homeworkId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加作业管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const homeworkId = row.homeworkId || this.ids
      getHomework(homeworkId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改作业管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let reqData = this.form
          reqData.lessonId = this.lessonId
          reqData.questionIds = this.form.questionIds.join(',')
          if (this.form.homeworkId != null) {
            updateHomework(reqData).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addHomework(reqData).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const homeworkIds = row.homeworkId || this.ids
      this.$modal.confirm('是否确认删除作业管理编号为"' + homeworkIds + '"的数据项？').then(function() {
        return delHomework(homeworkIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/homework/export', {
        ...this.queryParams
      }, `homework_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
