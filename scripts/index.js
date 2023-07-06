const main = async () => {
	setupSearchInputEventCapture();
	showSuggestionsHistory();
};

const setupSearchInputEventCapture = () => {
	const searchInput = document.getElementById('search-input');
	searchInput.addEventListener('input', handleChangeInSearchInput);
};

const handleChangeInSearchInput = async () => {
	const searchInput = document.getElementById('search-input');
	const query = searchInput.value.trim();
	const suggestions = await getSuggestions(query);
	displaySuggestions(suggestions);
};

const getSuggestionsDiv = () => {
	return document.getElementById('suggestions');
};

const showTodaysTemperature = (obj) => {
	document.getElementById('date').innerHTML = `(${obj.date})`;
	document.getElementById('city-name').innerHTML = obj.cityName;
	document.getElementById('temperature').innerHTML = obj.temp;
	document.getElementById('humidity').innerHTML = obj.humidity;
	document.getElementById('wind').innerHTML = obj.wind;
	document.getElementById('icon').src = obj.iconUrl;
};

const showFutureWeather = (data) => {
	console.log('data', data);
	const forecastCardsDiv = document.getElementById('forecast-cards');
	forecastCardsDiv.innerHTML = "";
	for (const d of data) {
		const div = document.createElement('div');
		div.className = 'forecast-card';
		div.innerHTML = `
		<h3>${d.date}</h3>
		<img id="icon" src=${d.iconUrl}>
		<p>Temperature: ${d.temp}°C</p>
		<p>Wind: ${d.wind} km/h</p>
		<p>Humidity: ${d.humidity}%</p>`;
		forecastCardsDiv.appendChild(div);
	}
};

const clearSearchInput = ()=>{
	document.getElementById("search-input").value = ""
}

const handleSuggestionClick = async (suggestion) => {
	displaySuggestions([]);
	const weatherData = await getWeatherData(suggestion.lat, suggestion.lon);
	showTodaysTemperature(weatherData[0]);
	showFutureWeather(weatherData.slice(1));
	clearSearchInput();
	addSuggestionInSearchHistory(suggestion);
	showSuggestionsHistory();
};

const handleSearchHistoryClick = async (suggestion)=>{
	const weatherData = await getWeatherData(suggestion.lat, suggestion.lon);
	showTodaysTemperature(weatherData[0]);
	showFutureWeather(weatherData.slice(1));
}


const showSuggestionsHistory = () => {
	const searchHistoryElement = document.getElementById('search-history');
	searchHistoryElement.innerHTML = "";
	const searchHistory = getSearchHistory();
	for (const suggestion of searchHistory) {
		const p = document.createElement('p');
		p.onclick = ()=>{
			handleSearchHistoryClick(suggestion)
		}
		p.innerHTML = suggestion.name;
		searchHistoryElement.appendChild(p);
	}
};

const createSuggestionNode = (suggestion) => {
	const suggestionItem = document.createElement('div');
	suggestionItem.classList.add('suggestion');
	suggestionItem.textContent = suggestion.name;
	suggestionItem.onclick = () => handleSuggestionClick(suggestion);
	return suggestionItem;
};

const getSearchHistory = () => {
	return JSON.parse(localStorage.getItem('searchHistory') || '[]');
};

const addSuggestionInSearchHistory = (suggestion) => {
	const currentHistory = JSON.parse(
		localStorage.getItem('searchHistory') || '[]'
	);
	console.log("currentHistory",currentHistory);
	currentHistory.push(suggestion);
	console.log("currentHistory",currentHistory);
	localStorage.setItem('searchHistory', JSON.stringify(currentHistory));
};

const displaySuggestions = (suggestions) => {
	const suggestionDiv = getSuggestionsDiv();
	suggestionDiv.innerHTML = '';

	if (suggestions.length == 0) {
		suggestionDiv.style.display = 'none';
		return;
	}

	suggestionDiv.style.display = 'block';

	for (const suggestion of suggestions) {
		suggestionDiv.appendChild(createSuggestionNode(suggestion));
	}
};

document.addEventListener('DOMContentLoaded', function () {
	// Code to be executed when everything is loaded
	main();
});
