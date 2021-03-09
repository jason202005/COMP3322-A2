headerHTML();
headerData();
mylocationHTML();
mySelectionHTML();
ninedaysHTML();
ninedaysData();

var gettingData ; //global data for header, mylocation and "tempature of different locations" blocks 

function headerHTML() {
    document.body.innerHTML = '<div class="headerTitle"> <h1>My Weather Portal</h1> <button class="darkmodeButton" id="btn01" onclick="Dark()">Dark Mode</button></div> <header> <div class="header location">Hong Kong</div> <div class="header block">  <div class="header WeatherIcon"></div> <div class="header Temperature"></div> <div class="header Humidity"></div> <div class="header Rainfall"></div> <div class="header UVLevel"></div> </div><div class="header Warning"></div>  </<header> ';
}
function Dark(){
    document.getElementsByTagName("body")[0].classList.toggle("dark");
    document.getElementsByTagName("header")[0].classList.toggle("dark");
    document.getElementsByTagName("section")[0].classList.toggle("dark");
    document.getElementsByClassName("headerTitle")[0].classList.toggle("dark");
    document.getElementsByClassName("nineDWFBlock")[0].classList.toggle("dark");
    document.getElementById("btn01").classList.toggle("dark");
}
function headerData(){
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en')
        .then( response => {
            response.json().then( fetchingData => {
            
            gettingData = fetchingData;
            let output = "";
            let TempData = gettingData.temperature.data[1];
            output = '<span class="temperture"> '+ TempData.value + '°' + TempData.unit + ' </span>'
            document.getElementsByClassName("header Temperature")[0].innerHTML = output;
            // Ref: https://stackoverflow.com/questions/34456436/document-getelementsbyclassname-innerhtml-not-working
            TempData = gettingData.icon[0];
            let iconurl = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${TempData}.png`;
            output = '<img src="'+ iconurl +'"> </span>'
            document.getElementsByClassName("header WeatherIcon")[0].innerHTML = output;

            TempData = gettingData.humidity.data[0];
            output = '<img src="images/drop-48.png" class="humidityIcon"></img><span class="humidity"> '+ TempData.value  + '</span>';
            output += '<span class="percent"> % </span>' ; 
            document.getElementsByClassName("header Humidity")[0].innerHTML = output;

            TempData = gettingData.rainfall.data[13];
            output = '<img src="images/rain-48.png" class="headerrainfallIcon"></img><span class="headerrainfall"> '+ TempData.max  + ' </span>';
            output += '<span class="header-rainfall-unit"> ' + TempData.unit + '</span>';
            document.getElementsByClassName("header Rainfall")[0].innerHTML = output;
            if (rainingChecker(TempData.max) == 1) {
                document.getElementsByTagName("header")[0].classList.add("raining");
            } else {
                document.getElementsByTagName("header")[0].classList.add("withoutRaining");
            }


            let mayMissingData;
            try {
                mayMissingData = gettingData.uvindex.data[0].value;
                output = '<img src="images/UVindex-48.png" class="uvindexIcon"></img><span class="uvindex">' + mayMissingData  + '</span>';
            }
            catch(err) {
                output = '<span class="uvindex"></span>';
            }
            finally {
                document.getElementsByClassName("header UVLevel")[0].innerHTML = output;
            }
           
            TempData = gettingData.updateTime.substr(11,5);
            // var hour = gettingData.updateTime.substr(11,2);
            var hour = new Date();
            if (daytimeChecker(hour.getHours()) == 1){
                document.getElementsByTagName("header")[0].classList.add("day");
            }else{
                document.getElementsByTagName("body")[0].classList.add("dark");
                document.getElementsByTagName("body")[0].classList.add("night");
                document.getElementsByTagName("header")[0].classList.add("night");
                document.getElementsByTagName("header")[0].classList.add("dark");
                document.getElementsByTagName("section")[0].classList.add("dark");
                document.getElementsByTagName("section")[0].classList.add("night");
                document.getElementsByClassName("headerTitle")[0].classList.add("dark");
                document.getElementsByClassName("headerTitle")[0].classList.add("night");
                document.getElementsByClassName("nineDWFBlock")[0].classList.add("dark");
                document.getElementsByClassName("nineDWFBlock")[0].classList.add("night");
                
            }
            let output3 = '<span class="lastupdate"> Last Update: ' + TempData + '</span>';
            
            output = '<span class="warning-title">Warning </span>';
            output2 = '';
            try {
                mayMissingData = warningMessage;
                output2 = '<span class="warning-content">' + mayMissingData  + '</span>';
            }
            catch(err) {
                output = '<span class="warning-title nowarning">Warning </span>';
                output2 = '<span class="warning-content nowarning"></span>';
            }
            finally {
                output += output2 ;
                output += output3 ;
                document.getElementsByClassName("header Warning")[0].innerHTML = output;
            }

        });
    });
}

function ninedaysHTML(){
    document.body.innerHTML += '<section><div class= "nineDWFBlock"> <div class="title"> 9-Day Forcast </div>   <div class="nine-days">  </div></div> </section>';
}

function ninedaysData(){
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en')
    .then( response => {
        response.json().then( fetchingData => {
            let output = "";
            let daynum = 0;
            let ForecastData = fetchingData.weatherForecast;
           
            for (let dayno of ForecastData){
                let month = parseInt(dayno.forecastDate.substr(6,2));
                let day = parseInt(dayno.forecastDate.substr(4,2));
                let week = dayno.week.substr(0,3);
                let maxtemp = dayno.forecastMaxtemp.value;
                let mintemp = dayno.forecastMintemp.value;
                let tempunit = '°' + dayno.forecastMintemp.unit;
                let maxhumidity = dayno.forecastMaxrh.value;
                let minhumidity = dayno.forecastMinrh.value;
                let iconurl = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${dayno.ForecastIcon}.png`;
                output = '<div class="day ' +daynum+ '">';
                output += '<span class="week'+daynum+'">' + week + '  ' + day + '/' + month +  '</span>';
                // output += '<span class="date'+daynum+'">' + day + '/' + month + '</span>';
                output += '<div class="icon '+daynum+'"><img src="'+iconurl+'"></img></div>';
                output += '<div class="temp MaxToMin">'+ mintemp + '-' + maxtemp + tempunit + '</div>';
                output += '<div class="hum MaxToMin">'+ minhumidity + '-' + maxhumidity + '%' + '</div>';
                output += '</div>';
                daynum += 1;
                document.getElementsByClassName("nine-days")[0].innerHTML += output;
            }
           
        });
    });
}

