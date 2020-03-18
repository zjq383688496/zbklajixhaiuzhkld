import React, { Component } from 'react'
import { Button, Form, Input, Radio, Tag } from '@alifd/next'

import Upload from '@component/Upload'

import './index.less'

const { random } = Math
const {
	Item:   FormItem,
	Error:  FormError,
	Submit: FormSubmit,
	Reset:  FormReset,
} = Form
const {
	Group: TagGroup,
	Closeable: CloseableTag,
	Selectable: SelectableTag
}   = Tag
const { Group: RadioGroup } = Radio
const { TextArea } = Input


import channels from '../channels'
import tags     from '../tags'

const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 14
	}
}

class Video extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	componentDidUpdate(prevProps, prevState) {
	}
	userExists = (rule, value) => {
		return new Promise((resolve, reject) => {
			if (!value) {
				resolve()
			} else {
				setTimeout(() => {
					if (value === 'frank') {
						reject([new Error('Sorry, this username is already exist.')])
					} else {
						resolve()
					}
				}, 500)
			}
		})
	}
	routeTo = url => {
		return e => {
			e.preventDefault()
			this.props.history.push(url)
		}
	}
	render() {
		// const { loading } = this.state

		return (
			<Form {...formItemLayout}>
				<FormItem label="频道">
					<RadioGroup name="channel" defaultValue={0}>
						{
							channels.map(({ name, key }) => <Radio key={key} value={key}>{name}</Radio>)
						}
					</RadioGroup>
				</FormItem>
				<FormItem label="标签">
					<TagGroup name="tag" defaultValue={''}>
						{
							tags.map(tag => <SelectableTag key={tag} type="normal">{tag}</SelectableTag>)
						}
					</TagGroup>
					<Input
						placeholder="添加新标签"
						hasClear
						maxLength={20}
						hasLimitHint style={{width: 300}}
						className="my-input-class"
					/>
				</FormItem>
				<FormItem
					label="视频名称:"
					hasFeedback
					requiredTrigger="onBlur"
					validator={this.userExists}
					help=""
				>
					<Input placeholder="请输入" name="valUsername" />
					<FormError name="valUsername" >
						{ (errors, state) => state === 'loading'? 'loading...': errors }
					</FormError>
				</FormItem>

				<FormItem
					label="描述"
					required
					requiredMessage="Really do not intend to write anything?"
				>
					<TextArea maxLength={20} hasLimitHint placeholder="请输入" name="description" />
				</FormItem>

				<FormItem wrapperCol={{ offset: 6 }} >
					<FormSubmit validate type="primary" onClick={(v, e) => console.log(v, e)} style={{marginRight: 10}}>Submit</FormSubmit>
					<FormReset >Reset</FormReset>
					<Button onClick={this.routeTo('/video')}>返回</Button>
				</FormItem>
			</Form>
		)
	}
}

export default Video

function getCol(n) {
	return random() * n | 0
}
function randomColor() {
	let h   = getCol(360),
		s   = (h > 40 && h < 200? 70: 90) + getCol(100),
		l   = 35 + getCol(15)
	return { h, s, l }
}

function randomColor2() {
	var h   = getCol(360),
		s   = h > 40 && h < 200? 70: 90 + getCol(10),
		l   = 40 + getCol(20)
	return { h, s, l }
}

function hslToRgb(h, s, l) {
	let r, g, b
	if(s == 0) {
		r = g = b = l
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if(t < 0) t += 1
			if(t > 1) t -= 1
			if(t < 1/6) return p + (q - p) * 6 * t
			if(t < 1/2) return q
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
			return p
		}
		var q = l < 0.5? l * (1 + s): l + s - l * s
		var p = 2 * l - q
		r = hue2rgb(p, q, h + 1/3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1/3)
	}

	return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ]

}

function rgbToHsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255
	let max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		h,
		s,
		l = (max + min) / 2
	if(max == min) {
		h = s = 0
	} else {
		let d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case
				r: h = (g - b) / d + (g < b ? 6 : 0)
				break
			case
				g: h = (b - r) / d + 2
				break
			case
				b: h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return [h * 100 >> 0, Math.round(s * 100), Math.round(l * 100)]
}