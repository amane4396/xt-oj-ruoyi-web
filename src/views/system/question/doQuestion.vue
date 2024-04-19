<template>

  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple" style="padding-left: 20px">
        <h4>题目描述 | 题解 | 提交记录</h4>
        <h1>{{question.name}}</h1>
        <el-tag>{{ question.remark }}</el-tag>

        <div style="height: 200px;margin-top: 40px">
          {{question.description}}
        </div>



        <div style="margin-top: 100px;line-height: 40px">
          课程题目：{{question.lesson.name}}
          <br>
          课程描述：{{question.lesson.description}}
          <br>
          备注：{{question.lesson.remark}}
        </div>

      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-light">

        <p>代码</p>

        <CodeEditor v-model="code" language="go"></CodeEditor>
        <br>
        <el-button type="primary" @click="submitCode"><i class="el-icon-caret-right" style="margin-right: 5px"></i>运行</el-button>
        <el-button type="primary"><i class="el-icon-upload" style="margin-right: 5px"></i>提交</el-button>
        <el-button @click="drawer = true" style="float: right;margin-right: 20px">
          提交记录
        </el-button>

        <el-drawer
            title="我是标题"
            :visible.sync="drawer"
            :with-header="false">
          <div style="padding-left: 20px;padding-top: 20px;height: 750px">
            <CodeEditor v-model="code" language="java"></CodeEditor>
          </div>
        </el-drawer>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion,submit } from '@/api/system/question'
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue'

export default {
  components: {
    CodeEditor
  },
  name: 'DoQuestion',
  data() {
    return {
      question: {},
      code:
      'class Solution {\n' +
          '    public static String solution(String str){\n' +
          '    return new StringBuilder(str).reverse().toString();\n' +
          '    }\n' +
          '    \n' +
          '    public static void main(String[] args\n' +
          '    {\n' +
          '    String s = "as";\n' +
          '    System.out.println(solution(s));\n' +
          '    }\n' +
          '}',
      drawer: false,

    }
  },
  created() {
    this.getQuestionById()
  },
  methods: {
    getQuestionById() {
      getQuestion(this.$route.params.questionId).then(response => {
        this.question = response.data
      })
    },
    submitCode() {
      const escapedCode = this.code.replace(/"/g, '\\"')
      console.log(escapedCode)
      submit({ code: escapedCode }).then(response => {
        console.log(response);
      }).catch(error => {
        console.error('提交代码时出错:', error);
      });

    }
  }
}

</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}


.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 500px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
