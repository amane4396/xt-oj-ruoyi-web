import request from '@/utils/request'

// 查询课程管理列表
export function listLesson(query) {
  return request({
    url: '/system/lesson/list',
    method: 'get',
    params: query
  })
}

// 查询课程管理列表
export function listAllLesson() {
  return request({
    url: '/system/lesson/listAllLesson',
    method: 'get',
  })
}

// 查询课程管理列表
export function listLessonByTeacher() {
  return request({
    url: '/system/lesson/getLessonByTeacherId',
    method: 'get',
  })
}

// 查询课程管理列表
export function getLessonByStudentId() {
  return request({
    url: '/system/lesson/getLessonByStudentId',
    method: 'get',
  })
}



// 查询课程管理详细
export function getLesson(lessonId) {
  return request({
    url: '/system/lesson/' + lessonId,
    method: 'get'
  })
}

// 新增课程管理
export function addLesson(data) {
  return request({
    url: '/system/lesson',
    method: 'post',
    data: data
  })
}

// 修改课程管理
export function updateLesson(data) {
  return request({
    url: '/system/lesson',
    method: 'put',
    data: data
  })
}

// 删除课程管理
export function delLesson(lessonId) {
  return request({
    url: '/system/lesson/' + lessonId,
    method: 'delete'
  })
}
