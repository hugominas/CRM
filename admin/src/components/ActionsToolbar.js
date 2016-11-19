import React from "react";
import { connect } from "react-redux"
import { Button, ButtonToolbar } from 'react-bootstrap';


@connect((store) => {
  return {
    data: []
  };
})


export default class ActionsToolbar extends React.Component {
  constructor(props) {
    super();
    //this.state={data:setTimeout(LeadStore.get(props.data),3000)}; store.admin.data[props.data]
  }

  exportData (){

         var objArray = this.state.data;
         var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
         var str = '';
         var header ='';

         for (var i = 0; i < array.length; i++) {
             var line = '';
             for (var index in array[i]) {
                 if(i==0){
                     if(line != '') header += ';'
                     header += index;
                 }
                 if(line != '') line += ';'
                 var thisContent = array[i][index];
                 if(thisContent) {
                    //thisContent=thisContent.split("\n").join(" ");
                      // if(thisContent.indexOf(/(?:\r\n|\r|\n)/g)!=-1) thisContent = thisContent.replace(/(?:\r\n|\r|\n)/g, '<br />');
                  }
                   line += thisContent;
               }

             str += line + '\r\n';
         }
         str=header+ '\r\n'+str;
          //window.open('data:text/csv;charset=utf-8;base64' + $.base64.encode(str));
         if(typeof Blob !== 'undefined'){
             var a = document.createElement("a");
             document.body.appendChild(a);
             a.style = "display: none";

             let csvData = new Blob([str], { type: 'text/csv' }); //new way
             //var csvUrl = URL.createObjectURL(csvData);
             let url = window.URL.createObjectURL(csvData);

             a.href = url;
             a.download = 'data.csv';
             a.click();
             window.URL.revokeObjectURL(url);


         }else{
             window.open("data:text/csv;charset=utf-8," + escape(str))
             //console.log($.base64.encode(str));
         }

  }



  render() {
      return (
        <div class="getData" >

        <Button bsStyle="warning" onClick={()=>this.exportData()}>click here to download all data</Button>
        </div>
    );
  }
}
