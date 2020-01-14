import React, { Component } from 'react';
import styles from './index.less'
import Debounce from 'lodash-decorators/debounce';
import Announcement from './Announcement'
import Options from './Options'
import {Link} from "react-router-dom";
import logo from '@/assets/img/logo.png';
import logo2 from '@/assets/img/logo2x.png';

export default class GloabalHeader extends Component {

  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

	render() {
		return (
      <div className={styles.header}>
        <div className={styles.logo} id="logo">
          <Link to="/">
            {
              <div>
                <img src={logo}  srcSet={`${logo2} 2x`} alt="logo" />
                智能知识库管理系统
              </div>
            }
          </Link>
        </div>
        <Announcement/>
        <Options/>
        <div>
        </div>
      </div>
    )
	}
}
