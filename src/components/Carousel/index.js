import React, {Component} from 'react';
import styles from './index.less';
import { Icon } from 'antd'

class Carousel extends Component {

  constructor(props) {
    super(props);
    const { data=[] } = props;
    this.state = {
      data: data[0] ? data.concat(data[0]) : data,
      scroll: true
    }
    this.index=0;
  }

  onScrollChange = () => {
    if(this.state.scroll) {
      clearInterval(this.internal)
    } else {
      this.startScroll()
    }
    this.setState({ scroll: !this.state.scroll })
  }

  startScroll = () => {
    const { duration = 1000, style={} } = this.props;
    const { data=[] } = this.state;
    const { height = 20 } = style;
    this.internal = setInterval(() => {
      this.index += 1;
      this.refs.wrapper.style.transform = `translateY(-${height*this.index}px)`
      this.refs.wrapper.style.transition = `1s`
      if(this.index === data.length -1) {
        setTimeout(() => {
          this.index = 0
          this.refs.wrapper.style.transform = 'translateY(0px)'
          this.refs.wrapper.style.transition = `0s`
        }, duration*0.9)
      }
    }, duration)
  }

  componentDidMount() {
    this.state.scroll && this.startScroll()
  }

  componentWillUnmount() {
    clearInterval(this.internal)
  }

  renderItems = () => {
    const { data=[] } = this.state;
    const { style={} } = this.props;
    return data.map((item, index) => {
      return <div key={index} className={styles.itemWrap} style={Object.assign({}, { height: 20 }, style)}>
        <div className={styles.content} style={{lineHeight: style.lineHeight || '20px'}}>{item.title}</div>
        <div className={styles.time} style={{lineHeight: style.lineHeight || '20px'}}>{item.publishTime}</div>
      </div>
    })
  }

  onLastIndex = () => {
    const { style={} } = this.props;
    const { data=[] } = this.state;
    const { height = 20 } = style;
    if(this.index > 0) {
      this.index -= 1;
      this.refs.wrapper.style.transform = `translateY(-${height*this.index}px)`
      this.refs.wrapper.style.transition = `1s`
    } else if(this.index === 0) {
      this.index = data.length -2;
      this.refs.wrapper.style.transform = `translateY(-${height*this.index}px)`
      this.refs.wrapper.style.transition = `0s`
    }
  }

  onNextIndex = () => {
    const { style={} } = this.props;
    const { data=[] } = this.state;
    const { height = 20 } = style;
    if(this.index >= 0 && this.index <= data.length - 2) {
      this.index += 1;
      this.refs.wrapper.style.transform = `translateY(-${height*this.index}px)`
      this.refs.wrapper.style.transition = `1s`
      if(this.index === data.length - 1) {
        this.setTimeout = setTimeout(() => {
          this.index = 0
          this.refs.wrapper.style.transform = 'translateY(0px)'
          this.refs.wrapper.style.transition = `0s`
        }, 900)
      }
    }
  }

  render() {
    const { data=[] } = this.state;
    const { style={} } = this.props;
    const { height = 20 } = style;
    return (
      <div
        onMouseEnter={this.onScrollChange}
        onMouseLeave={this.onScrollChange}
        className={styles.wrapper}
        style={{height, overflow: 'hidden'}}>
        <Icon
          type="left"
          onClick={this.onLastIndex}
          style={{fontSize: 12, color: '#ADB6C2',paddingTop: `${(height-12)/2}px`, marginRight: 18}}/>
        <div ref="wrapper" className={styles.itemsWrapper}>
          {
            this.renderItems(data)
          }
        </div>
        <Icon
          onClick={this.onNextIndex}type="right"  style={{fontSize: 12, color: '#ADB6C2',paddingTop: `${(height-12)/2}px`, marginLeft: 18}}/>
      </div>
    );
  }
}

export default Carousel;
