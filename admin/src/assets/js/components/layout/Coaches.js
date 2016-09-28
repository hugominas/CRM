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
      calendars: CalendarStore.getAll(),
      trainers:CalendarStore.getActiveTrainers(),
    };

  }

  componentWillMount() {
    CalendarStore.on("change", this.getToday.bind(this));
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.getToday.bind(this));
  }


  getToday(){
    this.setState({
      calendars: CalendarStore.getAll(),
      trainers:CalendarStore.getActiveTrainers(),
    });
  }



  render() { 


    let ptCalendar = Object.keys(this.state.trainers).map((key) => {
      let {name, colour} = this.state.trainers[key];
      return <div class="prof" key={colour}><span class={'profColor '+colour}></span>{name}</div>
    })

    return (
      <div class="scheduleProfs section group">
      {ptCalendar}
      </div>
    );
  }
}
