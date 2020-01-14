import React from 'react';
import menuData from './menuConfig.json'
import pageConfig from './ComponentConfig'
import BasicLayout from '@/layouts/BasicLayout'

try{
  const userInfo = window.userInfo
  if(userInfo){
    const auth = JSON.parse(userInfo.replace(/&quot;/g, "\""))
    const { authInfoList = null, realName } = auth
    window.YL_SCA_MENUS = authInfoList
    window.YL_SCA_USER = realName
  }else{
    window.YL_SCA_MENUS = null
    window.YL_SCA_USER = null
  }
}catch(e){
  window.YL_SCA_MENUS = null
  window.YL_SCA_USER = null
}

let menus = window.YL_SCA_MENUS || menuData || []

/**
 * 创建菜单项
 * @param {*} label 名称
 * @param {*} path 路由path
 * @param {*} exact
 * @param {*} key
 * @param {*} order 顺序
 */
const createMenuItem = (label, path, exact, key, icon, order) => {
  let component = pageConfig[key] || null
  if(!component){
    component = pageConfig["exception404"]
  }
  const menuItem = {
    label,
    path,
    exact,
    key,
    icon,
    render: component.default,
    range: order
  }
  return menuItem
}

const btnsAuthority = {}

/**
 * 创建页面按扭权限
 * @param {*} pageKey
 * @param {*} authorities
 */
const createBtnAuthority = (pageKey, authorities) => {
  btnsAuthority[pageKey] = {}
  authorities.map(_item => {
    btnsAuthority[pageKey][_item.menuKey] = Object.assign({}, _item)
  })
}

const generateMenu = (menus = []) => {
  const menuItems = []
  menus.forEach(item => {
    const {
      menuName  = "",
      menuUrl  = "",
      menuKey = "",
      menuIcon = "dashboard",
      menuType = "page",
      menuOrder = 0,
      children = []
    } = item
    if(menuType === "folder" && children.length > 0){
      const menuFolders = {
        label: menuName,
        key: menuKey,
        icon: menuIcon,
        range: menuOrder,
        children: generateMenu(children)
      }
      menuItems.push(menuFolders)
    }else if(menuType === "page"){
      const menuItem = createMenuItem(menuName, menuUrl, true, menuKey, menuIcon, menuOrder)
      menuItems.push(menuItem)
      if(children.length > 0){
        createBtnAuthority(menuKey, children)
      }
    } else if(menuType === "other") {
      if(children.length > 0){
        createBtnAuthority(menuKey, children)
      }
    }
  })
  return menuItems.sort((a, b) => a.range - b.range)
}

const baseMenu = generateMenu(menus)
window.btnsAuthority = btnsAuthority;

const routers = [
  {
    label: "在线客服",
    path: '/',
    exact: false,
    render: BasicLayout,
    key: 'basic',
    children: baseMenu
  }
]

export const getSubKeys = () => {
  const keys = Object.keys(routers);
  return keys.map(item => {
    const router = routers[item] || {};
    const { label, icon } = router;

    return { key: item, label, icon };
  })
}

export const getLayoutData = () => {
  const layouts = routers.map(item => {
    const { path, exact, label, render } = item
    return {
      path, exact, label, render
    }
  })
  return layouts
}

// 获取路由
export const getRouterData = app => {
  const route = routers.find(item => item.key === app)
  return route;
};
