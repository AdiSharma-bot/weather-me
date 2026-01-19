import Controller from "./app"

class WeatherUI {

    

    constructor() {
        this.searchElements = this.initSearchElements(),
            this.weatherCardElements = this.initWeatherCardElements(),
            this.forecastElements = this.initForecastElements(),
            this.newController = new Controller()
    }

    // html elements references start 

    initSearchElements() {
        return {
            inputElement: document.querySelector("#search"),
            searchBtn: document.querySelector(".search-btn"),
            crossBtn: document.querySelector(".cross-btn"),
            searchContainer: document.querySelector(".search-container"),
            suggestionsContainer: document.querySelector(".search-suggestions-container"),
            backgroundOverlay: document.querySelector(".background-overlay")
        }
    }

    initWeatherCardElements() {
        const weatherCardElement = document.querySelector(".weather-card");
        const headerElement = weatherCardElement.querySelector("header");
        const descriptionContainer = weatherCardElement.querySelector(".weather-description");
        const mainContainer = document.querySelector("main");
        const rainContainerDiv = headerElement.querySelector(".rain");
        const visibilityContainerDiv = headerElement.querySelector(".visibility");
        const windContainerDiv = weatherCardElement.querySelector(".wind");
        const humidityContainerDiv = weatherCardElement.querySelector(".humidity");
        return {
            weatherCard: weatherCardElement,
            header: headerElement,
            mainElement: mainContainer,
            headerElementChildren: {
                imageElement: headerElement.querySelector("img"),
                timeElement: headerElement.querySelector("time"),
                dayElement: headerElement.querySelector(".day"),
                timeSpanElement: headerElement.querySelector("span.time"),
                tempElement: headerElement.querySelector(".temp"),
                temperatureSpanElement: headerElement.querySelector(".temperature"),
                tempLabelSpanElement: headerElement.querySelector(".label"),
                addressElement: headerElement.querySelector("address"),
                counrtySpan: headerElement.querySelector(".country"),
                citySpan: headerElement.querySelector(".city"),
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
            },
            loadingSpinner: document.querySelector(".spinner"),
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
                forecastArticle: forecastUlElement.querySelectorAll("article"),
                forecastDay: document.querySelectorAll(".forcast-day"),
                forecastTemperature: forecastUlElement.querySelectorAll(".forecast-temprature"),
                forecastApparentTemperature: forecastUlElement.querySelectorAll(".forecast-apparent-temp"),
                forecastIcons: forecastUlElement.querySelectorAll("img")

            }
        }
    }


    // HTML references end

    // Search suggestions for places

    async renderSearchSuggestions(inputElement, dataList) {
        const places = await this.newController.handleSearchInput(inputElement);
        dataList.innerHTML = "";
        places.forEach((place) => {
            const option = document.createElement("button");
            option.textContent = `${place.name}, ${place.admin1}, ${place.country}`;
            option.style.visibility = "inherit";
            option.setAttribute("data-id", place.id);
            dataList.appendChild(option);
        })

    }


    // Event listener function 


    init() {
        const inputElement = this.searchElements.inputElement;
        const dataList = this.searchElements.suggestionsContainer;
        const searchBtn = this.searchElements.searchBtn;
        const crossBtn = this.searchElements.crossBtn;
        const cardSearchBtn = this.weatherCardElements.headerElementChildren.cardSearchBtn;
        const overlayDiv = this.searchElements.backgroundOverlay;
        inputElement.addEventListener("input", () => this.renderSearchSuggestions(inputElement, dataList));
        dataList.addEventListener("click", (ev) => this.managePlaceSelection(inputElement, ev));
        searchBtn.addEventListener("click", () => {

            if (inputElement.value.trim() === "") return;
            if (this.newController.appState.selectedPlaceId === null) {
                alert("Please select a place from given suggestions.");
                return;
            };
            this.manageWeatherSelection();

            this.hideSearchContainer();

        });
        cardSearchBtn.addEventListener("click", () => {
            inputElement.value = "";
            dataList.innerHTML = "";
            this.renderSearchContainer();

        });
        overlayDiv.addEventListener("click", () => this.hideSearchContainer());
        crossBtn.addEventListener("click", () => this.manageCrossBtn(inputElement, dataList));
    }


    // Place selection

    async managePlaceSelection(inputElement, event) {
        const clickedOption = event.target.closest("button");
        if (!clickedOption) {
            return;
        }
        clickedOption.setAttribute("data-selected", "");
        inputElement.value = clickedOption.textContent;
        this.newController.setSelectedPlaceId(clickedOption.dataset.id);
        const selectedPlace = await this.newController.handlePlaceSelection();
        this.newController.setSelectedPlace(selectedPlace);
    }

    manageCrossBtn(inputElement, dataList) {
        inputElement.value = "";
        dataList.innerHTML = "";
        return;
    }

    renderSearchContainer() {
        this.showSearchContainer();
        this.weatherCardElements.weatherCard.classList.add("blur");
        this.searchElements.backgroundOverlay.classList.add("show");
    }

    showSearchContainer() {
        this.searchElements.searchContainer.classList.remove("hide");
    }

    hideSearchContainer() {
        this.weatherCardElements.weatherCard.classList.remove("blur");
        this.searchElements.backgroundOverlay.classList.remove("show");
        this.searchElements.searchContainer.classList.toggle("hide");
    }

    async manageWeatherSelection() {
        this.showLoader();
        const selectedPlace = this.newController.getSelectedPlace();
        const weather = await this.newController.processWeatherData(selectedPlace);
        const weatherDetails = this.newController.getWeatherDetails();

        this.renderWeatherDetails(weatherDetails);
        this.hideLoader();
    }

    async renderWeatherDetails(weather) {

        this.weatherCardElements.headerElementChildren.timeElement.dateTime = weather.fullCurrentDate;
        this.weatherCardElements.headerElementChildren.dayElement.textContent = weather.currentDay;
        this.weatherCardElements.headerElementChildren.timeSpanElement.textContent = weather.currentTime;
        this.weatherCardElements.headerElementChildren.temperatureSpanElement.textContent = `${weather.currentTemp}°C`;
        this.weatherCardElements.headerElementChildren.tempLabelSpanElement.textContent = `${weather.currentWeatherType}, `;
        this.weatherCardElements.headerElementChildren.rainChildren.ddElement.textContent = `${weather.currentRain}%`;
        this.weatherCardElements.headerElementChildren.visibilityChildren.ddElement.textContent = `${weather.currentVisibility}`;
        this.weatherCardElements.headerElementChildren.citySpan.textContent = `${weather.currentPlace}, `;
        this.weatherCardElements.headerElementChildren.counrtySpan.textContent = `${weather.currentCountry}`;
        this.weatherCardElements.humidityChildren.ddElement.textContent = `${weather.currentHumidity}%`;
        this.weatherCardElements.windChildren.ddElement.textContent = `${weather.currentWind}km/h`;


        this.renderForeCastWeather(weather);
        this.renderCurrentIcons(weather);
        this.renderBackgrounds(weather.currentWeatherType, weather.isDay);
        this.showWeatherType();
        this.setArticleElementText(weather.currentWeatherType);
        this.decreaseElementLength(this.weatherCardElements.headerElementChildren.tempLabelSpanElement.textContent.length, this.weatherCardElements.weatherArticleElement);
    }

    renderCurrentIcons(weather) {
        const iconImage = this.weatherCardElements.headerElementChildren.imageElement;
        const weatherIconImage = this.getWeatherIcons(weather.currentWeatherType, "current");

        iconImage.src = `${weatherIconImage}`;
    }
    renderForeCastWeather(weather) {
        const {
            forecastDay,
            forecastTemperature,
            forecastIcons,
            forecastApparentTemperature
        } = this.forecastElements.forecastChildren;

        weather.forecastTemps.forEach((temp, index) => {
            const iconImage = this.getWeatherIcons(temp.weatherType, "forecast");
            const trueDay = temp.day.slice(0, 3).toUpperCase();
            forecastDay[0].textContent = "Today";
            forecastDay[index].textContent = `${trueDay}`;
            forecastTemperature[index].textContent = `${temp.temperature}`;
            forecastApparentTemperature[index].textContent = `${temp.feelsLike}`;
            forecastIcons[index].src = `${iconImage}`;
            forecastIcons[index].setAttribute("data-weather-type", temp.weatherType);


        })
    }

    // Weather type shown when forecast weather icon is hovered
    showWeatherType() {

        this.forecastElements.forecastChildren.forecastArticle.forEach((element) => {
            const icon = element.querySelector(".icon");
            const span = element.querySelector("span");
            span.textContent = "";
            span.textContent = icon.dataset.weatherType;
            element.appendChild(span);
            icon.addEventListener("mouseenter", () => {
                span.classList.add("show");
            });
            icon.addEventListener("mouseleave", () => {
                span.classList.remove("show");
            })
        })

    }
    showLoader() {
        this.weatherCardElements.weatherCard.classList.add("hide");
        this.weatherCardElements.loadingSpinner.classList.add("show")
    }
    hideLoader() {
        this.weatherCardElements.weatherCard.classList.remove("hide");
        this.weatherCardElements.loadingSpinner.classList.remove("show");
    }


    getWeatherIcons(weather, variant = "current") {
        const basePath = variant === "forecast" ? "src/image-assets/icons/svg/" : "src/image-assets/icons/";
        switch (weather) {
            case "Clear":
            case "Mainly Clear":
                return `${basePath}sunny-icon.${variant === "forecast" ? "svg" : "png"}`;
            case "Partly Cloudy":
                return `${basePath}partially-cloudy.${variant === "forecast" ? "svg" : "png"}`;
            case "Cloudy":
                return `${basePath}cloudy.${variant === "forecast" ? "svg" : "png"}`;

            case "Light Drizzle":
            case "Drizzle":
                return `${basePath}drizzle.${variant === "forecast" ? "svg" : "png"}`;

            case "Foggy":
            case "Freezing Fog":
                return `${basePath}mist-fog.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Drizzle":
                return `${basePath}rain.${variant === "forecast" ? "svg" : "png"}`;

            case "Icy Drizzle":
            case "Heavy Icy Drizzle":
                return `${basePath}light-snow.${variant === "forecast" ? "svg" : "png"}`;

            case "Light Rain":
            case "Rainy":
                return `${basePath}rain.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Rain":
                return `${basePath}stormy.${variant === "forecast" ? "svg" : "png"}`;

            case "Light Snow":
            case "Snowy":
                return `${basePath}light-snow.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Snow":
            case "Snow Flurries":
            case "Icy Rain":
            case "Heavy Icy Rain":
                return `${basePath}heavy-snow.${variant === "forecast" ? "svg" : "png"}`;

            case "Light Showers":
            case "Rainy Showers":
                return `${basePath}rain.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Showers":
                return `${basePath}heavy-rain.${variant === "forecast" ? "svg" : "png"}`;

            case "Light Snow Showers":
                return `${basePath}light-snow.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Snow Showers":
                return `${basePath}heavy-snow.${variant === "forecast" ? "svg" : "png"}`;

            case "Thunderstorm":
            case "Thunderstorm(hail)":
                return `${basePath}stormy.${variant === "forecast" ? "svg" : "png"}`;

            case "Heavy Thunderstorm":
                return `${basePath}stormy.${variant === "forecast" ? "svg" : "png"}`;

        }
    }




    // weather themes

    
    getWeatherBackgrounds() {
        const themes = {
            rainyDay: [{
                textColor: "#ffffff",
                solidBg: "#0F4A00",
                bgImage: "/background-images/morn-rainy-1.png",
            }],
            rainyNight: [{
                textColor: "#ffffff",
                solidBg: "#081433",
                bgImage: "/background-images/night-rainy.png"
            },
            {
                textColor: "#ffffff",
                solidBg: "#0C1726",
                bgImage: "/background-images/nighty-nighty-rainy.png"
            }
            ],
            clearNights: [{
                textColor: "#ffffff",
                solidBg: "#0C1959",
                bgImage: "/background-images/night.png"
            }, {
                textColor: "#ffffff",
                solidBg: "#10324F",
                bgImage: "/background-images/night-2.png"
            }],
            snowyNight: [{
                textColor: "#fff",
                solidBg: "#10324F",
                bgImage: "/background-images/night-winter.png"
            }],
            clearDay: [{
                textColor: "#2a1a00",
                solidBg: "#BD6E00",
                bgImage: "/background-images/sunny-evening.png"
            }, {
                textColor: "#2a1a00",
                solidBg: "#036696",
                bgImage: "/background-images/sunny-kids-at-park.png"
            }],
            snowyDay: [{
                textColor: "#2a1a00",
                solidBg: "#5F839E",
                bgImage: "/background-images/winter-sunny.png"
            }, {
                textColor: "#2a1a00",
                solidBg: "#5F839E",
                bgImage: "/background-images/snowy.png"
            }],
            cloudyDay: [{
                textColor: "#2a1a00",
                solidBg: "#5F839E",
                bgImage: "/background-images/cloudy.png",
            }],
            cloudyNight: [{
                textColor: "#fff",
                solidBg: "#202F4F",
                bgImage: "/background-images/cloudy-night.png"
            }]
        }
        return themes;
    }

    setArticleElementText(weatherType) {
        const text = this.getWeatherText(weatherType);
        const paraElement = this.weatherCardElements.weatherArticleElement.querySelector("p");
        paraElement.textContent = `${text}`;
    }
    getWeatherText(weatherType) {
        switch (weatherType) {
            case "Clear":
                return "Clear skies with plenty of sunshine.";

            case "Mainly Clear":
                return "Mostly clear with pleasant conditions.";

            case "Partly Cloudy":
                return "A mix of sunshine and passing clouds.";

            case "Cloudy":
                return "Cloudy skies throughout the day.";

            case "Foggy":
                return "Foggy conditions with reduced visibility.";

            case "Freezing Fog":
                return "Cold and foggy with icy conditions.";

            case "Light Drizzle":
                return "Light drizzle drifting through the day.";

            case "Drizzle":
                return "Periods of drizzle expected.";

            case "Heavy Drizzle":
                return "Persistent drizzle with damp conditions.";

            case "Light Rain":
                return "Light rain showers at times.";

            case "Rainy":
                return "Rainy weather for most of the day.";

            case "Heavy Rain":
                return "Heavy rain with wet conditions.";

            case "Light Snow":
                return "Light snowfall expected.";

            case "Snowy":
                return "Snowy conditions throughout the day.";

            case "Heavy Snow":
                return "Heavy snowfall with cold temperatures.";

            case "Snow Flurries":
                return "Occasional snow flurries.";

            case "Icy Rain":
                return "Icy rain creating slippery conditions.";

            case "Heavy Icy Rain":
                return "Severe icy rain expected.";

            case "Light Showers":
                return "Scattered rain showers.";

            case "Rainy Showers":
                return "Intermittent rain showers through the day.";

            case "Heavy Showers":
                return "Intense rain showers at times.";

            case "Light Snow Showers":
                return "Light snow showers possible.";

            case "Heavy Snow Showers":
                return "Heavy snow showers expected.";

            case "Thunderstorm":
                return "Thunderstorms likely later in the day.";

            case "Thunderstorm(hail)":
                return "Stormy conditions with possible hail.";

            case "Heavy Thunderstorm":
                return "Severe thunderstorms expected.";

            default:
                return "Weather conditions may vary throughout the day.";
        }
    }
    applyTheme(weatherCategory, isDay) {
        const time = isDay === 1 ? "day" : "night";
        const themes = this.getWeatherBackgrounds();
        
        let themeKey = null;

        if (weatherCategory === "Rain") {
            themeKey = time === "day" ? "rainyDay" : "rainyNight";
        } else if (weatherCategory === "Snow") {
            themeKey = time === "day" ? "snowyDay" : "snowyNight";
        } else if (weatherCategory === "Clear") {
            themeKey = time === "day" ? "clearDay" : "clearNight";
        } else if (weatherCategory === "Cloudy") {
            themeKey = time === "day" ? "cloudyDay" : "cloudyNight"
        }

        const theme = this.pickRandomArray(themes[themeKey]);
        return theme;
    }
    getWeatherCategory(weatherType) {
        const rain = ["Rainy", "Light Rain", "Heavy Rain", "Icy Rain", "Heavy Icy Rain", "Light Showers", "Rainy Showers", "Heavy Showers", "Thunderstorm", "Thunderstorm(hail)", "Heavy Thunderstorm"];
        const snow = ["Light Snow Showers", "Heavy Snow Showers", "Light Snow", "Snowy", "Heavy Snow", "Snow Flurries",];
        const clear = ["Clear", "Mainly Clear"];
        const cloudy = ["Partly Cloudy", "Cloudy", "Foggy", "Freezing Fog"];

        if (rain.includes(weatherType)) return "Rain";
        if (snow.includes(weatherType)) return "Snow";
        if (clear.includes(weatherType)) return "Clear";
        if (cloudy.includes(weatherType)) return "Cloudy";
    }


    renderBackgrounds(weatherType, dayStatus) {

        const weatherCategory = this.getWeatherCategory(weatherType);
        const mainContainerElement = this.weatherCardElements.mainElement;
        const theme = this.applyTheme(weatherCategory, dayStatus);

        const root = document.documentElement;

        root.style.setProperty("--bgImage", `url(${theme.bgImage})`);
        root.style.setProperty("--color", theme.textColor);
        root.style.setProperty("--metric-bg", theme.solidBg);
        root.style.setProperty("--article-bg", theme.solidBg);
        mainContainerElement.style.backgroundRepeat = "no-repeat";
        mainContainerElement.style.backgroundPosition = "center";
        mainContainerElement.style.backgroundSize = "cover";
    }

    pickRandomArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    decreaseElementLength(length, element) {
        if (length >= 19) {
            element.style.fontSize = `1.9rem`;
        }
    }

}
export default WeatherUI