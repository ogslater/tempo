const apiKey = '0b6746efa9bb3581852bd709c9912ec0';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

const weatherIconMap = {
    '01d': 'sun', '01n': 'moon',
    '02d': 'sun', '02n': 'moon',
    '03d': 'cloud', '03n': 'cloud',
    '04d': 'cloud', '04n': 'cloud',
    '09d': 'cloud-rain', '09n': 'cloud-rain',
    '10d': 'cloud-rain', '10n': 'cloud-rain',
    '11d': 'cloud-lightning', '11n': 'cloud-lightning',
    '13d': 'cloud-snow', '13n': 'cloud-snow',
    '50d': 'water', '50n': 'water'
};

function updateBackground(weather, isDaytime) {
    const body = document.body;
    body.classList.remove(
        "bg-clear-day", "bg-clear-night", 
        "bg-rain-day", "bg-rain-night", 
        "bg-cloudy", "bg-snow"
    );

    if (weather.includes("rain")) {
        body.classList.add(isDaytime ? "bg-rain-day" : "bg-rain-night");
    } else if (weather.includes("cloud")) {
        body.classList.add("bg-cloudy");
    } else if (weather.includes("snow")) {
        body.classList.add("bg-snow");
    } else if (weather.includes("clear")) {
        body.classList.add(isDaytime ? "bg-clear-day" : "bg-clear-night");
    } else {
        body.classList.add("bg-cloudy"); 
    }
}

function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.list) {
                alert("Cidade não encontrada ou erro na API");
                return;
            }

            const todayWeather = data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeatherIconCode = data.list[0].weather[0].icon;

            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode] || 'help-circle'}`;
            todayTemp.textContent = todayTemperature;

            const locationElement = document.querySelector('.today-info > div > span');
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather.charAt(0).toUpperCase() + todayWeather.slice(1);

            const todayPrecipitation = `${Math.round(data.list[0].pop * 100)}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
                <div>
                    <span class="title">Precipitação</span>
                    <span class="value">${todayPrecipitation}</span>
                </div>
                <div>
                    <span class="title">Umidade</span>
                    <span class="value">${todayHumidity}</span>
                </div>
                <div>
                    <span class="title">Vento</span>
                    <span class="value">${todayWindSpeed}</span>
                </div>
            `;

            const todayDate = new Date();
            const nextDaysData = data.list.slice(1);
            const uniqueDays = new Set();
            let count = 0;

            daysList.innerHTML = '';
            for (const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('pt-BR', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon;

                if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== todayDate.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode] || 'help-circle'}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                }
                if (count === 4) break;
            }

            const weatherMain = data.list[0].weather[0].main.toLowerCase();
            const isDaytime = todayWeatherIconCode.includes("d");
            updateBackground(weatherMain, isDaytime);
        })
        .catch(error => {
            alert(`Erro ao buscar dados: ${error}`);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('São Paulo'); 
});

locButton.addEventListener('click', () => {
    const location = prompt('Digite o nome da cidade:');
    if (location) {
        fetchWeatherData(location);
    }
});
