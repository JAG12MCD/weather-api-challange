const apiKey = '3b695a8a5f5302a4ff012d386c28e6de';

const getSuggestions = async (query) => {
	return new Promise((resolve, reject) => {
		if (query.length == 0) return resolve([]);
		fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
		)
			.then((response) => response.json())
			.then((data) => {
				const res = [];
				for (const d of data) {
					res.push({
						name: `${d.name}, ${d.state}, ${d.country}`,
						lat: d.lat,
						lon: d.lon,
					});
				}
				return resolve(res);
			})
			.catch((error) => {
				console.error('Error:', error);
				return reject(error);
			});
	});
};

const getWeatherData = async (lat, lon) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&units=metric&appid=${apiKey}`
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const cityName = data.city.name;
				data = data.list;
				const res = [];
				for (let i = 0; i < 40; i += 8) {
					const d = extractWedatherDataFromObject(data[i]);
					d.cityName = cityName;
					res.push(d);
				}
				console.log(res.length);
				return resolve(res);
			})
			.catch((error) => {
				console.error('Error:', error);
				return reject(error);
			});
	});
};

const extractWedatherDataFromObject = (obj) => {
	return {
		date: obj.dt_txt.split(' ')[0],
		temp: obj.main.temp,
		wind: obj.wind.speed,
		humidity: obj.main.humidity,
		iconUrl: `https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`
	};
};
