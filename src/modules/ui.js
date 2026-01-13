import Controller from "./app"
console.log("Hello From ui.js")

class WeatherUI {
    constructor() {
        this.searchElements = this.initSearchElements(),
        this.weatherCardElements = this.initWeatherCardElements(),
        this.forecastElements = this.initForecastElements(),
        this.newController = new Controller()

    }
    initSearchElements() {
        return {
            inputElement: document.querySelector("#search"),
            searchBtn: document.querySelector(".search-btn"),
            crossBtn: document.querySelector(".cross-btn"),
            suggestionsContainer: document.querySelector(".search-suggestions-container"),
        }
    }

    initWeatherCardElements() {
        const weatherCardElement = document.querySelector(".weather-card");
        const headerElement = weatherCardElement.querySelector("header");
        const descriptionContainer = weatherCardElement.querySelector(".weather-description");
        
        const rainContainerDiv = headerElement.querySelector(".rain");
        const visibilityContainerDiv = headerElement.querySelector(".visibility");
        const windContainerDiv = weatherCardElement.querySelector(".wind");
        const humidityContainerDiv = weatherCardElement.querySelector(".humidity");
        return {
            weatherCard: weatherCardElement,
            header: headerElement,
            headerElementChildren: {
                imageElement: headerElement.querySelector("img"),
                timeElement: headerElement.querySelector("time"),
                tempElement: headerElement.querySelector(".temp"),
                addressElement: headerElement.querySelector("address"),
                rainElement: rainContainerDiv,
                visibilityElement: visibilityContainerDiv,
                cardSearchBtn: headerElement.querySelector("button"),
                rainChildren: {
                    dtElement: rainContainerDiv.querySelector("dt"),
                    ddElement: rainContainerDiv.querySelector("dd")
                },
                visibilityChildren: {
                    dtElement: visibilityContainerDiv.querySelector("dt"),
                    ddElement: visibilityContainerDiv.querySelector("dd")
                },

            },
            weatherArticleElement: descriptionContainer,
            descriptionPara: descriptionContainer.querySelector("p"),
            windElement: windContainerDiv,
            humidityElement: humidityContainerDiv,
            windChildren: {
                dtElement: windContainerDiv.querySelector("dt"),
                ddElement: windContainerDiv.querySelector("dd"),
            },
            humidityChildren: {
                dtElement: humidityContainerDiv.querySelector("dt"),
                ddElement: humidityContainerDiv.querySelector("dd"),
            }

        }
    }

    initForecastElements() {
        const forecastContainer = document.querySelector(".forecast-pills-container");
        const forecastUlElement = forecastContainer.querySelector("ul")

        return {
            forecastParent: forecastContainer,
            forecastUl: forecastUlElement,
            forecastChildren: {
                liElements: forecastUlElement.querySelectorAll("li"),
                forecastDay: document.querySelectorAll(".forcast-day"),
                forecastTemperature: forecastUlElement.querySelectorAll(".forecast-temprature"),
                forecastApparentTemperature: forecastUlElement.querySelectorAll(".forecast-apparent-temp"),
                forecastIcons: forecastUlElement.querySelectorAll("img")

            }
        }

    }
    showElements() {
        console.log(this.weatherCardElements);
        console.log(this.forecastElements);
    }
}
const ui = new WeatherUI();
console.log("Ui Class",ui)
ui.showElements()
export default WeatherUI