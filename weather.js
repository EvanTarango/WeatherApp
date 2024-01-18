const apiKey = 'b29591efe10e08069642c1eb5a65c7b9';
const cityInput = document.getElementById('city');
const tempDivInfo = document.getElementById('temp-div');
const weatherInfoDiv = document.getElementById('weather-info');
const weatherIcon = document.getElementById('weather-icon');
const hourlyForecastDiv = document.getElementById('hourly-forecast');

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&units=imperial`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?&appid=${apiKey}&units=imperial`;

function getWeather() {
    const city = cityInput.value;

    if (!city) {
        alert('Please enter a city or location');
        return;
    }

    fetch(`${currentWeatherUrl}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(`${forecastUrl}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°F</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const { hour, period } = format12HourTime(dateTime.getHours());
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}</span>
                <span>${period}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function format12HourTime(hour) {
    // Function to format hour in 12-hour format with AM/PM
    let period = 'AM';
    if (hour === 0) {
        hour = 12;
    } else if (hour === 12) {
        period = 'PM';
    } else if (hour > 12) {
        hour -= 12;
        period = 'PM';
    }

    return { hour, period };
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}