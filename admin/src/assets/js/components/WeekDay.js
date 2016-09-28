import React from "react";

import ClassesBlock from "./ClassesBlock";
import CalendarStore from "../stores/CalendarStore";
import * as CalendarActions from "../actions/CalendarActions";

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};


export default class WeekDay extends React.Component {
  constructor(props) {
    super();
    this.getWeekDays();
    this.state={activeClassId:CalendarStore.getActiveClass()};
  }

  getWeekDays(){
    this.weekDays=CalendarStore.getWeekDays();
  }

  updageHighlight(){
    this.state.activeClassId=CalendarStore.getActiveClass()

  }

  componentWillMount() {
    CalendarStore.on("change", this.updageHighlight.bind(this));
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.updageHighlight.bind(this));
  }


  render() {
    let i=0;
    const currWeekDay = new Date();
    const classComponents = this.weekDays.map((key1) => {
      //CHECK IF ITS ON THE CORRECT DAY AND ADD TO PROP
      let prop = [];
      let delay = 0;
        Object.keys(this.props.classes).map((key) => {
              Object.keys(this.props.classes[key]).map((k) => {
                if(typeof this.props.classes[key][k] !== 'undefined' && this.props.classes[key][k] !== false){
                  //console.log(i, (this.props.classes[key][k].repeat),this.props.classes[key][k].repeat.indexOf(''+i),(typeof this.props.classes[key][k].repeat !=='undefined' && this.props.classes[key][k].repeat.indexOf(''+i)!==-1));
                  //CHECK IF REPEATERS BELONG TO THE DAY
                  let today     = (i-currWeekDay.getDay())+1;
                  let thisDate  = new Date().addDays(today);
                  let startDate = (this.props.classes[key][k].startDate || '01-01-2016').split('-');
                  let endDate   = (this.props.classes[key][k].endDate).split('-');
                  if(new Date(startDate[2], startDate[1] - 1, startDate[0])>thisDate || (thisDate< new Date(endDate[2], endDate[1] - 1, endDate[0]) || endDate.length==1)){
                    //let uniqueKey=Math.floor((Math.random() * 1000) + 1);
                    this.props.classes[key][k].selectClass=(this.props.classes[key][k].class_id==this.state.activeClassId)?'active':(this.state.activeClassId!=='')?'opacity':false;
                    delay+=.1;
                    this.props.classes[key][k].delay=delay;
                    (typeof this.props.classes[key][k].repeat !=='undefined' && this.props.classes[key][k].repeat.indexOf(''+(i+1))!==-1)?prop.push(<ClassesBlock key={this.props.classes[key][k].id} {... this.props.classes[key][k]}/>):false;

                  }else if(new Date(startDate[2], startDate[1] - 1, startDate[0])==thisDate){
                    prop.push(<ClassesBlock key={this.props.classes[key][k].id} {... this.props.classes[key][k]}/>)
                  }
                }
              });
          })
        i++;
        return <div class="dayTitle" key={i}>{prop}</div>;
    });


    return (
        <div class="weekClasses section group fadeInUp animated">
          <div class={'scheduleTime vertical-text-'+this.props.period}><span class={this.props.period+'Sche'}>{this.props.period}</span></div>
          {classComponents}
          <div class="scheduleBorder"></div>
        </div>
    );
  }
}
