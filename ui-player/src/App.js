import React, { Component } from 'react'
import './App.scss'

import Player from './Player'

export default class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<div className="player-box">
						<Player />
					</div>
				</header>
			</div>
		)
	}
}
