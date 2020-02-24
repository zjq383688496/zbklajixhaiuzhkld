import React, { Component } from 'react'
import { time2Str } from './utils/format'
import { createMS } from './mediaSource'

import Bar from './Bar'
import './index.scss'

export default class Player extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentTime: 0,
			duration: 0,
		}
	}
	componentWillMount() {}
	
	componentDidMount() {
		let { video } = this.refs
		this.init(video)
	}

	componentWillUnmount() {
		clearInterval(this.timeout)
	}

	timeout = null

	init = dom => {
		if (!dom) return
		this.$video = dom
		let MS = createMS(dom, '456432345', {})
		this.setState({ MS }, this.handleEvent)
	}

	handleEvent = () => {
		this.timeout = setInterval(this.timelineUpdate, 1e3)
	}

	timelineUpdate = () => {
		let { currentTime: _currentTime, duration: _duration, MS } = this.state,
			{ currentTime, duration, $video } = MS
		if (duration !== _duration || currentTime !== _currentTime) {
			this.setState({ currentTime, duration })
		}
	}

	changeAudio = track => {
		let { MS } = this.state
		MS.trackAudio = track
	}

	render() {
		let { currentTime, duration, MS } = this.state,
			durationStr = time2Str(duration),
			currentStr  = time2Str(currentTime)
		return (
			<div className="ui-player">
				<div className="ui-player-video">
					<video controls ref="video"></video>
				</div>
				<div className="ui-player-control">
					<div className="ui-player-control-top">
						<Bar currentTime={currentTime} duration={duration} MS={MS} timelineUpdate={this.timelineUpdate} />
					</div>
					<div className="ui-player-control-left">
						<a className="icon-play"></a>
						{/*<a className="icon-pause"></a>*/}
						{/*<a className="icon-next"></a>*/}
						<span className="ui-player-control-time">{currentStr} / {durationStr}</span>
					</div>
					<div className="ui-player-control-right">
						<a onClick={e => this.changeAudio('96k')}>96k</a>
						<a onClick={e => this.changeAudio('160k')}>160k</a>
					</div>
				</div>
			</div>
		)
	}
}
						// <a className="icon-volume"></a>
						// <a className="icon-cog"></a>
						// <a className="icon-enlarge"></a>
