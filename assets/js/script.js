// Variables 
let searchButton = $(".searchButton");

let apiKey = "b8ecb570e32c2e5042581abd004b71bb";

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {
    
    // Creates city list with local storage
    var city = localStorage.getItem(i);
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}
// Key count for local storage 
let keyCount = 0;
// Search button click event
searchButton.click(function () {

    let searchInput = $(".searchInput").val();

    // Variable for current weather working 
    let urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast working
    let urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";


    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            // list-group append an li to it with just set text
            // console.log(response.name);
            let cityName = $(".list-group").addClass("list-group-item");
            cityName.append("<li>" + response.name + "</li>");
            // Local storage
            let local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;

            // Start Current Weather append 
            let currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            let currentName = currentCard.append("<p>");
            // .addClass("card-text");
            currentCard.append(currentName);

            // Adjust Date 
            let timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp 
            let currentTemp = currentName.append("<p>");
            // .addClass("card-text");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // UV Index URL
            let urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // UV Index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {

                let currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentTemp.append(currentUV);
                // currentUV.append("UV Index: " + response.value);
            });

        });

        // Start call for 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
            // Array for 5-days 
            let day = [0, 8, 16, 24, 32];
            let fiveDayCard = $(".fiveDayCard").addClass("card-body");
            let fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                let FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");


            })

        });
    }
});