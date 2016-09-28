import React from "react";
import * as CalendarActions from "../actions/CalendarActions";
import CalendarStore from "../stores/CalendarStore";

export default class ClassLines extends React.Component {
  constructor(props) {
    super();
    this.state = {
      filters: CalendarStore.getFilters(),
    }
  }
  highligthSame(classId){
    CalendarActions.setActiveClass(classId);
  }

  render() {
    const { class_id, club_id, category, club, duration, endDate, intensity, pt, repeat, room, startDate, zona, hour, selectClass, class_link, delay  } = this.props;
    //const icon = complete ? "\u2714" : "\u2716"

    //GET FILTERSS
    return (
      <div style={{animationDelay: delay+'s'}} class={(selectClass)?'dailyClassCorp section group fadeInUp animated '+selectClass:'dailyClassCorp section group fadeInUp animated'} onClick={()=>this.highligthSame(class_id)}>
        <div class={'classColor orange-bg '+this.state.filters.class[class_id].color_class}></div>
				<div class="col dailyAula"><span>{this.state.filters.class[class_id].name}</span></div>
				<div class="col dailyHora"><span>{hour} | {duration}'</span></div>
				<div class="col dailyLocal"><span>{room}</span></div>
				<div class="col dailyCategoria"><span>{this.state.filters.class[class_id].category_name}</span></div>
				<div class="col dailyClube"><span>{this.state.filters.clubs[club_id]}</span></div>
        <div class="seeDetails"><a href={class_link}>CLASS DETAILS ></a></div>

			</div>

    );
  }
}
