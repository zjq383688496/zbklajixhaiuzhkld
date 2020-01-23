import React from 'react'
import { NavLink } from 'react-router-dom'
import routes from './routes'
import { Nav } from '@alifd/next'
const { Item } = Nav
const header = <span className="fusion">FUSION</span>
const footer = <a>Login in</a>

export default class Navbar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currentName: ''
		}
	}
	componentDidMount () {
		let currentName = 'home'
		if (__isBrowser__ && window.__ROUTER_DATA__) {
			currentName = window.__ROUTER_DATA__.name
			delete window.__ROUTER_DATA__
		}
		this.setState({ currentName })
	}
	routerChange = currentName => {
		this.setState({ currentName })
	}
	render() {
		let { currentName } = this.state
		return (
			<Nav className="basic-nav" direction="hoz" type="primary" header={header} footer={footer} selectedKeys={currentName} selectedKeys={currentName} triggerType="hover">
				{
					routes.map(({ name, path }) => (
						<Item key={name} onSelect={e => this.routerChange(name)}><NavLink to={path}>{name}</NavLink></Item>
					))
				}
			</Nav>
		)
	}
}

// <NavLink to={path}>{name}</NavLink>
