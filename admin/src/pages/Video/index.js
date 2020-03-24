import React from 'react'
import { Button, Table } from '@alifd/next'
const { Column: TableColumn } = Table

const statusMap = {
	0: '冻结',
	1: '未上传',
	2: '审核中',
	3: '审核成功',
	4: '审核失败',
}

export default class Video extends React.Component {
	constructor(props) {
		super(props)
		let { initData } = props
		this.state = {
			list: initData
		}
	}
	componentWillMount() {
	}
	control = (value, index, record) => {
		let { id } = record
		return [
			<Button key={0} onClick={toRoute.bind(this, `/video/edit/${id}`)}>编辑</Button>,
			<Button key={1} onClick={toRoute.bind(this, `/video/detail/${id}`)}>查看</Button>,
			<Button key={2} onClick={e => this.delete(id)}>删除</Button>,
		]
	}
	status = (value, index, record) => {
		let { status } = record
		return <span>资源{statusMap[status]}</span>
	}
	render() {
		let { list } = this.state
		return (
			<div>
				<Button type="primary" onClick={toRoute.bind(this, '/video/add')}>上传视频</Button>
				<br /><br />
				<Table dataSource={list}>
					<TableColumn title="ID" dataIndex="id"/>
					<TableColumn title="标题" dataIndex="title"/>
					<TableColumn title="描述" dataIndex="description"/>
					<TableColumn title="状态" cell={this.status}/>
					<TableColumn title="操作" cell={this.control}/>
				</Table>
			</div>
		)
	}
}