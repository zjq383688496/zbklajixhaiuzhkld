import React, { Component } from 'react'
import { Button, Form, Input } from '@alifd/next'

import FormItem from '@comp/FormItem'
import Upload   from '@comp/Upload'
import { video } from '@server'

// import './index.less'

const { random } = Math
const { TextArea } = Input

const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 14
	}
}

export default class VideoAdd extends Component {
	constructor(props) {
		super(props)

		let {
			initData = {
				title: '',
				description: ''
			}
		} = props
		this.state = {
			body: initData
		}
	}
	componentDidMount() {
	}
	componentDidUpdate(prevProps, prevState) {
	}
	update = (key, value) => {
		let { body } = this.state
		body[key] = value
		this.setState({ body })
	}
	submit = () => {
		let { body } = this.state,
			{ id } = body,
			API = video[id? 'update': 'create']

		API(body).then(res => {
			toRoute.bind(this, '/video')()
		})
	}
	onResult = data => {
		console.log(data)
	}
	renderUpload = () => {
		let { id, title, description, status } = this.state.body,
			dom
		if (!id) return null
		switch (status) {
			case 1:
			case 3:
			case 4:
				dom = <Upload params={{id}} max={3e9} accept={'.mp4,.mkv,.avi,.mov'} onResult={this.onResult}/>
				break
			case 2:
				dom = '审核中...'
				break
			default:
				dom = null
		}
		return dom
	}
	render() {
		let { body } = this.state,
			{ id, title, description, status } = body,
			uploadDom = this.renderUpload()

		return (
			<Form {...formItemLayout} style={{ width: 500 }}>
				<FormItem label="视频名称" required>
					<Input value={title} placeholder="请输入" onChange={val => this.update('title', val)} />
				</FormItem>

				<FormItem label="描述" required>
					<TextArea value={description} maxLength={20} hasLimitHint placeholder="请输入" onChange={val => this.update('description', val)} />
				</FormItem>

				{ uploadDom }

				<FormItem wrapperCol={{ offset: 6 }} >
					<Button type="primary" onClick={this.submit} style={{marginRight: 10}}>提交</Button>
					<Button onClick={toRoute.bind(this, '/video')}>返回</Button>
				</FormItem>
			</Form>
		)
	}
}
