import React, { Component } from 'react'
import { Button, Form, Input } from '@alifd/next'

import FormItem from '@comp/FormItem'
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

class Detail extends Component {
	constructor(props) {
		super(props)

		this.state = {
			body: {
				title: '',
				description: ''
			}
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
		let { body } = this.state
		video.create(body).then(res => {
			toRoute.bind(this, '/video')
		})
	}
	render() {
		const { body } = this.state
		return (
			<Form {...formItemLayout} style={{ width: 500 }}>
				<FormItem label="视频名称" required>
					<Input value={body.title} placeholder="请输入" onChange={val => this.update('title', val)} />
				</FormItem>

				<FormItem label="描述" required>
					<TextArea value={body.description} maxLength={20} hasLimitHint placeholder="请输入" onChange={val => this.update('description', val)} />
				</FormItem>

				<FormItem wrapperCol={{ offset: 6 }} >
					<Button type="primary" onClick={this.submit} style={{marginRight: 10}}>提交</Button>
					<Button onClick={toRoute.bind(this, '/video')}>返回</Button>
				</FormItem>
			</Form>
		)
	}
}

export default Detail
