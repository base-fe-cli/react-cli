import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '@/components/Exception';
import Svg500 from '@/assets/svg/500.svg'

const Exception500 = () => (
  <Exception type="500" title="500" desc="抱歉，服务器出错了" linkElement={Link} backText="返回首页">
    <Svg500 />
  </Exception>
);

export default Exception500;
