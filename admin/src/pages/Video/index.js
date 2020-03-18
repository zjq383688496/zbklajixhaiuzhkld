import React from 'react'
import { Button, Table } from '@alifd/next'
const { Column: TableColumn } = Table


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
	render() {
		let { list } = this.state
		return (
			<div>
				<Button type="primary" onClick={toRoute.bind(this, '/video/add')}>上传视频</Button>
				<br /><br />
				<Table dataSource={list}>
					<TableColumn title="id" dataIndex="id"/>
					<TableColumn title="title" dataIndex="title"/>
					<TableColumn title="description" dataIndex="description"/>
					<TableColumn cell={this.control}/>
				</Table>
			</div>
		)
	}
}