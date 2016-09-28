import React from "react";

import ClassesBlock from "../ClassesBlock";
import * as CalendarActions from "../../actions/CalendarActions";
import CalendarStore from "../../stores/CalendarStore";


Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};



export default class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      clickedDay: CalendarStore.getToday(),
      weekDays: CalendarStore.getWeekDays(),
      monthNames: CalendarStore.getMonthNames(),
      view: CalendarStore.getView(),
      width:this.updateDimensions().width,
      height:this.updateDimensions().height
    };

  }
  updateDimensions() {

      var w = window,
          d = document,
          documentElement = d.documentElement,
          body = d.getElementsByTagName('body')[0],
          width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
          height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

          return {width: width, height: height};
      }
  componentWillMount() {
    CalendarStore.on("change", this.getToday.bind(this));
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.getToday.bind(this));
  }


  getToday(){
    this.setState({
      clickedDay: CalendarStore.getToday(),
      weekDays: CalendarStore.getWeekDays(),
      monthNames: CalendarStore.getMonthNames(),
      view: CalendarStore.getView(),
      width:this.updateDimensions().width,
      height:this.updateDimensions().height
    });
  }

  filterDay(day) {
    return ()=> {
      //CHECK IF ITS ON DAY METHOD TO AVOID MEMORY LLEACK
      //fix for sunday offest
      day=((day.getDay())==0)?6:day.getDay()-1;
      CalendarActions.setToday(day);
    }
  }


  render() {
    let x = 0;
    let delay = 0;
    const headerTitle = this.state.weekDays.map((key) => {
      //ofset to start on monday
      let thisDayComp=x;
      let today     = (thisDayComp-new Date().getDay())+1;
      let thisDate  = new Date().addDays(today);
      let thisDay   = thisDate.getDate();
      thisDay       = ((''+thisDay).length==1)?'0'+thisDay:thisDay;
      let thisMonth = this.state.monthNames[thisDate.getMonth()].substring(0,3);
      x++;
      delay+=0.1;
      let nameDay = (this.state.width>451)?key:key.substring(0,3);
      //Working with theoffset
      return <div style={{animationDelay: delay+'s'}} class={'dayTitle animated fadeInLeft'+((this.state.clickedDay==thisDayComp)?' active':'')} key={x} onMouseOver={this.filterDay(thisDate)}><div class="activeCircle"></div><div class="dayTop">{thisDay} {thisMonth}<span class="articleDashSchedule"></span></div><span class="dayBottom">{nameDay}</span></div>
    })



    return (
      <div class={((this.state.view=='weekly')?'weeklyScheduleTop':'dailyScheduleTop')+' ScheduleDays section group '}>
      <div class="scheduleTime"><span>&nbsp;</span></div>
      {headerTitle}
      </div>
    );
  }
}