// end of nine-days block 
function mylocationHTML(){

    document.body.innerHTML += '<section><div class="myDataBlock"> <div class="title"> My Location </div> <div class="myDataContent"> <div class="LocationLoading"> Loading.... </div> <div class="top-left-loc"> <div class="district">  </div> <div class="suburb">   </div> </div> <div class="top-right-temp">  </div> <div class="bot-left-temp"> <span class="rainfallIcon"><img src="images/rain-48.png"></img></span> <span class="rainfall">  </span> </div> <div class="bot-right-temp">  <span class="aqhiIcon"></span> <div class ="aqhilevel"> <span class="aqhi"> </span> <span class="risklevel"> </span> </div></div> </div> </div> <div class="selectLocation"></div></section>';
    var latitude, longitude;
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(currentpos);
    }
}

function mySelectionHTML(){
    document.getElementsByClassName("selectLocation")[0].innerHTML = '<div class="title"> Temperatures </div> <div class="sub-title"> Select the location </div> <select id="locationSelected" onchange="mySelectFunction()"> <option value="-1"> Select a location </option> <option value="0"> King&#39;s Park </option> <option value="1"> Hong Kong Observatory </option> <option value="2"> Wong Chuk Hang </option> <option value="3"> Ta Kwu Ling </option> <option value="4"> Lau Fau Shan </option> <option value="5"> Sha Tin </option> <option value="6"> Tuen Mun </option> <option value="7"> Tseung Kwan O </option> <option value="8"> Sai Kung </option> <option value="9"> Cheung Chau </option> <option value="10"> Chek Lap Kok </option> <option value="11"> Tsing Yi </option> <option value="12"> Shek Kong </option> <option value="13"> Tsuen Wan Ho Koon </option> <option value="14"> Tsuen Wan Shing Mun Valley </option> <option value="15"> Hong Kong Park </option> <option value="16"> Shau Kei Wan </option> <option value="17"> Kowloon City </option> <option value="18"> Happy Valley </option> <option value="19"> Wong Tai Sin </option> <option value="20"> Stanley </option> <option value="21"> Kwun Tong </option> <option value="22"> Sham Shui Po </option> <option value="23"> Kai Tak Runway Park </option> <option value="24"> Yuen Long Park </option> <option value="25">Tai Mei Tuk</option> </option> </option> </select> <div id="selectedTemperture"></div>';
}

