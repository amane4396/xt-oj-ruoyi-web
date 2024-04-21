import request from '@/utils/request'

// 查询题目批改得分列表
export function listScore(query) {
  return request({
    url: '/system/score/list',
    method: 'get',
    params: query
  })
}

// 查询题目批改得分详细
export function getScore(scoreId) {
  return request({
    url: '/system/score/' + scoreId,
    method: 'get'
  })
}

// 新增题目批改得分
export function addScore(data) {
  return request({
    url: '/system/score',
    method: 'post',
    data: data
  })
}

// 修改题目批改得分
export function updateScore(data) {
  return request({
    url: '/system/score',
    method: 'put',
    data: data
  })
}

// 删除题目批改得分
export function delScore(scoreId) {
  return request({
    url: '/system/score/' + scoreId,
    method: 'delete'
  })
}
