export default {
  admin: {
    lead:{},
    campaign:{},
    user:{},
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
