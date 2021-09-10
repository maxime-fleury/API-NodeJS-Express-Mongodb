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
          //console.log(jsonSTR.error.message + jsonSTR.error.error);
        });
      }
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
    //let  res = await try_get(undefined, "all", 2001, "Eur", "asc");
    //we need all genders, no limit in query, from 2001, Europ, ASC order
    //console.log(res);
}