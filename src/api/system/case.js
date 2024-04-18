import request from '@/utils/request'

// 查询题目样例列表
export function listCase(query) {
  return request({
    url: '/system/case/list',
    method: 'get',
    params: query
  })
}

// 查询题目样例详细
export function getCase(caseId) {
  return request({
    url: '/system/case/' + caseId,
    method: 'get'
  })
}

// 新增题目样例
export function addCase(data) {
  return request({
    url: '/system/case',
    method: 'post',
    data: data
  })
}

// 修改题目样例
export function updateCase(data) {
  return request({
    url: '/system/case',
    method: 'put',
    data: data
  })
}

// 删除题目样例
export function delCase(caseId) {
  return request({
    url: '/system/case/' + caseId,
    method: 'delete'
  })
}
