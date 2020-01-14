import {configure} from 'mobx';
import globalStore from './global';

configure ({
  enforceActions: 'always', // 严格模式
});

const stores = {
  globalStore
};

export default stores;
