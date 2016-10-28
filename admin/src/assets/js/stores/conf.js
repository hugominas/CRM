export default class Config {

  constructor() {
    super()
    this.menus=['Campaigns','Customers','Flows','Users','Settings']
  }

  getMenus(){
    return this.menus;
  }



}
