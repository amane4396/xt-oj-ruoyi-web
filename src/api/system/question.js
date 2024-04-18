import request from '@/utils/request'

// 查询题目管理列表
export function listQuestion(query) {
  return request({
    url: '/system/question/list',
    method: 'get',
    params: query
  })
}

// 根据课程id查询题目列表
export function selectOjQuestionListByLessonId(lessonId) {
  return request({
    url: '/system/question/selectOjQuestionListByLessonId/' + lessonId,
    method: 'get'
  })
}

// 查询题目管理列表
export function listAllQuestion() {
  return request({
    url: '/system/question/listAllQuestion',
    method: 'get'
  })
}

// 查询题目管理详细
export function getQuestion(questionId) {
  return request({
    url: '/system/question/' + questionId,
    method: 'get'
  })
}

// 新增题目管理
export function addQuestion(data) {
  return request({
    url: '/system/question',
    method: 'post',
    data: data
  })
}

// 修改题目管理
export function updateQuestion(data) {
  return request({
    url: '/system/question',
    method: 'put',
    data: data
  })
}

// 删除题目管理
export function delQuestion(questionId) {
  return request({
    url: '/system/question/' + questionId,
    method: 'delete'
  })
}
