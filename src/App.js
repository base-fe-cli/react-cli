import React, { Component } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getLayoutData } from '@/router';
import stores from './stores';

class App extends Component {
  render() {
    const routers = getLayoutData();
    return (
      <Provider {...stores}>
        <Router>
          <ConfigProvider locale={zhCN}>
            <Switch>
              {
                routers.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.render}
                  />
                ))
              }
              
            </Switch>
          </ConfigProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;