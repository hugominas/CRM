import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import {Bar} from 'react-chartjs-2';

import * as types from '../../actions/actionTypes';
import * as actions from '../../actions/adminActions';


@connect((store) => {
  return {
    data : store.admin.data.overview,
    pager: store.admin.pager
  };
})
export default class Dashboard extends React.Component {

  constructor (props){
    super();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.pager.startDate !== this.props.startDate
      || prevProps.pager.endDate !== this.props.endDate ){
        this.props.dispatch(actions.get('overview',this.props.params.campid,{... this.props.pager}));
      }
  }

  componentWillMount() {
    this.props.dispatch(actions.get('overview',this.props.params.campid,{... this.props.pager}));
  }

  workData(){
    let datafield=[];
    let datalabels=[];

    this.props.data.sort((a,b)=>{
      return parseInt((a._id.year+''+((a._id.month<10)?'0'+a._id.month:a._id.month)+''+((a._id.day<10)?'0'+a._id.day:a._id.day)))-
      parseInt(b._id.year+''+((b._id.month<10)?'0'+b._id.month:b._id.month)+''+((b._id.day<10)?'0'+b._id.day:b._id.day))
    }).map(ele=>{
      datafield.push(ele.total);
      datalabels.push(((ele._id.month<10)?'0'+ele._id.month:ele._id.month)+'/'+((ele._id.day<10)?'0'+ele._id.day:ele._id.day));
    })

    return {
        labels: datalabels,
        datasets: [
            {
                label: "Sales per date",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#f16f21",
                borderColor: "#e7383a",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: datafield,
                spanGaps: false,
            }
        ]
    };
  }

  render() {
    return (
      <DocumentTitle title={'Dashboard'}>
        <div class="container innerCont upContainer graph">
          <Bar data={this.workData()}
                options={{
                      maintainAspectRatio: false
                  }}
                 height={400}
                 />
        </div>
      </DocumentTitle>
    );
  }
}
