var sleep = require('system-sleep');

var http = require('http');
//test_api();
async function test_api(){
    let baseUrl = 'http://localhost:8001/api/death?';
    let params = [ "sex", "limit", "time", "country"];
    let paramsContents = [];
        paramsContents[0] = [undefined, "TESTTEXT", "total", "male", "female", "Total", "Male", "Female", "Males", "Females", "males", "females"];
        paramsContents[1] = [undefined,  1, 0, 200, 999, "TESTTEXT", "all", "All", "ALL", "all15", "alltest" ];
        paramsContents[2] = [undefined,  1999, 2000, 2001, 2010, 2011, "TESTTEXT"];
        paramsContents[3] = [undefined, "germany", "Germany", "Danmark", "germ", 123];
        fullpath = "/api/death?";
        
        //yes lets bruteforce the api so we can try all combinasons of this, if no test fails everything is perfect !
        paramsContents[0].forEach(el => {
            /*let path = fullpath + params[0] + "=" + el;
            console.log(path);
            try_get(path);*/
            sleep(10);

            paramsContents[1].forEach(el2 => {
                paramsContents[2].forEach(el3 => {
                    paramsContents[3].forEach(el4 => {
                        sleep(45);
                        try_get(el, el2, el3, el4);
                        //console.log("test");
                    });
                });
            });
        });
}



async function try_get(sex, limit, time, country, order){
    fullpath = "/api/death?";
    firstParam = true;
    if(sex != undefined){
        fullpath += "sex=" + sex;
        firstParam = false;
    }
    if(limit != undefined){
        if(!firstParam) fullpath += "&";
        fullpath += "limit=" + limit;
        firstParam = false;
    }
    if(time != undefined){
        if(!firstParam) fullpath += "&";
        fullpath += "time=" + time;
        firstParam = false;
    }
    if(country != undefined){
        if(!firstParam) fullpath += "&";
        fullpath += "country=" + country;
        firstParam = false;
    }
    if(order != undefined){
        if(!firstParam) fullpath += "&";
        fullpath += "order=" + order;
        firstParam = false;
    }
    console.log(fullpath);
    let options = {
        host: "localhost",
        port: 8001,
        path: fullpath,
        method: "GET", 
        agent: false
    };
    
    callback = function(response) {
        var str = '';
      
        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });
      
        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            jsonSTR = JSON.parse(str);
            //return jsonSTR;
            analyseData(jsonSTR.death);
        });
      }

      setTimeout(function(){return jsonSTR.death },3000)
      try{
        http.request(options, callback).end();
      }
      catch(err){
          throw(err);
      }
     
}

process.on('uncaughtException', function (err) {
    console.log(err);
}); 
//AnwserQuestion();
//In EU are males dying more often then females ?
async function AnwserQuestion(){
    let  res = await try_get(undefined, undefined, 2001, undefined, "ASC");
    //we need all gender, no limit in query, from 2001, Europ, ASC order
}
function analyseData(d){
    let maleDeaths = { "year": [], "value": [] };
    let femaleDeaths = { "year": [], "value": [] };
    let total = {"female":[], 'male':[] };
    for(i=2001; i < 2011; i++){
        total.female.push({"year": i, "val": 0});
        total.male.push({"year": i, "val": 0});
    }
    for (const [key, value] of Object.entries(d)) {//fill arrays in objects
        if(value.Value != ":" ){
            if(value.SEX == "Males"){
                maleDeaths.year.push(value.TIME);
                maleDeaths.value.push(value.Value+ "");        
            }
            if(value.SEX == "Females"){
                femaleDeaths.year.push(value.TIME);
                femaleDeaths.value.push(value.Value+ "");
            }
            console.log(value.TIME + " = " + value.Value);
        }
    };
    let totm = [];
    let totf = [];
    for(i=2001;i<2011;i++){
        totm[i] = 0;
        totf[i] = 0;
    }
    maleDeaths.year.forEach((el, val) => {
        //totm[el] += val;
        console.log(typeof(maleDeaths.value[val]) + " " + typeof(femaleDeaths.value[val]));
        if(typeof(maleDeaths.value[val]) == typeof(123) || typeof(femaleDeaths.value[val]) == typeof(123) ){
            console.log(maleDeaths.value[val] + " " + femaleDeaths.value[val]);
        }
            totm[el] += parseInt((maleDeaths.value[val] + "").replace(/ /g, ""));
            totf[el] +=  parseInt((femaleDeaths.value[val]+ "").replace(/ /g, ""));
        
    })
    for(i=2001;i<2011;i++){
        console.log(totm[i]);
    }
    OTYM = 0;//over ten years males
    OTYF = 0;
    console.log("WorldWide but with Limited Data")
    for(i=0;i<10;i++){
        total.male[i].val += maleDeaths.value[i];
        total.female[i].val += femaleDeaths.value[i];
        if(parseInt(maleDeaths.value[i].replace(/ /g, "")) > parseInt(femaleDeaths.value[i].replace(/ /g, "")))
            conclusion = "More \x1b[32m Male deaths \x1b[0m in " +  total.female[i].year + " Diff= " + (parseInt(maleDeaths.value[i].replace(/ /g, "")) - parseInt(femaleDeaths.value[i].replace(/ /g, "")));
        else conclusion = "More \x1b[36m Female deaths \x1b[0m in " +  total.female[i].year + " Diff= " + (parseInt(femaleDeaths.value[i].replace(/ /g, "")) - parseInt(maleDeaths.value[i].replace(/ /g, "")));
        console.log(total.female[i].year + " F deaths: " + femaleDeaths.value[i].replace(/ /g, "") + " M deaths: " + maleDeaths.value[i].replace(/ /g, ""))
        console.log(conclusion);
        console.log();
        OTYM += parseInt(maleDeaths.value[i].replace(/ /g, ""));
        OTYF += parseInt(femaleDeaths.value[i].replace(/ /g, ""));
    }
    if(OTYM > OTYF)
    conclusion = "More \x1b[32m  Male deaths \x1b[0m in 10 YEARS Diff= " + (OTYM - OTYF);
else conclusion = "More \x1b[36m Female deaths \x1b[0m in 10 YEARS Diff= " +(OTYF - OTYM);
    console.log();
    console.log(conclusion);
   // console.log(femaleDeaths[3]);
}  