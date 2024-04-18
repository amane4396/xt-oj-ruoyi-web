<template>
  <h1>{{question}}</h1>
</template>

<script>
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion } from '@/api/system/question'

export default {
  name: 'DoQuestion',
  data() {
    return {
      question: {}

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
    }
  }
}
</script>


<style scoped>

</style>
