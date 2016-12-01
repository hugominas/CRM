export default {
  admin: {
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
