import React, {Component} from 'react';
import styles from './index.less'
import Carousel from '@/components/Carousel'
import {withRouter} from "react-router-dom";
import {toJS} from 'mobx';


class Announcement extends Component {

  state = {
    list: ''
  }

  componentDidMount() {

  }

  render() {
    const { list=[] } = this.state;
    return (
      <div onClick={e => this.props.history.push('/notice')} className={styles.announcementContainer}>
        {
          toJS(list).length > 0 && <Carousel
            data={toJS(list).length >= 5 ? toJS(list).slice(0, 5) : toJS(list)}
            duration={3000}
            style={{height: 30, lineHeight: '30px'}}/>
        }
      </div>
    );
  }
}

export default withRouter(Announcement);
