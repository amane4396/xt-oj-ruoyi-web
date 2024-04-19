import request from '@/utils/request'

// 查询作业管理列表
export function listHomework(query) {
  return request({
    url: '/system/homework/list',
    method: 'get',
    params: query
  })
}

// 根据课程id查询所有作业
export function listHomeworkByLessonId(lessonId) {
  return request({
    url: `/system/homework/listByLessonId/${lessonId}`,
    method: 'get',
  })
}

// 查询作业管理详细
export function getHomework(homeworkId) {
  return request({
    url: '/system/homework/' + homeworkId,
    method: 'get'
  })
}

// 新增作业管理
export function addHomework(data) {
  return request({
    url: '/system/homework',
    method: 'post',
    data: data
  })
}

// 修改作业管理
export function updateHomework(data) {
  return request({
    url: '/system/homework',
    method: 'put',
    data: data
  })
}

// 删除作业管理
export function delHomework(homeworkId) {
  return request({
    url: '/system/homework/' + homeworkId,
    method: 'delete'
  })
}
