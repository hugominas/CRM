import React from "react";
import { Link, IndexLink } from "react-router";

import ClassesBlock from "../ClassesBlock";
import * as CalendarActions from "../../actions/CalendarActions";
import CalendarStore from "../../stores/CalendarStore";


export default class Filters extends React.Component {
  constructor(props) {
    super();
    this.reloadFilters();
    this.getFilters = this.getFilters.bind(this);
    this.state = {
      filters: CalendarStore.getFilters(),
      intensity: CalendarStore.getIntensity(),
      time:CalendarStore.getTimes(),
      view:CalendarStore.getView(),
      actList:CalendarStore.getActFilter(),
      clubList:CalendarStore.getCLubFilter(),
      selectedAct:(CalendarStore.getActFilter().length + ' Activities selected'),
      selectedClub:(CalendarStore.getCLubFilter().length + ' Clubs selected')
    };
  }

  componentWillMount() {
    CalendarStore.on("change", this.getFilters);
  }

  componentWillUnmount() {
    CalendarStore.removeListener("change", this.getFilters);
  }

  getFilters() {
    this.setState({
      filters: CalendarStore.getFilters(),
      intensity: CalendarStore.getIntensity(),
      time:CalendarStore.getTimes(),
      view:CalendarStore.getView(),
      actList:CalendarStore.getActFilter(),
      clubList:CalendarStore.getCLubFilter(),
      selectedAct:(CalendarStore.getActFilter().length + ' selected'),
      selectedClub:(CalendarStore.getCLubFilter().length + ' selected')
    });
  }

  updateViewTime(time) {
      let thisPosition=this.state.time.indexOf(time);
      (thisPosition!==-1)?this.state.time.splice(thisPosition,1):this.state.time.push(time);
      CalendarActions.setViewTimes(this.state.time);
  }

  updateIntensity(inten) {
      CalendarActions.updateIntensity(inten);
  }

  updateClubFilter(clubId) {
      CalendarActions.updateClubFilter(''+clubId);
      this.showGyms(this.state.showGymsToggle)
  }

  updateCategoryFilter(catId) {
      CalendarActions.updateCategoryFilter(''+catId);
      this.showAct(this.state.showActToggle)
  }


  updateView(view) {
      CalendarActions.updateView(view);
  }

  reloadFilters() {
      CalendarActions.reloadFilters();
  }

  showGyms(state){
    state=(!state)?true:false;
    this.setState({
      showGymsToggle: state
    })
  }

  showAct(state){
    state=(!state)?true:false;
    this.setState({
      showActToggle: state
    })
  }

  resetClasses(){
    CalendarActions.resetClasses();
  }

  resetGym(){
    CalendarActions.resetGym();
  }

