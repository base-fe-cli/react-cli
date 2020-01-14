import React, { Component } from 'react'
import { Drawer } from 'antd';
import SideMenu from './SideMenu';

export default class index extends Component {
  render() {
    const { isMobile, routers, routeMap, onCollapse, collapsed  } = this.props
    return isMobile ? (
        <Drawer
          visible={!collapsed}
          placement="left"
          onClose={() => onCollapse()}
          bodyStyle={{padding: 0}}
          style={{
            padding: 0,
            height: '100vh',
          }}
        >
          <SideMenu
            routers={routers}
            routeMap={routeMap}
          />
        </Drawer>
      ) : (
        <SideMenu
          onCollapse={onCollapse}
          collapsed={collapsed}
          routers={routers}
          routeMap={routeMap}
        />
      );
  }
}
