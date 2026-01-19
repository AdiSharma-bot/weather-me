import Data from "./weather-api";

class Controller {
    constructor() {
        this.newData = new Data(),
            this.appState = {
                allPlaces: [],
                selectedPlace: null,
                selectedPlaceId: null,
                error: null,
                isLoading: false,
            },
            this.weatherDetails = {
                currentTemp: null,
                currentTime: null,
                currentDate: null,
                currentRain: null,
                currentPlace: null,
                currentCountry: null,
                fullCurrentDate: null,
                currentVisibility: null,
                currentWeatherType: null,
                currentHumidity: null,
                currentWind: null,
                currentDay: null,
                weatherCode: null,
                isDay: null,
                forecastTemps: [],
            }
    }

    async handleSearchInput(inputElement) {

        const inputValue = inputElement.value.trim();
        const results = await this.setSearchResults(inputValue);
        return results;

    }

    async setSearchResults(inputValue) {
        try {
            this.newData.setPlaceData(inputValue);
            const places = await this.newData.fetchPlacesData();
            const results = await places.results;
            if (!results) console.error("No array found");
            this.appState.allPlaces.length = 0;
            this.appState.allPlaces.push(results);
            return results;
        } catch (error) {
            this.handleError(error);
            return
        }

    }

    setSelectedPlaceId(id) {
        this.selectedPlaceId = id;
    }

    setSelectedPlace(place) {
        this.appState.selectedPlace = place;
    }

    getSelectedPlace() {
        return this.appState.selectedPlace;
    }
    async handlePlaceSelection() {
        try {
            this.newData.setPlaceId(this.selectedPlaceId);
            const specificPlace = await this.newData.fetchSpecificPlace();
            this.appState.selectedPlace = specificPlace;
            this.appState.selectedPlaceId = specificPlace.id;
            this.weatherDetails.currentCountry = specificPlace.country;
            if (!specificPlace.admin2) {
                this.weatherDetails.currentPlace = specificPlace.admin1;
            } else {
                this.weatherDetails.currentPlace = specificPlace.admin2;
            }

            return specificPlace;
        } catch (error) {
            this.handleError(error);
            return
        }

    }

    async handleWeatherRequest(selectedPlace) {
        try {
            const longitude = selectedPlace.longitude;
            const latitude = selectedPlace.latitude;
            this.newData.setLongitudeAndLatitude(longitude, latitude);
            const weatherDetails = await this.newData.fetchWeatherData();
            return weatherDetails;
        } catch (error) {
            this.handleError(error)
            return;
        }

    }

    async processWeatherData(selectedPlace) {
        this.setLoading(true);
        this.resetWeatherData();
        const weatherDetails = await this.handleWeatherRequest(selectedPlace);
        const currentWeatherDetails = weatherDetails.current;
        const forecastWeatherDetails = weatherDetails.daily;
        const trueVisibility = weatherDetails.hourly.visibility[0] / 1000;

        this.weatherDetails.currentVisibility = trueVisibility.toFixed(1).toString() + "km";
        this.setCurrentWeather(currentWeatherDetails);
        this.setForecastWeather(forecastWeatherDetails);
        this.setLoading(false)
        return weatherDetails;


    }

    resetWeatherData() {
        this.weatherDetails.currentTemp = null,
            this.weatherDetails.currentTime = null,
            this.weatherDetails.currentDate = null,
            this.weatherDetails.currentRain = null,
            this.weatherDetails.currentVisibility = null,
            this.weatherDetails.currentHumidity = null,
            this.weatherDetails.currentWind = null,
            this.weatherDetails.currentDay = null,
            this.weatherDetails.weatherCode = null
    }

    setForecastWeather(temperature) {
        this.weatherDetails.forecastTemps.length = 0;
        for (let i = 0; i < temperature.temperature_2m_max.length; i++) {
            const foreCastObject = {
                temperature: temperature.temperature_2m_max[i],
                feelsLike: temperature.apparent_temperature_max[i],
                weatherCode: temperature.weather_code[i],
                date: temperature.time[i],
                weatherType: this.resolveWeatherType(temperature.weather_code[i]),
                day: this.getDayName(temperature.time[i])
            };
            this.weatherDetails.forecastTemps.push(foreCastObject);
        }
    }


    setCurrentWeather(temperature) {
        this.weatherDetails.currentTemp = temperature.temperature_2m;
        this.weatherDetails.currentDate = temperature.time.slice(0, 10);
        this.weatherDetails.currentTime = temperature.time.slice(11);
        this.weatherDetails.currentHumidity = temperature.relative_humidity_2m;
        this.weatherDetails.currentRain = temperature.rain;
        this.weatherDetails.currentWind = temperature.wind_speed_10m;
        this.weatherDetails.weatherCode = temperature.weather_code;
        this.weatherDetails.fullCurrentDate = temperature.time
        this.weatherDetails.currentDay = this.getDayName(temperature.time.slice(0, 10));
        this.weatherDetails.isDay = temperature.is_day;
        this.weatherDetails.currentWeatherType = this.resolveWeatherType(this.weatherDetails.weatherCode);


    }

    getWeatherDetails() {
        return this.weatherDetails;
    }

    getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    handleError(error) {
        alert(`App ${error}`);

        this.setLoading(false);
        this.appState.error = error.message;
    }

    setLoading(state) {
        this.appState.isLoading = state;
    }

    resolveWeatherType(weatherCode) {
        switch (weatherCode) {
            case 0:
                return "Clear";
            case 1:
                return "Mainly Clear";
            case 2:
                return "Partly Cloudy";
            case 3:
                return "Cloudy";
            case 45:
                return "Foggy";
            case 48:
                return "Freezing Fog";
            case 51:
                return "Light Drizzle";
            case 53:
                return "Drizzle";
            case 55:
                return "Heavy Drizzle";
            case 56:
                return "Icy Drizzle";
            case 57:
                return "Heavy Icy Drizzle";
            case 61:
                return "Light Rain";
            case 63:
                return "Rainy";
            case 65:
                return "Heavy Rain";
            case 66:
                return "Icy Rain";
            case 67:
                return "Heavy Icy Rain";
            case 71:
                return "Light Snow";
            case 73:
                return "Snowy";
            case 75:
                return "Heavy Snow";
            case 77:
                return "Snow Flurries";
            case 80:
                return "Light Showers";
            case 81:
                return "Rainy Showers";
            case 82:
                return "Heavy Showers";
            case 85:
                return "Light Snow Showers";
            case 86:
                return "Heavy Snow Showers";
            case 95:
                return "Thunderstorm";
            case 96:
                return "Thunderstorm(hail)";
            case 99:
                return "Heavy Thunderstorm"
        }
    }

}

export default Controller