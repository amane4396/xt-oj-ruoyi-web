<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card style="margin-right: 20px">
          <div slot="header" class="clearfix">
            <h1>当前课程：{{ lessonDetail.name }}</h1>
          </div>
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                   label-width="68px"
          >
            <el-form-item label="作业名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入作业名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                              v-model="queryParams.startTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择开始时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                              v-model="queryParams.endTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
              >修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="homeworkList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
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
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
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
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h1>学生列表</h1>
          <el-tree
            :props="defaultProps"
            :data="classStuTree"
          >
          </el-tree>
        </el-card>
      </el-col>
    </el-row>


    <!-- 添加或修改作业管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="作业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入作业名称"/>
        </el-form-item>
        <el-form-item label="要求" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="课程" prop="lessonId">
          <el-input v-model="lessonDetail.name" disabled placeholder="当前课程"/>
        </el-form-item>
        <el-form-item label="题目" prop="questionIds">
          <el-select v-model="form.questionIds" multiple placeholder="请添加题目">
            <el-option
              v-for="item in questionList"
              :key="item.questionId"
              :label="item.name"
              :value="item.questionId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
                          v-model="form.startTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
                          v-model="form.endTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
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
  listHomeworkByLessonId
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
    this.getAllQuestions()
    this.getClassStuTree()
  },
  methods: {
    transformData(data) {
      let transformedData = []
      data.forEach(classData => {
        for (let className in classData) {
          let classInfo = {
            label: className,
            children: []
          }
          classData[className].forEach(student => {
            classInfo.children.push({
              label: student.sysUser.nickName || '未知姓名'
            })
          })
          transformedData.push(classInfo)
        }
      })
      return transformedData
    },
    getClassStuTree() {
      listByLessonId(this.lessonId).then(response => {
        this.classStuTree = this.transformData(response)
        console.log(this.classStuTree)
      })
    },
    getAllQuestions() {
      listAllQuestion().then(response => {
        this.questionList = response
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
