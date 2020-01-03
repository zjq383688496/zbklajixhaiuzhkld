import React, { Component } from 'react'
import Upload from '../Upload'
import { Button, Form, Input, Radio, Tag } from '@alifd/next'

import './index.less'

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


import channels from './channels'
import tags     from './tags'

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
		
		let repos
		if (__isBrowser__) {
			if (window.__INITIAL_DATA__) {
				repos = window.__INITIAL_DATA__
				delete window.__INITIAL_DATA__
			} else {
				props.fetchInitialData().then(res => {
					repos = res
					this.setState({
						repos,
						loading: !repos,
					})
				})
			}
		} else {
			repos = this.props.staticContext.data
		}

		this.state = {
			repos,
			loading: !repos,
		}
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
	render() {
		const { loading, repos } = this.state

		if (loading) return <p>LOADING</p>

		return (
			<Form {...formItemLayout}>
				<FormItem label="频道">
					<RadioGroup name="channel" defaultValue={1}>
						{
							channels.map(({ name, key }) => <Radio key={key} value={key}>{name}</Radio>)
						}
					</RadioGroup>
				</FormItem>
				<FormItem label="标签">
					<TagGroup name="tag" defaultValue={1}>
						{
							tags.map(tag => {
								let { h, s, l, a } = randomColor(),
									color  = `hsl(${h}, ${s}%, ${l}%)`,
									bColor = `hsla(${h}, ${s}%, ${l}%, .25)`
								return <SelectableTag key={tag} type="normal" style={{ backgroundColor: bColor, borderColor: color, color }}>{tag}</SelectableTag>
							})
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
					<Input placeholder="Input frank" name="valUsername" />
					<FormError name="valUsername" >
						{ (errors, state) => state === 'loading'? 'loading...': errors }
					</FormError>
				</FormItem>
				<FormItem
					label="Email:"
					hasFeedback
					required
					requiredTrigger="onBlur"
					format="email"
				>
					<Input placeholder="Both trigget onBlur and onChange" name="valEmail" />
				</FormItem>

				<FormItem
					label="Password:"
					hasFeedback
					required
					requiredMessage="Please enter password"
				>
					<Input htmlType="password" name="valPasswd" />
				</FormItem>

				<FormItem
					label="Gender:"
					hasFeedback
					required
					requiredMessage="Please select your gender"
				>
					<RadioGroup name="valSex" >
						<Radio value="male">Male</Radio>
						<Radio value="female">Female</Radio>
					</RadioGroup>
				</FormItem>

				<FormItem
					label="Remarks:"
					required
					requiredMessage="Really do not intend to write anything?"
				>
					<TextArea maxLength={20} hasLimitHint placeholder="Everything is ok!" name="valTextarea" />
				</FormItem>

				<FormItem wrapperCol={{ offset: 6 }} >
					<FormSubmit validate type="primary" onClick={(v, e) => console.log(v, e)} style={{marginRight: 10}}>Submit</FormSubmit>
					<FormReset >Reset</FormReset>
				</FormItem>
			</Form>
		)
	}
}

export default Video

function getCol(n) {
	return Math.random() * n >> 0
}
function randomColor() {
	let h   = getCol(360),
		s   = (h > 40 && h < 200? 70: 90) + getCol(10),
		l   = 35 + getCol(15)
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