import React from "react";

import ClassesBlock from "../ClassesBlock";
import CalendarStore from "../../stores/CalendarStore";
import * as CalendarActions from "../../actions/CalendarActions";
import WeekDay from "../WeekDayClass";



export default class CalendarClass extends React.Component {
  constructor() {
    super();
    CalendarActions.reloadCalendar();
    this.getCalendar = this.getCalendar.bind(this);

    this.state = {
      calendars: CalendarStore.getAll(),
      times: CalendarStore.getTimes(),
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
    CalendarStore.on("change", this.getCalendar);
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.getCalendar);
  }

  getCalendar() {
    this.setState({
      calendars: CalendarStore.getAll(),
      times: CalendarStore.getTimes(),
      view: CalendarStore.getView(),
      width:this.updateDimensions().width,
      height:this.updateDimensions().height
    });
  }

  reloadCalendar() {
    CalendarActions.reloadCalendar();
  }

  render() {
    const  calendars = this.state.calendars;
    // Visit non-inherited enumerable keys
    let a=0;
    const CalendarComponents = Object.keys(calendars).map((key) => {
      a++;
      let props = {
        classes: (calendars[key]||[]),
        period: key
      }
      //CHECK I
      return <div class={this.state.times.indexOf(key)!==-1 ? '' : 'hidden'} key={a}><WeekDay {... props}/></div>;

    });

    return (
      <div class='mainSchedule bot group section'>
        {CalendarComponents}
      </div>
    );
  }
}