function mySelectFunction(){
    let LoCindex = document.getElementById("locationSelected").value;
    document.getElementById("selectedTemperture").innerHTML = '<span class="selectedTemp">' + gettingData.temperature.data[LoCindex].value + '</span>' ;
    document.getElementById("selectedTemperture").innerHTML += '<span class="selectedUnit">' + '°' + gettingData.temperature.data[LoCindex].unit + '</span>' ;
    
}

function mylocationData(){
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' +latitude + '&lon='+ longitude + '&zoom=18&addressdetails=1&accept-language=en')
    .then( response => {
        response.json().then( fetchingData => {
            let output = "";
            let dAnds = dAndsChecker(fetchingData) ;
            console.log(dAnds)
            let district = dAnds.d;
            let suburb =  dAnds.s;
            let locIndex = locationChecker(district, "rainfall");
            let rainData =  gettingData.rainfall.data[locIndex];
            var minD = 9999999.99999;
            airLocChecker(minD, district, suburb, rainData, output);
           

        
        });
    });
}


async function airLocChecker(minD, district, suburb, rainData, output){
    let symlat2 = latitude * Math.PI/180;
    let symlong2 = longitude * Math.PI/180;
    let saveindex = 0;
    await fetch('https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json')
    .then( response => {
        response.json().then ( fetchingData => {
            for (let index in fetchingData){
               let lat1 = fetchingData[index].latitude;
               let long1 = fetchingData[index].longitude;
               let symlat1 = lat1 * Math.PI/180;
               let symlong1 = long1 * Math.PI/180;
               
               const x = (symlong1 - symlong2) * Math.cos((symlat1+symlat2)/2);
               const y = (symlat1 - symlat2);
               const d = Math.sqrt(x*x + y*y) * 6371;
            //    console.log(d, "distance");
               if (d < minD) {
                   minD = d;
                //    console.log(minD, "mindistance adjusted");
                   saveindex = index;
               }
            }
            let nameOfStation =  fetchingData[saveindex].station_name_en;
            let stationLat = fetchingData[saveindex].latitude;
            let stationLong = fetchingData[saveindex].longitude;

            console.log(nameOfStation, "nameOfStation");
            console.log(stationLat, "stationLat");
            console.log(stationLong, "stationLong");

            var tempMylocation, unitMylocation;
            let tempdata = gettingData.temperature.data;
            for (let ind in tempdata){
                // console.log(tempdata[ind].place, "tempdata[ind].place");
                
                if (tempdata[ind].place.includes(nameOfStation)){
                    tempMylocation = tempdata[ind].value ;
                    unitMylocation = tempdata[ind].unit;
                    // console.log(tempMylocation, unitMylocation, "success");
                }
            }

            
            fetch("data/aqhi-station-info.json")
            .then( response => {
                response.json().then ( fetchingAirLocationData => {
                    
                    
                    for (let index in fetchingAirLocationData){
                        // console.log(fetchingAirLocationData[index].station, "fetchingAirLocationData[stat].station");
                        
                        let lat1 = fetchingAirLocationData[index].lat;
                        let long1 = fetchingAirLocationData[index].long;
                        let symlat1 = lat1 * Math.PI/180;
                        let symlong1 = long1 * Math.PI/180;
                        
                        const x = (symlong1 - symlong2) * Math.cos((symlat1+symlat2)/2);
                        const y = (symlat1 - symlat2);
                        const d = Math.sqrt(x*x + y*y) * 6371;
                        //    console.log(d, "distance");
                        if (d < minD) {
                            minD = d;
                            //    console.log(minD, "mindistance adjusted");
                            saveindex = index;
                        }
                    }
                    let nameOfAirStation =  fetchingAirLocationData[saveindex].station;
                    console.log(nameOfAirStation, "nameOfAirStation");

                    var aqhi, risklevel;
                    fetch('https://dashboard.data.gov.hk/api/aqhi-individual?format=json')
                    .then( response => {
                        response.json().then ( fetchingAirData => {
                            for (let stat in fetchingAirData){
                                if (fetchingAirData[stat].station.includes(nameOfAirStation) )
                                {
                                    aqhi = fetchingAirData[stat].aqhi ;
                                    risklevel = fetchingAirData[stat].health_risk;
                                    // console.log(aqhi, "aqhi");
                                    // console.log(risklevel, "risklevel");
                                    
                                }
                            }
                           
                            document.getElementsByClassName("rainfallIcon")[0].classList.add("ready");
                            document.getElementsByClassName("district")[0].innerHTML = district;
                            document.getElementsByClassName("suburb")[0].innerHTML = suburb;
                           
                            output = '<span class="mylocation-degree">' + tempMylocation + '</span>' + '<span class="mylocation-unit">' + '°' + unitMylocation + '</span>';
                            document.getElementsByClassName("top-right-temp")[0].innerHTML = output;
                            
                            output = '<span class="mylocation-rainMax">' +rainData.max + '</span>' +'<span class="mylocation-Runit">' + rainData.unit+ '</span>';
                            document.getElementsByClassName("rainfall")[0].innerHTML = output;
                            
                            document.getElementsByClassName("aqhi")[0].innerHTML = aqhi;
                            let imageSrc = `images/aqhi-${risklevel}.png`;
                            document.getElementsByClassName("aqhiIcon")[0].innerHTML = '<img src="'+imageSrc+'"></img>';
                            
                            document.getElementsByClassName("risklevel")[0].innerHTML = risklevel;
                
                           
                        });
                    });

                    
                    
                });
            });
            
            
            
         
            
        });
        
    });
    
}

