import Home from './Home'
import { videoList } from '@service/video'
import Video from './Video'
import VideoAdd    from './Video/Add'
// import VideoEdit   from './Video/Edit'
// import VideoDetail from './Video/Detail'

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
		fetchInitialData: () => videoList()
	},
	{
		name: 'video',
		path: '/video/add',
		exact: true,
		component: VideoAdd,
		// fetchInitialData: () => videoList()
	},
	/*{
		name: 'video',
		path: '/video/edit/:id',
		exact: true,
		component: VideoEdit,
		// fetchInitialData: () => videoList()
	},
	{
		name: 'video',
		path: '/video/:id',
		component: VideoDetail,
		// fetchInitialData: () => videoList()
	},*/
]

export default routes