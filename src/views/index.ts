import React from 'react'
import { Switch, withRouter, Route, RouteComponentProps } from 'react-router-dom'
import Loadable from 'react-loadable'

type routerItem = {
	path: string
	component: (React.ComponentClass & Loadable.LoadableComponent) | React.FunctionComponent
}

const router: routerItem[] = [
	// {
	// 	path: '/admin/publish',
	// 	component: Loadable({
	// 		loader: () => import(/* webpackChunkName: "admin_publish" */ './node_modules/src/view/views/admin/publish/Index'),
	// 		loading: () => <span>加载中...</span>
	// 	})
	// },
	// {
	// 	path: '/admin/draft',
	// 	component: Loadable({
	// 		loader: () => import(/* webpackChunkName: "admin_draft" */ './node_modules/src/view/views/admin/draft/Index'),
	// 		loading: () => <span>加载中...</span>
	// 	})
	// },
	// {
	// 	path: '/admin/articleInfo',
	// 	component: Loadable({
	// 		loader: () => import(/* webpackChunkName: "admin_articleInfo" */ './node_modules/src/view/views/admin/articleInfo/Index'),
	// 		loading: () => <span>加载中...</span>
	// 	})
	// },
	// {
	// 	path: '/admin/edit',
	// 	component: Loadable({
	// 		loader: () => import(/* webpackChunkName: "admin_edit" */ './node_modules/src/view/views/admin/edit/Index'),
	// 		loading: () => <span>加载中...</span>
	// 	})
	// },
	{
		path: '/',
		component: Loadable({
			loader: () => import(/* webpackChunkName: "index" */ './index/index'),
			loading: () => <span>加载中...</span>,
		}),
	},
	// {
	// 	path: '/page/:id',
	// 	component: Loadable({
	// 		loader: () => import(/* webpackChunkName: "article" */ './node_modules/src/view/views/frontend/article/Index'),
	// 		loading: () => <span>加载中...</span>
	// 	})
	// }
]

const innerRouter = (router: routerItem[]) => router.map((item) => <Route exact path={item.path} component={item.component} key={item.path} />)

@(withRouter as any)
class AppRouter extends React.Component<RouteComponentProps> {
	render() {
		const { location } = this.props
		location.pathname.indexOf('/admin') && import('../../../node_modules/cube.css/build/cube.css')
		return !location.pathname.indexOf('/admin') ? <Switch>{innerRouter(router)}</Switch> : <Switch>{innerRouter(router)}</Switch>
	}
}

export default AppRouter
