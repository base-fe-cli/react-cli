import { Route, Switch, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { getRouterData } from '@/router';
import subPageConfig from '@/router/subPageConfig'
import SideMenu from '@/components/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Exception403 from '@/containers/Exception/403';
import styles from './layout.less'

const { Header, Content, Sider, Footer } = Layout;
const SubMenu = Menu.SubMenu

const query = {
	'screen-xs': {
		maxWidth: 575,
	},
	'screen-sm': {
		minWidth: 576,
		maxWidth: 767,
	},
	'screen-md': {
		minWidth: 768,
		maxWidth: 991,
	},
	'screen-lg': {
		minWidth: 992,
		maxWidth: 1199,
	},
	'screen-xl': {
		minWidth: 1200,
		maxWidth: 1599,
	},
	'screen-xxl': {
		minWidth: 1600,
	},
};


@inject('globalStore')
@observer
export default class BasicLayout extends Component {


	state = {
		route: [
			{
				label: '概览'
			}
		],
		isMobile: false
	}

	constructor(props) {
		super(props)
		this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, _.isEqual);
		this.getMenuData = memoizeOne(this.getMenuData, _.isEqual);
		this.breadcrumbNameMap = this.getBreadcrumbNameMap();
	}
	getRouteList() {
		const rouList = []
		const createRoute = (routes) => {
			if (Object.prototype.toString.apply(routes) === '[object Array]') {
				routes.forEach(item => createRoute(item))
			} else if (Object.prototype.toString.apply(routes) === '[object Object]') {
				const { children = [] } = routes
				if (children.length > 0) {
					createRoute(children)
				} else {
					rouList.push(<Route
						key={routes.path}
						path={routes.path}
						exact={routes.exact}
						component={routes.render}
					/>)
				}
			}
		}
		createRoute(this.getMenuData())
		return rouList
	}
	getLayoutStyle() {
		const { collapsed } = this.props;
		return {
			paddingLeft: collapsed ? '80px' : '256px',
		};
	}
	getPageTitle() {
		let pathname = window.location.hash.substr(1)
		const currentRoute = this.breadcrumbNameMap[pathname] || []
		const route = currentRoute.find(item => item.path) || {}
		const { label = "智能知识库" } = route
		return label
	}
	componentDidMount() {
		let pathname = window.location.hash.substr(1)
		const currentRoute = []
		const menuKey = Object.keys(this.breadcrumbNameMap).find(key => {
			const reg = new RegExp(`${key}.*`)
			return reg.test(pathname)
		})
		const breads = this.breadcrumbNameMap[menuKey] || []
		breads.forEach(bread => {
			const { label, path } = bread
			currentRoute.push({ label, path })
		})
		this.setState({
			route: currentRoute
		})
		this.changeBrand = this.changeBrand.bind(this)
		this.enquireHandler = enquireScreen(mobile => {
			const { isMobile } = this.state;
			if (isMobile !== mobile) {
				this.setState({
					isMobile: mobile,
				});
			}
		})

		window.addEventListener("hashchange", this.changeBrand)
	}

	componentWillUnmount() {
		unenquireScreen(this.enquireHandler);
		window.removeEventListener("hashchange", this.changeBrand)
	}
	getMenuData() {
		const routes = getRouterData('basic').children
		const addKey = (obj, superKey = "") => {
			if (obj.length === 0) {
				return;
			}
			obj.forEach(item => {
				const { key = _.uniqueId("key_"), children = [] } = item
				item.key = key
				item.superKey = superKey
				addKey(children, key)
			})
		}
		addKey(routes)
		return routes
	}
	getBreadcrumbNameMap() {
		const routerMap = {};
		let superNode = {}
		const mergeMenuAndRouter = data => {
			data.forEach(menuItem => {
				const { label, path = "" } = menuItem
				if (menuItem.children) {
					superNode.label = label
					superNode.path = path
					mergeMenuAndRouter(menuItem.children);
					superNode = {}
					return;
				}
				routerMap[menuItem.path] = _.isEmpty(superNode) ? [menuItem] : [superNode, menuItem];
			});
		};
		mergeMenuAndRouter(this.getMenuData());
		return routerMap;
	}

	changeBrand() {
		const pathname = window.location.hash.substr(1)
		const currentRoute = []
		const menuKey = Object.keys(this.breadcrumbNameMap).find(key => {
			const reg = new RegExp(`${key}.*`)
			return reg.test(pathname)
		})
		const breads = this.breadcrumbNameMap[menuKey] || []
		breads.forEach(bread => {
			const { label, path } = bread
			currentRoute.push({ label, path })
		})
		this.setState({
			route: currentRoute
		})
	}

	getDefaultPath() {
		const routers = this.getMenuData()
		const getPath = (routers = []) => {
			for (let i = 0; i < routers.length; i++) {
				const route = routers[i]
				if (_.has(route, "path")) {
					return route["path"]
				} else {
					const children = route.children || []
					return getPath(children)
				}
			}
		}
		let pathname = getPath(routers)
		return pathname
	}

	render() {
		const routers = this.getMenuData()
		const rouList = this.getRouteList()
		const pathname = this.getDefaultPath()
		const { route, isMobile } = this.state
		const collapse = this.props.globalStore.collapse
		const layout = (
			<Layout theme="dark">
        <GlobalHeader isMobile={isMobile} currentRoute={route} onCollapse={this.props.globalStore.toggle} />


				<Layout className={styles.basicLayout}>
          <SideMenu
            routers={routers}
            isMobile={isMobile}
            routeMap={this.breadcrumbNameMap}
            collapsed={collapse}
            onCollapse={this.props.globalStore.toggle}
          />
					<Layout className={styles.contentLayout}>
						<Content className={styles.content}>
							<Switch>
								{rouList}
                {
                  subPageConfig && Array.isArray(subPageConfig) && subPageConfig.map(item => {
                    return <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                    />
                  })
                }
								<Redirect from='/' to={pathname} />
							</Switch>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		)
		const noMenus = <Exception403 />
		return (
			<DocumentTitle title={this.getPageTitle()}>
				<ContainerQuery query={query}>
					{params => (
						<div className={classNames(params)}>{rouList.length > 0 ? layout : noMenus}</div>
					)}
				</ContainerQuery>
			</DocumentTitle>
		);
	}
}
