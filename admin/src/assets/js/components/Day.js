import React from "react";

import ClassesLine from "./ClassesLine";
import * as CalendarActions from "../actions/CalendarActions";
import CalendarStore from "../stores/CalendarStore";

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

export default class Day extends React.Component {

  constructor() {
    super();
    this.getToday = this.getToday.bind(this);
    this.state = {
      today: CalendarStore.getToday()+1,
      activeClassId: CalendarStore.getActiveClass()
    };
    this.getWeekDays();
    this.getTitleTable();
  }
  componentWillMount() {
    CalendarStore.on("change", this.getToday);
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.getToday);
  }

  getWeekDays(){
    this.weekDays=CalendarStore.getWeekDays();
  }

  getTitleTable(){
    this.TitleTable=CalendarStore.getTitleTable();
  }

  getToday(){
    this.setState({
      today:CalendarStore.getToday()+1,
      activeClassId: CalendarStore.getActiveClass()
    });
  }

  render() {
    let i=0;
    const currWeekDay = new Date();
    let prop = []
    this.weekDays.map((key1) => {
      //CHECK IF ITS ON THE CORRECT DAY AND ADD TO PROP
      let delay =0;
        Object.keys(this.props.classes).map((key) => {
              Object.keys(this.props.classes[key]).map((k) => {
                if(typeof this.props.classes[key][k] !== 'undefined' && this.props.classes[key][k] !== false){
                  //CHECK IF REPEATERS BELONG TO THE DAY
                  if(i==(this.state.today-1)){
                    let today  = (i-currWeekDay.getDay())+1;
                    let thisDate  = new Date().addDays(today);
                    let startDate = (this.props.classes[key][k].startDate || '01-01-2016').split('-');
                    let endDate = (this.props.classes[key][k].endDate).split('-');

                    if(new Date(startDate[2], startDate[1] - 1, startDate[0])>thisDate || (thisDate< new Date(endDate[2], endDate[1] - 1, endDate[0]) || endDate.length==1)){
                      //let uniqueKey=Math.floor((Math.random() * 1000) + 1);
                      this.props.classes[key][k].selectClass=(this.props.classes[key][k].class_id==this.state.activeClassId)?'active':(this.state.activeClassId!=='')?'opacity':false;
                      delay+=.03;
                      this.props.classes[key][k].delay=delay;
                      (typeof this.props.classes[key][k].repeat !=='undefined' && this.props.classes[key][k].repeat.indexOf(''+(i+1))!==-1)?prop.push(<ClassesLine key={this.props.classes[key][k].id} {... this.props.classes[key][k]}/>):false;
                    }else if(new Date(startDate[2], startDate[1] - 1, startDate[0])==thisDate){
                      prop.push(<ClassesLine key={this.props.classes[key][k].id} {... this.props.classes[key][k]}/>)
                    }
                  }
                }
              });
          })
        i++;
    });
    const classComponents = <div key={currWeekDay}>{prop}</div>;

    const tableTitle=this.TitleTable.map((title)=>{
					return <div key={title+'_title'} class={'fadeInUp animated col daily'+title}>{title}</div>
    })

    return (
        <div class="section group fadeInUp animated">
          <div class={'scheduleTime vertical-text-'+this.props.period}><span class={this.props.period+'Sche'}>{this.props.period}</span></div>
          <div class="dailyClass">
            <div class="dailyClassHeader section group">
            {tableTitle}
            </div>
            {classComponents}
          </div>
          <div class="scheduleBorder"></div>
        </div>
    );
  }
}
