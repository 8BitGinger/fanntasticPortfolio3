import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import '../assets/styles/weatherWidget.css';

import sunnyIcon from '../assets/pictures/weather/sunny.webp';
import rainIcon from '../assets/pictures/weather/rain.webp';
import snowIcon from '../assets/pictures/weather/snow.webp';
import stormIcon from '../assets/pictures/weather/storm.webp';
import cloudyIcon from '../assets/pictures/weather/cloudy.webp';
import windyIcon from '../assets/pictures/weather/windy.webp';
import humidityIcon from '../assets/pictures/weather/humidity.webp';
import windSpeedIcon from '../assets/pictures/weather/wind-speed.webp';

// Lubbock, TX - default fallback if geolocation is denied/unavailable.
const DEFAULT_LOCATION = { lat: 33.5779, lon: -101.8552, name: 'Lubbock, TX' };

function getCondition(code, windMph) {
  if ([95, 96, 99].includes(code)) return { icon: stormIcon, label: 'Thunderstorms', fx: 'storm' };
  if (windMph >= 25) return { icon: windyIcon, label: 'Windy', fx: 'wind' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: snowIcon, label: 'Snow', fx: 'snow' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { icon: rainIcon, label: 'Rain', fx: 'rain' };
  }
  if ([2, 3, 45, 48].includes(code)) return { icon: cloudyIcon, label: 'Cloudy', fx: 'cloud' };
  if ([0, 1].includes(code)) return { icon: sunnyIcon, label: 'Clear', fx: 'sun' };
  return { icon: cloudyIcon, label: 'Overcast', fx: 'cloud' };
}

const RAIN_DROPS = Array.from({ length: 14 }, (_, i) => i);
const SNOW_FLAKES = Array.from({ length: 16 }, (_, i) => i);
const WIND_STREAKS = Array.from({ length: 6 }, (_, i) => i);

function WeatherScene({ fx }) {
  if (fx === 'rain' || fx === 'storm') {
    return (
      <div className="weather-fx weather-fx--rain">
        {RAIN_DROPS.map((i) => (
          <span
            key={i}
            className="weather-fx__drop"
            style={{
              left: `${(i * 7.3) % 100}%`,
              animationDelay: `${(i % 7) * 0.15}s`,
              animationDuration: `${0.55 + (i % 4) * 0.12}s`,
            }}
          />
        ))}
        {fx === 'storm' && <div className="weather-fx__lightning" />}
      </div>
    );
  }
  if (fx === 'snow') {
    return (
      <div className="weather-fx weather-fx--snow">
        {SNOW_FLAKES.map((i) => (
          <span
            key={i}
            className="weather-fx__flake"
            style={{
              left: `${(i * 6.2) % 100}%`,
              animationDelay: `${(i % 8) * 0.45}s`,
              animationDuration: `${4 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (fx === 'sun') {
    return (
      <div className="weather-fx weather-fx--sun">
        <div className="weather-fx__rays" />
      </div>
    );
  }
  if (fx === 'wind') {
    return (
      <div className="weather-fx weather-fx--wind">
        {WIND_STREAKS.map((i) => (
          <span
            key={i}
            className="weather-fx__streak"
            style={{ top: `${8 + i * 14}%`, animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="weather-fx weather-fx--cloud">
      <span className="weather-fx__cloud weather-fx__cloud--1" />
      <span className="weather-fx__cloud weather-fx__cloud--2" />
    </div>
  );
}

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (target == null) return;
    const start = prevTarget.current ?? target;
    prevTarget.current = target;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

const WeatherWidget = ({ theme }) => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchWeather = async (lat, lon, name) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`
      );
      if (!res.ok) throw new Error('Weather request failed');
      const data = await res.json();
      setWeather(data.current);
      setLocation({ lat, lon, name });
    } catch {
      setError("Couldn't load weather right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your Location');
      },
      () => {
        fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
      },
      { timeout: 6000 }
    );
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchInput.trim()
        )}&count=1`
      );
      const data = await res.json();
      const place = data.results?.[0];
      if (!place) {
        setError('No matching city found.');
        setLoading(false);
        return;
      }
      const label = [place.name, place.admin1 || place.country].filter(Boolean).join(', ');
      await fetchWeather(place.latitude, place.longitude, label);
      setSearchInput('');
    } catch {
      setError('Search failed. Try again.');
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your Location'),
      () => {
        setError('Location access denied.');
        setLoading(false);
      }
    );
  };

  const condition = weather ? getCondition(weather.weather_code, weather.wind_speed_10m) : null;
  const animatedTemp = useCountUp(weather ? Math.round(weather.temperature_2m) : null);

  return (
    <div className={`weather-widget weather-widget--${theme}`}>
      {condition && <WeatherScene fx={condition.fx} />}

      <div className="weather-widget__header">
        <h3>Weather</h3>
        <motion.button
          type="button"
          className="weather-widget__locate-btn"
          onClick={useMyLocation}
          aria-label="Use my location"
          title="Use my location"
          whileTap={{ scale: 0.85, rotate: -20 }}
        >
          <Navigation size={16} />
        </motion.button>
      </div>

      <form className="weather-widget__search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search a city..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" aria-label="Search">
          <Search size={16} />
        </button>
      </form>

      {loading && <p className="weather-widget__status">Loading weather...</p>}
      {!loading && error && (
        <p className="weather-widget__status weather-widget__status--error">{error}</p>
      )}

      <AnimatePresence mode="wait">
        {!loading && !error && weather && condition && (
          <motion.div
            key={location?.name}
            className="weather-widget__body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <p className="weather-widget__location">{location?.name}</p>
            <img
              src={condition.icon}
              alt={condition.label}
              className="weather-widget__icon"
            />
            <p className="weather-widget__temp">
              {animatedTemp}
              <span className="weather-widget__temp-deg">&deg;F</span>
            </p>
            <p className="weather-widget__condition">{condition.label}</p>

            <div className="weather-widget__stats">
              <div className="weather-widget__stat">
                <img src={humidityIcon} alt="Humidity" />
                <span>{Math.round(weather.relative_humidity_2m)}%</span>
              </div>
              <div className="weather-widget__stat">
                <img src={windSpeedIcon} alt="Wind speed" />
                <span>{Math.round(weather.wind_speed_10m)} mph</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherWidget;