  render() {

    const { location } = this.props
    let currentView = 'Weekly';
    let weekActive = "active"
    let dayActive = ""
    //SET TYPE LABEL
    if(this.state.view=='daily'){
      currentView = 'Daily';
      weekActive = ""
      dayActive = "active"
    }
    let fromToTime ='07:00 to 12:00';
    let actMor=(this.state.time.indexOf('morning')!==-1)?'active':'';
    let actEve=(this.state.time.indexOf('evening')!==-1)?'active':'';
    let actAft=(this.state.time.indexOf('afternoon')!==-1)?'active':'';

    //SET TIME LABEL
    if(actMor=='active'&&actEve=='active'&&actAft=='active'){fromToTime='07:00 to 23:00';}
    else if(actMor=='active'&&actAft=='active'){fromToTime='07:00 to 19:00';}
    else if(actEve=='active'&&actAft=='active'){fromToTime='12:00 to 23:00';}
    else if(actMor=='active'&&actEve=='active'){fromToTime='07:00 to 23:00';}
    else if(actEve=='active'){fromToTime='19:00 to 23:00';}
    else if(actAft=='active'){fromToTime='12:00 to 19:00';}

    //SET INT label
    let intLabel=''
    for(let a=0;a<this.state.intensity;a++){intLabel+='I'}

    //SET CLUBS LIST
    let localList = '';
    if(this.state.filters.locations){
      localList = Object.keys(this.state.filters.locations.clubs).map((location)=>{
        let clublist = Object.keys(this.state.filters.locations.clubs[location]).map((club)=>{
          let thisId = this.state.filters.locations.clubs[location][club];
          return <li key={thisId}><input type="checkbox" checked={(this.state.clubList.indexOf(''+thisId)!==-1)} id={thisId} onChange={()=>this.updateClubFilter(thisId)} /><label for={thisId}><span></span>{this.state.filters.clubs[thisId]}</label></li>;
        })
        return <div key={location}><h3>{location}</h3><ul>{clublist}</ul></div>;
      })
    }

    //SET Activity LIST
    let actList = [];
    let activityCatList = '';
    if(this.state.filters.class){
       Object.keys(this.state.filters.class).map((classes)=>{
         if(!actList.hasOwnProperty(this.state.filters.class[classes].category_name))actList[this.state.filters.class[classes].category_name]=[];
         this.state.filters.class[classes].id=classes;
         actList[this.state.filters.class[classes].category_name].push(this.state.filters.class[classes])
       })
       let a = 0;
       activityCatList=Object.keys(actList).map((activity)=>{
         let activityClassList=Object.keys(actList[activity]).map((classes)=>{
           a++;
           return <li key={a+'_classDetail'}><input type="checkbox" checked={(this.state.actList.indexOf(''+actList[activity][classes].id)!==-1)} id={actList[activity][classes].id} onChange={()=>this.updateCategoryFilter(actList[activity][classes].id)} /><label for={actList[activity][classes].id}><span></span>{actList[activity][classes].name}</label></li>;
         })
         return <div key={activity}><h3>{activity}</h3><ul>{activityClassList}</ul></div>;
       })

    }

    return (

      <div class="section group scheduleFilters">
        <div class="col span_2_of_12 calendarMode">
          <p class="style animated fadeInLeft">VIEW STYLE</p>
          <div class="weekly">
            <div class={'icon animated fadeInUp '+weekActive} onClick={()=>this.updateView('weekly')}></div>
          </div>
          <div class="daily">
            <div class={'icon animated fadeInUp '+dayActive} onClick={()=>this.updateView('daily')}></div>
          </div>
          <p class="type animated fadeInUp" style={{animationDelay: '1.3s'}}>{currentView}</p>

        </div>
        <div class="col span_3_of_12 gymLocation">
          <p class="animated fadeInLeft">CHOOSE A GYM</p>
          <div class="searchGym animated fadeInUp" style={{animationDelay: '0s'}} onClick={()=>this.showGyms(this.state.showGymsToggle)}>
           <span>{this.state.selectedClub}</span>▼
          </div>
          <div class={this.state.showGymsToggle ? "optionsGym active animated fadeIn" : "optionsGym"}>
          {localList}
            <div class="resetChoises">
              <span onClick={()=>this.resetGym()}>RESET CHOISES</span>
            </div>
          </div>
        </div>
        <div class="col span_3_of_12 gymActivities">
          <p class="animated fadeInLeft">FILTER ACTIVITIES</p>
          <div class="searchClass animated fadeInUp"  style={{animationDelay: '.5s'}} onClick={()=>this.showAct(this.state.showActToggle)}>
            <span>{this.state.selectedAct}</span>▼
          </div>
          <div class={this.state.showActToggle ? "optionsClass active animated fadeIn" : "optionsClass animated fadeInUp"}>
            {activityCatList}
            <div class="allClasses">
              <span onClick={()=>this.resetClasses()}>VIEW ALL CLASSES</span>
            </div>
          </div>
        </div>
        <div class="col span_2_of_12 classIntensity">
          <p class="animated fadeInLeft">INTENSITY</p>
          <div class="intensityLevel group section">
          <div  style={{animationDelay: '.6s'}} class={(this.state.intensity>=0)?'first intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(0)}></div>
          <div  style={{animationDelay: '.7s'}} class={(this.state.intensity>=1)?'intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(1)}></div>
          <div  style={{animationDelay: '.8s'}} class={(this.state.intensity>=2)?'intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(2)}></div>
          <div  style={{animationDelay: '.9s'}} class={(this.state.intensity>=3)?'intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(3)}></div>
          <div  style={{animationDelay: '1.0s'}} class={(this.state.intensity>=4)?'intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(4)}></div>
          <div  style={{animationDelay: '1.1s'}} class={(this.state.intensity>=5)?'intensityBlock active animated fadeInUp':'intensityBlock animated fadeInUp'} onClick={()=>this.updateIntensity(5)}></div>

          </div>
          <p class="type animated fadeInUp" style={{animationDelay: '1.4s'}}>{intLabel}</p>
        </div>
        <div class="col span_2_of_12 classTime">
          <p class="animated fadeInLeft">DAY TIME</p>
          <div style={{animationDelay: '1.2s'}} class="dayTime animated fadeInUp">
            <span class={'morning '+actMor} onClick={()=>this.updateViewTime('morning')}></span>
            <span class={'afternoon '+actAft} onClick={()=>this.updateViewTime('afternoon')}></span>
            <span class={'evening '+actEve} onClick={()=>this.updateViewTime('evening')}></span>
          </div>
          <p class="type animated fadeInUp" style={{animationDelay: '1.5s'}}>{fromToTime}</p>
        </div>
      </div>
    );
  }
}
