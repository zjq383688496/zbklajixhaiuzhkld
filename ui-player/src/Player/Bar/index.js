import React, { Component } from 'react'
import './index.scss'

export default class Bar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			maxWidth: 0,
			curPos: 0,
		}
	}
	componentWillMount() {
	}
	
	componentDidMount() {
		let { bar } = this.refs
		if (!bar) return
		let maxWidth = bar.offsetWidth

		this.setState({
			maxWidth,
			curWidth: this.getWidthByDuration(maxWidth)
		})
	}

	componentWillReceiveProps(props) {
		this.setState({
			curWidth: this.getWidthByDuration()
		})
	}
	componentWillUnmount() {}

	// 时间线拖动
	handleDown = e => {
		let { $video } = this.props.MS,
			{ target, pageX } = e
		$video.pause()
		this.setState({ isDrag: true, curPos: pageX })
	}
	handleMove = e => {
		let width = this.getUpdateWidth(e)
		this.refs.progress.style.width = `${width}px`
	}
	handleUp = e => {
		let { MS, timelineUpdate } = this.props,
			{ $video } = MS,
			width      = this.getUpdateWidth(e),
			duration   = this.getDurationByWidth(width)
		$video.play()
		if (MS) {
			MS.currentTime = duration
			timelineUpdate()
		}
		this.setState({ isDrag: false })
	}

	// 拖动更新进度条
	getUpdateWidth = e => {
		let { target, pageX } = e,
			{ curPos, curWidth, maxWidth } = this.state,
			diffX = pageX - curPos,
			width = curWidth + diffX
		width = width < 0? 0: width > maxWidth? maxWidth: width
		return width
	}

	// 时间转宽度
	getWidthByDuration = maxWidth => {
		let { MS = {} } = this.props,
			{ currentTime = 0, duration = 0 } = MS
		if (!duration) return 0
		return currentTime / duration * (maxWidth || this.state.maxWidth)
	}

	// 宽度转时间
	getDurationByWidth = width => {
		let { duration } = this.props.MS,
			{ maxWidth } = this.state,
			_duration = width / maxWidth * duration
		return _duration
	}

	// 设置实现
	selectTime = e => {
		let { MS, timelineUpdate } = this.props,
			{ target, pageX } = e,
			oX = this.getOffsetLeft(target),
			width = pageX - oX,
			duration = this.getDurationByWidth(width)

		if (!MS) return
		MS.currentTime = duration
		timelineUpdate()
	}

	getOffsetLeft = el => {
		return el.offsetParent
		? el.offsetLeft + this.getOffsetLeft(el.offsetParent)
		: el.offsetLeft
	}

	render() {
		let { isDrag, curWidth } = this.state
		return (
			<div className="ui-player-control-bar" ref="bar" onClick={this.selectTime}>
				<div className="ui-player-control-bar-progress" ref="progress" style={{ width: curWidth }}>
					<div className="ui-player-control-bar-thumb" onMouseDown={this.handleDown}></div>
				</div>
				{
					isDrag
					?
					<div
						className="ui-player-control-bar-mask"
						onMouseMove={this.handleMove}
						onMouseUp={this.handleUp}
					></div>
					: null
				}
			</div>
		)
	}
}
