import request from '@/utils/request'

// 查询提交记录
export function listByQuestionId(questionId) {
  return request({
    url: '/system/submitLog/listByQuestionId/' + questionId,
    method: 'get'
  })
}

export function listByHomeworkId(homeworkId) {
  return request({
    url: '/system/submitLog/listByHomeworkId/' + homeworkId,
    method: 'get'
  })
}


export function list(data) {
  return request({
    url: '/system/submitLog/list',
    method: 'post',
    data: data
  })
}


export function listForStu(data) {
  return request({
    url: '/system/submitLog/listForStu',
    method: 'post',
    data: data
  })
}

