import request from '@/utils/request'

// 查询teacher列表
export function listTeacher(query) {
  return request({
    url: '/oj/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询teacher详细
export function getTeacher(teacherId) {
  return request({
    url: '/oj/teacher/' + teacherId,
    method: 'get'
  })
}

// 新增teacher
export function addTeacher(data) {
  return request({
    url: '/oj/teacher',
    method: 'post',
    data: data
  })
}

// 修改teacher
export function updateTeacher(data) {
  return request({
    url: '/oj/teacher',
    method: 'put',
    data: data
  })
}

// 删除teacher
export function delTeacher(teacherId) {
  return request({
    url: '/oj/teacher/' + teacherId,
    method: 'delete'
  })
}
