import { EventEmitter } from "events";
import dispatcher from "../dispatcher";



class CalendarStore extends EventEmitter {
  constructor() {
    super()
    this.defaults     = window.defaultClass;
    this.view         = 'weekly'
    this.defaults.schedule=this.defaults.path+'/schedule.json';
    this.defaults.filters=this.defaults.path+'/filters.json';
    this.calendar     = {morning:{},afternoon:{},nigth:{}};
    this.dayTitleTable= ['Class','Hour','Location','Category','Club'];
    this.ptColours    = ['blue','green','orange','yellow','purple'];
    this.weekDays     = ['Monday','Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.monthNames   = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.filters      = {};
    this.activeTrainers= [];
    this.activeFilters= {intensity:0,clubs:(this.defaults.club!=='' && typeof this.defaults.club!=='undefined')?[this.defaults.club]:[],class:(this.defaults.class!=='' && typeof this.defaults.class!=='undefined')?[this.defaults.class]:[],category:(this.defaults.category!=='' && typeof this.defaults.category!=='undefined')?[this.defaults.category]:[]};
    this.classes      = {};
    this.times        = ['morning','afternoon','evening'];
    this.selectedDay  = new Date().getDay()-1;
    this.selectedClass= '';


  }

  getView(){
    return this.view;
  }

  getActiveClass(){
    return this.selectedClass;
  }

  getActiveTrainers(){
    return this.activeTrainers;
  }

  getPtCoulors(){
    return this.ptColours;
  }

  getIntensity(){
    return this.activeFilters.intensity;
  }

  getCLubFilter(){
    return this.activeFilters.clubs;
  }

  getActFilter(){
    return this.activeFilters.category;
  }

  updateFilter(filt, val) {
    return this.activeFilters[filt]=val;
  }

  getToday() {
    return this.selectedDay;
  }

  getTitleTable() {
    return this.dayTitleTable;
  }

  getScheduleURL() {
    return this.defaults.schedule;
  }

  getFiltersURL() {
    return this.defaults.filters;
  }

  getWeekDays() {
    return this.weekDays;
  }

  getMonthNames() {
    return this.monthNames;
  }

  getFilters() {
    return this.filters;
  }

  getTimes() {
    return this.times;
  }

  getAll() {
    return this.calendar = {
      morning:this.getMorning(),
      afternoon:this.getAfternoon(),
      evening:this.getNigth()
    };
  }

  doFiltersOn(ele){
    let loopCoulors = 0;
    ele=ele.map((e) => {
      let isValid = e;
      //INTENSITY
      if(e.intensity!=this.activeFilters.intensity && this.activeFilters.intensity!=0)return false;

      //CLUB
      if(this.activeFilters.clubs.indexOf(''+e.club_id)===-1 && this.activeFilters.clubs.length!==0)return false;

      //CLASS
      if(this.activeFilters.class.indexOf(''+e.class_id)===-1 && this.activeFilters.class.length!==0)return false;

      //CAT
      //console.log(this.activeFilters.category.indexOf(e.class_id),e.club_id,this.activeFilters.category,this.activeFilters.category.length)
      if(this.activeFilters.category.indexOf(''+e.class_id)===-1 && this.activeFilters.category.length!==0)return false;

      //UPDATE TRAINERS
      if(this.activeTrainers.filter((val)=>{return val.name==isValid.pt}).length==0){this.activeTrainers.push({name:isValid.pt, colour:this.ptColours[loopCoulors]});loopCoulors++;}

      return isValid;
    });
    return ele;
  }

  getNigth() {
    let idAula=0;
    const nigthClasses = Object.keys(this.classes).map((key) => {
      //SET TIME WITH :
      this.classes[key].map((ele) => {
        ele.id=idAula;
        idAula++;
        ele.hour=ele.hour.slice(0, 2)+':'+ele.hour.slice(2, 4)
      });
      // RETURN KEY
      return (parseInt(key) >= 1800 && parseInt(key) < 2300)?this.doFiltersOn(this.classes[key]):false;
    })
    return nigthClasses;
  }

  getAfternoon() {
    const afternoonClasses = Object.keys(this.classes).map((key) => {
      // RETURN KEY
      return (parseInt(key) >= 1200 && parseInt(key) < 1800)?this.doFiltersOn(this.classes[key]):false;
    })
    return afternoonClasses;
  }

  getMorning() {
    const morningClasses = Object.keys(this.classes).map((key) => {
      //SET CORRTECT TIME
      this.classes[key].map((ele) => {ele.hour=(key.length==3)?'0'+(''+key):key;});
      // RETURN KEY
      return (parseInt(key) >= 700 && parseInt(key) < 1200)?this.doFiltersOn(this.classes[key]):false;
    })
    return morningClasses;
  }

  handleActions(action) {
    switch(action.type) {
      case 'SET_VIEW': {
        this.view = action.view;
        this.emit("change");
        break;
      }
      case 'RECEIVE_CLASSES': {
        this.classes = action.classes;
        this.getAll();
        this.emit("change");
        break;
      }
      case 'RECEIVE_FILTERS': {
        this.filters = action.filters;
        this.emit("change");
        break;
      }
      case "GET_CALENDAR": {
        this.getAll();
        break;
      }
      case "GET_FILTERS": {
        this.classes = action.calendar;
        this.emit("change");
        break;
      }
      case "SET_TODAY": {
        this.selectedDay = action.today;
        this.emit("change");
        break;
      }
      case "DO_FILTER": {
        this.updateFilter(action.filter);
        this.emit("change");
        break;
      }
      case "SET_TIMES": {
        this.times = action.times;
        this.emit("change");
        break;
      }
      case "SET_ACTIVECLASS": {
        this.selectedClass = (action.classId!=this.selectedClass)?action.classId:'';
        this.emit("change");
        break;
      }
      case "SET_INTENCITY": {
        this.activeFilters.intensity = action.inten;
        this.getAll();
        this.emit("change");
        break;
      }
      case "SET_CLUBFILTER": {
        let indexClub = this.activeFilters.clubs.indexOf(action.clubid);
        if(indexClub!==-1){
          this.activeFilters.clubs.splice(indexClub, 1);
        }else{
          this.activeFilters.clubs.push(action.clubid)
        };
        this.getAll();
        this.emit("change");
        break;
      }
      case "SET_CATFILTER": {
        let indexCat = this.activeFilters.category.indexOf(action.catid);
        if(indexCat!==-1){
          this.activeFilters.category.splice(indexCat, 1);
        }else{
          this.activeFilters.category.push(action.catid)
        };
        this.getAll();
        this.emit("change");
        break;
      }

      case "CLEAR_CLASSESSELECTION": {
        this.activeFilters.category = [];
        this.getAll();
        this.emit("change");
        break;
      }

      case "CLEAR_GYMSELECTION": {
        this.activeFilters.clubs = [];
        this.getAll();
        this.emit("change");
        break;
      }

    }
  }

}

const calendarStore = new CalendarStore;

calendarStore.setMaxListeners(0)
dispatcher.register(calendarStore.handleActions.bind(calendarStore));
export default calendarStore;
