async function getWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = '686f17ae0f0ddc75c8c8882b5ff8727f';  // Вставь свой API-ключ здесь
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById('city-name').innerText = `Погода в ${data.name}`;
            document.getElementById('temperature').innerText = `Температура: ${data.main.temp}°C`;
            document.getElementById('weather-description').innerText = data.weather[0].description;
        } else {
            alert('Город не найден. Попробуйте снова.');
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось получить данные. Проверьте соединение и повторите попытку.");
    }
}
