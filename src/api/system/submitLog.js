import request from '@/utils/request'

// 查询提交记录
export function listByQuestionId(questionId) {
  return request({
    url: '/system/submitLog/listByQuestionId/' + questionId,
    method: 'get'
  })
}
