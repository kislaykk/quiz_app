const {getResult} = require('./resultService');

getResult(1,'qwerty').then((d)=>console.log(JSON.stringify(d,null,2)));