var { hostname } = window.location
var baseUrl = `http://${hostname}:4090/admin/videos`
module.exports = {
	// 获取列表
	list: config => Fetch.get(`${baseUrl}`, config),

	// 新建
	create: config => Fetch.post(`${baseUrl}`, config),

	// 编辑
	update: config => Fetch.post(`${baseUrl}/${config.id}`, config),

	// 查看详情
	detail: id => Fetch.get(`${baseUrl}/${id}`),

	upload: (file, config, onProgress) => Fetch.postFile(`${baseUrl}/upload`, file, config, onProgress)
	// 删除
	// delete: config => Fetch.delete(`${baseUrl}`, config),
}