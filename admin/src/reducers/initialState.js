let thisDate = new Date()
export default {
  admin: {
    pager:{
      page:0,
      items:10,
      totalItems:0,
      totalPages:0,
      sort:'date',
      endDate:(((thisDate.getDate()<10)?'0'+thisDate.getDate():thisDate.getDate())
      +'-'+((thisDate.getMonth()<10)?'0'+thisDate.getMonth():thisDate.getMonth())
      +'-'+thisDate.getFullYear()),
      startDate:(((thisDate.getDate()<10)?'0'+thisDate.getDate():thisDate.getDate())
      +'-'+(((thisDate.getMonth()-3)<10)?'0'+(thisDate.getMonth()-3):thisDate.getMonth()-3)
      +'-'+thisDate.getFullYear())
    },
    leads:{},
    campaigns:{
      _id:'',
      local:'',
      nam:'',
      time:''
    },
    users:{},
    data:{
      leads:[],
      campaigns:[],
      users:[]
    },
  },
  auth:{
    login: '',
    valid: '',
    nowDate :  new Date(),
    passDate : new Date().setMonth(new Date().getMonth() - 1)
  }
};
