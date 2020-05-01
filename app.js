window.addEventListener("load", () => {
  let long;
  let lat;
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let temperatureSection = document.querySelector(".temperature");
  const temperatureSpan = document.querySelector(".temperature span");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/4e92e6251e500da68098c63545df924e/${lat},${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);

          const { temperature, summary, icon } = data.currently;
          const celsius = convertToCelsius(temperature);
          setDOMElements(celsius, summary, data.timezone);

          setIcons(icon, document.querySelector(".icon"));

          temperatureSection.addEventListener("click", () => {
            switchTemperatureUnits(temperature, celsius);
          });
        });
    });
  }

  function convertToCelsius(temperature) {
    return Math.round((temperature - 32) * (5 / 9));
  }

  function switchTemperatureUnits(temperature, celsius) {
    if (temperatureSpan.textContent === "\xB0F") {
      temperatureSpan.textContent = "\xB0C";
      temperatureDegree.textContent = celsius;
    } else {
      temperatureSpan.textContent = "\xB0F";
      temperatureDegree.textContent = Math.round(temperature);
    }
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }

  function setDOMElements(celsius, summary, timezone) {
    if (temperatureDegree != null) {
      temperatureDegree.textContent = celsius;
    }
    if (temperatureDescription != null) {
      temperatureDescription.textContent = summary;
    }
    if (locationTimezone != null) {
      locationTimezone.textContent = timezone;
    }
  }
});
