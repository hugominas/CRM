import React from "react";

import Filters from "../components/layout/Filters";
import Calendar from "../components/layout/Calendar";
import Header from "../components/layout/Header";
import Coaches from "../components/layout/Coaches";
import HeaderClass from "../components/layout/HeaderClass";
import CalendarClass from "../components/layout/CalendarClass";

import CalendarStore from "../stores/CalendarStore";

//import * as CalendarActions from "../actions/CalendarActions";

export default class Layout extends React.Component {
  constructor() {
    super();
  }


  render() {
    let templateHtml = <div><Filters location={location} /><Header location={location} /><Calendar location={location} /></div>

    if(CalendarStore.activeFilters.class.length>0){
      templateHtml = <div class="schedule-class"><Coaches /><HeaderClass location={location} /><CalendarClass location={location} /></div>
    }

    //console.log(templateHtml)

    return templateHtml;
  }
}
