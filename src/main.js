import './styles/styles.css'
import WeatherUI from './modules/ui';

function init() {
    const ui = new WeatherUI();
    ui.init();
}
init();