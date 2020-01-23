import React, { Component } from 'react'
import routes from './routes'
import { Route, Switch } from 'react-router-dom'
import Navbar from './Navbar'
import NoMatch from './NoMatch'

import '@alifd/next/dist/next.css'

import { Shell } from '@alifd/next'

const {
	Content: ShellContent,
	Footer:  ShellFooter,
} = Shell

class App extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div>
				<Shell style={{border: '1px solid #eee'}}>
					<ShellContent>
						<Switch>
							{routes.map(({ name, path, exact, component: Component, ...rest }) => (
								<Route key={path} path={path} exact={exact} render={props => <Component {...props} {...rest} />} />
							))}
							<Route render={(props) => <NoMatch {...props} /> } />
						</Switch>
					</ShellContent>

					<ShellFooter>
						<span>@ 2020 庄家琪 版权所有</span>
					</ShellFooter>
				</Shell>

			</div>
		)
	}
}

export default App