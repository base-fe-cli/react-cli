import { observable, action } from 'mobx';

class GlobalStore {

  @observable collapse = false;
  @observable locale = "";

  @action toggle = () => {
    this.collapse = !this.collapse;
  }
}

export default new GlobalStore();