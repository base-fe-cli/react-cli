import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import styles from './index.less';

class Exception extends React.PureComponent {
  static defaultProps = {
    redirect: '/portal',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      className,
      backText,
      linkElement = 'a',
      title,
      desc,
      redirect,
      children
    } = this.props;
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString}>
        <div className={styles.imgBlock}>
          <div className={styles.imgEle}>
            {children}
          </div>
        </div>
        <div className={styles.content}>
          <h1>{title}</h1>
          <div className={styles.desc}>{desc}</div>
          {/* <div className={styles.actions}>
            {createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div> */}
        </div>
      </div>
    );
  }
}

export default Exception;
