<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple" style="padding-left: 20px">
          <h4>题目描述 | 题解 | 提交记录</h4>
          <h1>{{ question.name }}</h1>
          <el-tag>{{ question.remark }}</el-tag>

          <div style="height: 200px;margin-top: 40px">
            {{ question.description }}
          </div>


          <div style="margin-top: 100px;line-height: 40px">
            课程题目：{{ question.lesson.name }}
            <br>
            课程描述：{{ question.lesson.description }}
            <br>
            备注：{{ question.lesson.remark }}
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <!--调用子组件-->
          <CodeEditor
            ref="monaco"
            :opts="opts"
            @change="changeValue"
            :height="600"
          ></CodeEditor>
        </div>
        <el-divider></el-divider>
        <el-button @click="runCode"><i class="el-icon-caret-right" style="margin-right: 5px"></i>运行
        </el-button>
        <el-button type="primary" @click="doSubmit"><i class="el-icon-upload2" style="margin-right: 5px"></i>提交
        </el-button>
        <el-button type="info" @click="listSubmitLogs"><i class="el-icon-s-unfold" style="margin-right: 5px"></i>查看提交记录
        </el-button>
        <el-divider></el-divider>
        <el-descriptions v-show="result" class="margin-top" title="运行结果" :column="1" border>
          <el-descriptions-item :labelStyle="{width: '30%'}">
            <template slot="label">
              Result：
            </template>
            {{ result }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

    </el-row>
    <el-drawer
      title="提交记录"
      :visible.sync="submitLogsDrawer"
      direction="rtl"
      size="40%"
    >
      <el-table
        :data="submitLogs"
        style="padding: 0 20px"
      >
        <el-table-column
          prop="createTime"
          label="提交时间"
        >
        </el-table-column>
        <el-table-column
          label="语言"
        >
          <el-tag type="info">Java</el-tag>
        </el-table-column>
        <el-table-column
          prop="runTime"
          label="运行时间"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="当前状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '1'" type="success">通过</el-tag>
            <el-tag v-else-if="scope.row.status === '2'" type="warning">样例未全部通过</el-tag>
            <el-tag v-else type="danger">编译失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="1000"
              trigger="click"
            >
              <el-input type="textarea" v-model="scope.row.code" :rows="10"></el-input>
              <el-button slot="reference">查看代码</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>


</template>

<script>
import {
  getQuestion,
  runCode,
  submit
} from '@/api/system/question'
import { listByQuestionId, list, listForStu } from '@/api/system/submitLog'
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue'

export default {
  components: {
    CodeEditor
  },
  name: 'DoQuestion',
  data() {
    return {
      submitLogsDrawer: false,
      question: {},
      drawer: false,
      sets: {
        language: {
          'apex': 'apex',
          'azcli': 'azcli',
          'bat': 'bat',
          'c': 'c',
          'clojure': 'clojure',
          'coffeescript': 'coffeescript',
          'cpp': 'cpp',
          'csharp': 'csharp',
          'csp': 'csp',
          'css': 'css',
          'dockerfile': 'dockerfile',
          'fsharp': 'fsharp',
          'go': 'go',
          'graphql': 'graphql',
          'handlebars': 'handlebars',
          'html': 'html',
          'ini': 'ini',
          'java': 'java',
          'javascript': 'javascript',
          'json': 'json',
          'kotlin': 'kotlin',
          'less': 'less',
          'lua': 'lua',
          'markdown': 'markdown',
          'msdax': 'msdax',
          'mysql': 'mysql',
          'objective-c': 'objective-c',
          'pascal': 'pascal',
          'perl': 'perl',
          'pgsql': 'pgsql',
          'php': 'php',
          'plaintext': 'plaintext',
          'postiats': 'postiats',
          'powerquery': 'powerquery',
          'powershell': 'powershell',
          'pug': 'pug',
          'python': 'python',
          'r': 'r',
          'razor': 'razor',
          'redis': 'redis',
          'redshift': 'redshift',
          'ruby': 'ruby',
          'rust': 'rust',
          'sb': 'sb',
          'scheme': 'scheme',
          'scss': 'scss',
          'shell': 'shell',
          'sol': 'sol',
          'sql': 'sql',
          'st': 'st',
          'swift': 'swift',
          'tcl': 'tcl',
          'typescript': 'typescript',
          'vb': 'vb',
          'xml': 'xml',
          'yaml': 'yaml'
        },
        theme: {
          'vs': 'vs',
          'vs-dark': 'vs-dark',
          'hc-black': 'hc-black'
        }
      },
      opts: {
        value: '',
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-dark' // 编辑器主题
      },
      opts2: {
        value: '2323',
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-dark' // 编辑器主题
      },
      result: null,
      submitForm: {
        code: null,
        questionId: null
      },
      questionId: null,
      homeworkId: null,
      submitLogs: [],
      prettierOptions: {
        // prettier options here, e.g.:
        semi: false,
        singleQuote: true
        // more options...
      }
    }
  },
  created() {
    this.questionId = this.$route.params.questionId
    this.homeworkId = this.$route.params.homeworkId
    this.getQuestionById()
  },
  methods: {
    checkCode(code) {
      this.$set(this.opts2, 'value', code)
    },
    // 手动获取值
    getValue() {
      this.$message.info('代码已输出至控制台')
      console.log('输出代码:' + this.$refs.monaco.getVal())
    },
    // 内容改变自动获取值
    changeValue(val) {
      console.log(val)
    },
    getQuestionById() {
      getQuestion(this.$route.params.questionId).then(response => {
        this.question = response.data
      })
    },
    // 运行代码
    runCode() {
      runCode({ code: this.$refs.monaco.getVal() }).then(res => {
        if (res.code === 200) {
          this.result = res.msg
          this.$message({
            message: '代码运行成功',
            type: 'success'
          })
        }
      }).catch(error => {
        this.$message({
          message: '代码运行异常',
          type: 'danger'
        })
      })
    },
    // 提交代码
    doSubmit() {
      this.submitForm.code = this.$refs.monaco.getVal()
      this.submitForm.questionId = this.questionId
      this.submitForm.homeworkId = this.homeworkId
      submit(this.submitForm).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        }
      }).catch((err) => {
        this.$message({
          message: '提交失败',
          type: 'danger'
        })
      })
    },
    // 查看提交记录
    listSubmitLogs() {
      this.submitLogsDrawer = true
      listForStu({ questionId: this.questionId, homeworkId: this.homeworkId }).then((res) => {
        console.log(res)
        this.submitLogs = res.data
      }).catch((err) => {
      })
    }

  }
}

</script>


<style scoped>

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 500px;
}

</style>
