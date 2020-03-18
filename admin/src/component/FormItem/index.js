'use strict';

import React from 'react'
import { Form } from '@alifd/next'

let { Item, Error } = Form

export default class FormItem extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {}
	componentWillReceiveProps(props) {
	}
	componentDidMount() {}
	componentDidUpdate(props) {
	}

	getRule = (visible, rules = []) => {
		let hasError = false, errorMsg = ''
		if (!visible) return { hasError, errorMsg }
		for (let i = 0, l = rules.length; i < l; i++) {
			let [ value, error ] = rules[i]
			if (value) {
				hasError = true
				errorMsg = error
				break
			}
		}
		return { hasError, errorMsg }
	}

	render() {
		let { children, label, required = false, rules = [], visible = true } = this.props
		let { hasError, errorMsg } = this.getRule(visible, rules)
		return (
			<Item label={label} required={required} className={hasError? 'has-error': ''}>
				{ children }
				{
					hasError && errorMsg
					?
					<Error>{errorMsg}</Error>
					: null
				}
			</Item>
		)
	}
}
