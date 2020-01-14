import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Exception from '@/components/Exception';
import Svg403 from '@/assets/svg/403.svg'
const Exception403 = () => (
  <Exception title="403" desc="抱歉，你无权访问该页面" linkElement={Link} backText="返回首页">
      <Svg403 />
  </Exception>
);

export default Exception403;