function locationChecker(district, type){
    
    let index = 0;
    if (district.includes("District")){
        let range = district.length  - 9; //8 for district 1 for space
        district = district.substr(0,range);
    }
    console.log(district, index);

    for (let loc in locationList){
        // console.log(locationList[loc], loc);
        if (type === "rainfall"){
            if (gettingData.rainfall.data[loc].place.includes(district) )
            {
                console.log(gettingData.rainfall.data[loc], loc ,"success");
                return loc;
            }
        }
        //basic 25 districts
        if (locationList[loc].includes(district)){
            console.log(locationList[loc], loc);
            return loc;
        }
    }
    // otherwise return HKO data
    return 1;
}

const locationList =[
    "King's Park", 
    "Hong Kong Observatory" ,
    "Wong Chuk Hang" ,
    "Ta Kwu Ling" ,
    "Lau Fau Shan" ,
    "Sha Tin" ,
    "Tuen Mun" ,
    "Tseung Kwan O" ,
    "Sai Kung" ,
    "Cheung Chau" ,
    "Chek Lap Kok" ,
    "Tsing Yi" ,
    "Shek Kong" ,
    "Tsuen Wan Ho Koon" ,
    "Tsuen Wan Shing Mun Valley" ,
    "Hong Kong Park" , 
    "Shau Kei Wan" , 
    "Kowloon City" , 
    "Happy Valley" , 
    "Wong Tai Sin" , 
    "Stanley" , 
    "Kwun Tong" , 
    "Sham Shui Po" , 
    "Kai Tak Runway Park" , 
    "Yuen Long Park" , 
    "Tai Mei Tuk" 
]

function currentpos(pos) {
    latitude = parseFloat(pos.coords.latitude);
    longitude =parseFloat(pos.coords.longitude);
    console.log(latitude, longitude);
    document.getElementsByClassName("LocationLoading")[0].classList.add("ready");
    document.getElementsByClassName("myDataContent")[0].classList.add("ready");
    mylocationData(latitude,longitude);
    
}

function dAndsChecker(data){
    let dAnds = {
        d: "",
        s: ""
    }; 
    if (data.address.city_district){ 
        dAnds.d = data.address.city_district;
    }else if (data.address.country){
        dAnds.d = data.address.country;
    }else {
        dAnds.d = "Unknown";
    }

    if (data.address.suburb){ 
        dAnds.s = data.address.suburb;
    }else if (data.address.borough){
        dAnds.s = data.address.borough;
    }
    else if (data.address.town){
        dAnds.s = data.address.town;
    } else {
        dAnds.s = "Unknown";
    }
    return dAnds;
}

function rainingChecker(volume) {
    if ( volume > 0 ) return 1;
    else return 0;
}

function daytimeChecker(hour){
    if (parseInt(hour) > 5 && parseInt(hour) < 18){
        return 1;
    }
    else {
        return 0;
    }
}

