import request from '@/utils/request'

// 查询学生管理列表
export function listStudent(query) {
  return request({
    url: '/oj/student/list',
    method: 'get',
    params: query
  })
}

// 查询学生管理列表
export function listByLessonId(lessonId) {
  return request({
    url: `/oj/student/listByLessonId/${lessonId}`,
    method: 'get'
  })
}

// 查询学生管理详细
export function getStudent(studentId) {
  return request({
    url: '/oj/student/' + studentId,
    method: 'get'
  })
}

// 新增学生管理
export function addStudent(data) {
  return request({
    url: '/oj/student',
    method: 'post',
    data: data
  })
}

// 修改学生管理
export function updateStudent(data) {
  return request({
    url: '/oj/student',
    method: 'put',
    data: data
  })
}

// 删除学生管理
export function delStudent(studentId) {
  return request({
    url: '/oj/student/' + studentId,
    method: 'delete'
  })
}
