import Home      from '@page/Home'
import Video     from '@page/Video'
import VideoAdd  from '@page/Video/Add'
import { video } from '@server'

const routes =  [
	{
		name: 'home',
		path: '/',
		exact: true,
		component: Home,
	},
	{
		name: 'video',
		path: '/video',
		exact: true,
		component: Video,
		fetchInitialData: () => video.list()
	},
	{
		name: 'video',
		path: '/video/add',
		exact: true,
		component: VideoAdd,
	},
	{
		name: 'video',
		path: '/video/edit/:id',
		exact: true,
		component: VideoAdd,
		fetchInitialData: query => video.detail(query.id)
	},
]

export default routes