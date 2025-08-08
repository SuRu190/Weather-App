const apiKey = WEATHER_API_KEY;

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");

// Function to fetch weather
function fetchWeather() {
    const city = cityInput.value.trim();
    if (city === "") return;

    weatherInfo.innerHTML = `<p class = "loading">Loading...</p>`; // Show loading

    // 1. Current weather API
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // 2. Forecast API (for 5 - days)
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherURL)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod === "404") {
                weatherInfo.innerHTML = `<p class = "error">❌ City Not Found! </p>`;
                return;
            }

            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            let weatherHTML = `
                <div class = "weather-card">
                    <h2> ${data.name}, ${data.sys.country} </h2>
                    <img src = "${iconUrl}" alt = "Weather icon">
                    <p>🌡️ Temp: ${data.main.temp}°C</p>
                    <p>🌥️ Condition: ${data.weather[0].main} </p>    
                    <p>💧 Humidity: ${data.main.humidity}% </p>    
                </div>
                <h3 style = "margin-top: 30px;">5 - Day Forecast: </h3>
                <div class = "forecast-container" id = "forecast"></div>
            `;
            weatherInfo.innerHTML = weatherHTML;
            
            // Now fetch forecast
            fetch(forecastURL)
            .then(res => res.json())
            .then(forecastData => {
                const forecastContainer = document.getElementById("forecast");
                forecastContainer.innerHTML = "";

                // filter forecast to get one per day (12:00)
                const dailyForecast = forecastData.list.filter(item => 
                    item.dt_txt.includes("12:00:00")
                );

                dailyForecast.forEach(day => {
                    const date = new Date(day.dt_txt).toLocaleDateString();
                    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                    const temp = day.main.temp;

                    const card = `
                        <div class = "forecast-card">
                            <p>${date}</p>    
                            <img src = "${icon}" alt="">
                            <p>${temp} °C</p>
                        </div>
                    `;
                    forecastContainer.innerHTML += card;
                });
            });
        })
        .catch(() => {
            weatherInfo.innerHTML = `<p class = "error">Error Fetching Data. </p>`
        });

    cityInput.value = ""; // Clear Input
}

// Click button to search
searchBtn.addEventListener("click", fetchWeather);

// Press Enter to search
cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") fetchWeather();
});

