<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="题目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入题目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="题目难度等级" prop="difficultyLevel">
        <el-input
          v-model="queryParams.difficultyLevel"
          placeholder="请输入题目难度等级"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:question:add']"
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
          v-hasPermi="['system:question:edit']"
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
          v-hasPermi="['system:question:remove']"
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
          v-hasPermi="['system:question:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="题目id" align="center" prop="questionId"/>
      <el-table-column label="题目名称" align="center" prop="name"/>
      <el-table-column label="题目描述" align="center" prop="description"/>
      <el-table-column label="模板内容" align="center" prop="template"/>
      <el-table-column label="题目难度等级" align="center" prop="difficultyLevel">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.difficultyLevel === 'easy'">简单</el-tag>
          <el-tag type="warning" v-else-if="scope.row.difficultyLevel === 'middle'">中等</el-tag>
          <el-tag type="danger" v-else>困难</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属题目" align="center" prop="lesson.name">
        <template slot-scope="scope">
          <el-link type="primary" @click="">{{scope.row.lesson.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:question:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:question:remove']"
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

    <!-- 添加或修改题目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入题目名称"/>
        </el-form-item>
        <el-form-item label="题目描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="模板内容" prop="template">
          <el-input v-model="form.template" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="难度等级" prop="difficultyLevel">
          <el-select v-model="form.difficultyLevel" placeholder="请选择题目难度等级">
            <el-option
              v-for="dict in dict.type.question_difficulty_level"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属课程" prop="lessonIds">
          <el-select v-model="form.lessonId" placeholder="请选择所属课程">
            <el-option v-for="(item) in lessonList" :label="item.name" :value="item.lessonId"
                       :key="item.lessonId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion } from '@/api/system/question'
import { listAllLesson } from '@/api/system/lesson'

export default {
  dicts: ['question_difficulty_level'],
  name: 'Question',
  data() {
    return {
      lessonList: [],
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
      // 题目管理表格数据
      questionList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        description: null,
        template: null,
        difficultyLevel: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
    this.getAllLesson()
  },
  methods: {
    getAllLesson() {
      listAllLesson().then(response => {
        this.lessonList = response
      })
    },
    /** 查询题目管理列表 */
    getList() {
      this.loading = true
      listQuestion(this.queryParams).then(response => {
        this.questionList = response.rows
        this.total = response.total
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
        questionId: null,
        name: null,
        description: null,
        template: null,
        difficultyLevel: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.ids = selection.map(item => item.questionId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加题目管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const questionId = row.questionId || this.ids
      getQuestion(questionId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改题目管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.questionId != null) {
            updateQuestion(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addQuestion(this.form).then(response => {
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
      const questionIds = row.questionId || this.ids
      this.$modal.confirm('是否确认删除题目管理编号为"' + questionIds + '"的数据项？').then(function() {
        return delQuestion(questionIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/question/export', {
        ...this.queryParams
      }, `question_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
