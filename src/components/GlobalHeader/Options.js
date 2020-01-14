import React, {Component} from 'react';
import styles from './index.less';
import { Icon, Popover } from 'antd';
import userLogo from '@/assets/img/user-avatar.jpg';
import {withRouter} from "react-router-dom";

class Options extends Component {
  render() {
    const content = <span>修改个人信息</span>
    return (
      <div className={styles.optionsContainer}>
        <Icon
          type="delete"
          style={{fontSize: 16, color: '#ADB6C2', marginRight: 24}}
          onClick={e => this.props.history.push('/recycleBin')}
        />
        <Icon
          type="question-circle"
          style={{fontSize: 16, color: '#ADB6C2', marginRight: 24}}
          onClick={e => this.props.history.push('/help')}/>
        <span className={styles.userContainer}>
          <span className={styles.userName}>王二</span>
          <img src={userLogo} alt=""/>
          <Popover content={content} title="" trigger="hover" placement="bottomRight">
            <Icon type="down"  style={{fontSize: 12, color: '#ADB6C2'}}/>
          </Popover>
        </span>
      </div>
    );
  }
}

export default withRouter(Options);
