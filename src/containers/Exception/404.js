import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '@/components/Exception';
import Svg404 from '@/assets/svg/404.svg'

const Exception404 = () => (
  <Exception title="404" desc="抱歉，你访问的页面不存在面" linkElement={Link} backText="返回首页">
    <Svg404 />
  </Exception>
);

export default Exception404;
