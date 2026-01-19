class Data {

    constructor() {
        this.longitude = null,
            this.latitude = null,
            this.placeName = null,
            this.placeId = null,
            this.weatherBaseUrl = `https://api.open-meteo.com/v1/forecast?`,
            this.placesBaseUrl = `https://geocoding-api.open-meteo.com/v1/search?`,
            this.specificPlaceUrl = `https://geocoding-api.open-meteo.com/v1/`
    }

    setLongitudeAndLatitude(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    setPlaceData(placeName) {
        this.placeName = placeName;
    }

    setPlaceId(id) {
        this.placeId = id;
    }

    dataCheck(condition, errorMessage) {
        if (!condition) {
            console.error(errorMessage)
        }
    }

    async responseCheck(response) {
      if (!response.ok) {
        console.error(`API failed with status ${response.status}`);
        
      }  
      
    }

    async fetchWeatherData() {
        this.dataCheck(this.longitude !== null && this.latitude !== null, "Longitude or latitude is not available.")
        const url = `${this.weatherBaseUrl}latitude=${this.latitude}&longitude=${this.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,visibility&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,apparent_temperature,precipitation,rain,showers,cloud_cover,weather_code&timezone=auto`;
        const weather = await fetch(url);
        await this.responseCheck(weather);
        const response = await weather.json();
        return response;
    }

    async fetchPlacesData() {
        this.dataCheck(this.placeName, "Place name not available");
        const url = `${this.placesBaseUrl}name=${this.placeName}&count=10&language=en&format=json`
        const places = await fetch(url);
        this.responseCheck(places)
        const placeData = await places.json();
        
        return placeData;
    }

    async fetchSpecificPlace() {
        this.dataCheck(this.placeId, "Place Id not available");
        const url = `${this.specificPlaceUrl}get?id=${this.placeId}`
        const specificPlace = await fetch(url);
        this.responseCheck(specificPlace);
        const specificPlaceData = await specificPlace.json();
        
        return specificPlaceData;
    }

    resetStates() {
        this.placeId = null;
        this.longitude = null;
        this.latitude = null;
        this.placeName = null;
    }
}


export default Data