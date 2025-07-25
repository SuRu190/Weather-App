const apiKey = "3e0ed8d1e7d2758978e785af64ecc9d4";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");

// Function to fetch weather
function fetchWeather() {
    const city = cityInput.value.trim();
    if (city === "") return;

    weatherInfo.innerHTML = `<p class = "loading">Loading...</p>`; // Show loading

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod === "404") {
                weatherInfo.innerHTML = `<p class = "error">❌ City Not Found! </p>`;
            }
            else {
                const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

                const weather = `
                    <div class = "weather-card">
                        <h2> ${data.name}, ${data.sys.country} </h2>
                        <img src = "${iconUrl}" alt = "Weather icon">
                        <p>🌡️ Temp: ${data.main.temp}°C</p>
                        <p>🌥️ Condition: ${data.weather[0].main} </p>    
                        <p>💧 Humidity: ${data.main.humidity}% </p>    
                    </div>
                `;
                weatherInfo.innerHTML = weather;
            }
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