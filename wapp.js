headerHTML();
headerData();
mylocationHTML();
ninedaysHTML();
ninedaysData();


function headerHTML() {
    document.body.innerHTML = '<div class="header title"> <h1>My Weather Portal</h1></div> <header> <div class="header location">Hong Kong</div> <div class="header block">  <div class="header WeatherIcon"></div> <div class="header Temperature"></div> <div class="header Humidity"></div> <div class="header Rainfall"></div> <div class="header UVLevel"></div> </div><div class="header Warning"></div>  </<header> ';
}
function headerData(){
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en')
        .then( response => {
            response.json().then( gettingData => {
            
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
            output = '<img src="images/rain-48.png" class="rainfallIcon"></img><span class="rainfall"> '+ TempData.max  + ' </span>';
            output += '<span class="rainfall-unit"> ' + TempData.unit + '</span>';
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
                document.getElementsByTagName("header")[0].classList.add("night");
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
        response.json().then( gettingData => {
            let output = "";
            let daynum = 0;
            let ForecastData = gettingData.weatherForecast;
           
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

function mylocationHTML(){

    document.body.innerHTML += '<section></section>';
    var latitude, longitude;
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(currentpos);
    }
}

function mylocationData(){
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' +latitude + '&lon='+ longitude + '&zoom=18&addressdetails=1')
    .then( response => {
        response.json().then( gettingData => {

        });
    });
}

function currentpos(pos) {
    latitude = parseFloat(pos.coords.latitude);
    longitude =parseFloat(pos.coords.longitude);
    console.log(latitude, longitude);
    mylocationData(latitude,longitude);
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

