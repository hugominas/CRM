export default {
  admin: {
    campid:'',
    data:{
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
