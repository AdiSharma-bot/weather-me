import Data from "./weather-api";

console.log("Hii from app.js");

class Controller {
    constructor() {
        this.newData = new Data(),
            this.appState = {
                allPlaces: [],
                selectedPlace: null,
                selectedPlaceId: null,
                currentWeatherData: null,
                weatherType: null,
                error: null,
                isLoading: false,
            },
            this.weatherDetails = {
                currentTemp: null,
                currentTime: null,
                currentDate: null,
                currentRain: null,
                currentVisibility: null,
                currentHumidity: null,
                currentWind: null,
                currentDay: null,
                weatherCode: null,
                forecastTemps: [],
            }
    }

    handleSearchInput(inputElement) {
        inputElement.addEventListener("input", async () => {
            try {
                const inputValue = this.inputElement.value.trim();
                const results = await this.setSearchResults(inputValue);
                return results;
            }
            catch(error) {
                this.handleError(error);
                 console.error("Caught in handleSearchInput:", error);
                 return;
            }
            
        })
    }

    async setSearchResults(inputValue) {
        this.newData.setPlaceData(inputValue);
        const places = await this.newData.fetchPlacesData();
        const results = await places.results;
        if (!results) throw new Error("No array found");
        this.appState.allPlaces.length = 0;
        console.log("Empty Place Array:", this.appState.allPlaces);
        this.appState.allPlaces.push(results);
        return results;
    }

    async handlePlaceSelection(selectedPlace) {
        this.newData.setPlaceId(selectedPlace.id);
        const specificPlace = await this.newData.fetchSpecificPlace();
        this.appState.selectedPlace = specificPlace;
        this.appState.selectedPlaceId = specificPlace.id;
        return specificPlace;
    }

    async handleWeatherRequest(selectedPlace) {
        const longitude = selectedPlace.longitude;
        const latitude = selectedPlace.latitude;
        this.newData.setLongitudeAndLatitude(longitude, latitude);
        const weatherDetails = await this.newData.fetchWeatherData();
        return weatherDetails;
    }

    async processWeatherData(selectedPlace) {
            this.setLoading(true);

        const weatherDetails = await this.handleWeatherRequest(selectedPlace);
        console.log("Error weather:", weatherDetails)
        const currentWeatherDetails = weatherDetails.current;
        const forecastWeatherDetails = weatherDetails.daily;
        const trueVisibility = weatherDetails.hourly.visibility[0] / 1000;

        this.weatherDetails.currentVisibility = trueVisibility.toString() + "km";
        this.setCurrentWeather(currentWeatherDetails);
        this.setForecastWeather(forecastWeatherDetails);
        this.setLoading(false)
        console.log("Daily Weather Details:", this.weatherDetails.forecastTemps);
        return weatherDetails;
        

    }

    setForecastWeather(temperature) {
        this.weatherDetails.forecastTemps.length = 0;
        for (let i = 0; i < temperature.temperature_2m_max.length; i++) {
            const foreCastObject = {
                temperature: temperature.temperature_2m_max[i],
                feelsLike: temperature.apparent_temperature_max[i],
                weatherCode: temperature.weather_code[i],
                date: temperature.time[i],
                day: this.getDayName(temperature.time[i])
            };
            
            console.log("Forecast Array Length:", this.weatherDetails.forecastTemps)
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
        this.weatherDetails.currentDay = this.getDayName(temperature.time.slice(0, 10));
        const weatherType = this.resolveWeatherType(temperature.weather_code);
        console.log("Weather Type:", weatherType);
    }

    getWeatherDetails() {
        console.log("Weather Details-2", this.weatherDetails);
        return this.weatherDetails;
    }

    getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    handleError(error) {
        console.log("Error handling done")
        console.error("App Error:", error);

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