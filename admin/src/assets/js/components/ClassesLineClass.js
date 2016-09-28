import React from "react";
import * as CalendarActions from "../actions/CalendarActions";
import CalendarStore from "../stores/CalendarStore";

export default class ClassesLineClass extends React.Component {
  constructor(props) {
    super();
    this.state = {
      filters: CalendarStore.getFilters(),
      activeTrainers: CalendarStore.getActiveTrainers(),
    }
  }
  highligthSame(classId){
    CalendarActions.setActiveClass(classId);
  }

  render() {
    const { class_id, club_id, category, club, duration, endDate, intensity, pt, repeat, room, startDate, zona, hour, selectClass, class_link, delay  } = this.props;
    //const icon = complete ? "\u2714" : "\u2716"
    const ptDetails = this.state.activeTrainers.filter((val)=>{return val.name == pt})
    const thisColor = (typeof ptDetails[0] !== 'undefined')?ptDetails[0].colour:'';
    //GET FILTERSS
    return (
      <div style={{animationDelay: delay+'s'}} class={(selectClass)?'hourBlock fadeInUp animated '+selectClass:'hourBlock fadeInUp animated'} onClick={()=>this.highligthSame(class_id)}>

        <div><span>{hour} | {duration}'</span><span class={'profSlice '+thisColor}></span></div>
			</div>

    );
  }
}
