window.addEventListener('load',()=>{
    let long;
    let lat;
    let temperatureDisplay = document.querySelector('.temperature-degree');
    let temperatureDiscription = document.querySelector('.temperature-description');
    let timezoneDisplay = document.querySelector(".location-timezone");
    let iconElement = document.querySelector('.icon-weather');

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{
            long = position.coords.longitude;
            lat = position.coords.latitude;
            // Using open weather API
            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=08e5e0726d2dd6ba61dfc61132143db1&units=imperial`;
            // Fecthing API data
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    
                    const {temp} = data.current;
                    const {timezone} = data;
                    // Setting up the DOM elements.
                    temperatureDisplay.textContent = temp;
                    temperatureDiscription.textContent = data.current.weather[0].description.toUpperCase();
                    timezoneDisplay.textContent = timezone;
                    // console.log(data) to see the data and explore it.
                    // calling funtion to set Icon with respect to Open Weather API icon
                    setIcon(data.current.weather[0].icon)
                        })
                    })
                };
        });
    function setIcon(iconID){
        const iconSrc = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
        iconElement.setAttribute('src',iconSrc);
    }
;