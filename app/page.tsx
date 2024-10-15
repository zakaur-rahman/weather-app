'use client';

import { useEffect, useState } from 'react';
import WeatherDetails from './components/WeatherDetails';
import SearchBar from './components/SearchBar';
import { fetchWeather, WeatherData, ForecastData } from './utils/fetchWeather';
import { IoLocationOutline } from "react-icons/io5";
import { TbTemperatureFahrenheit, TbTemperatureCelsius } from "react-icons/tb";

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
  const [location, setLocation] = useState<string>('Sarkhej, IN');
  const [units, setUnits] = useState<string>('metric');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('')
      const data = await fetchWeather(lat, lon, units);
      if (data) {
        setWeatherData(data.weather);
        setForecastData(data.forecast);
        setLocation(`${data.weather.name}, ${data.weather.sys.country}`);
        setCoordinates({ lat, lon });
      } else {
        setError('Failed to fetch weather data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data.coord) {
        getWeather(data.coord.lat, data.coord.lon);
      } else {
        setError('City not found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const geoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => getWeather(coords.latitude, coords.longitude),
        () => setError('Location permission denied.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
    setLoading(false);
  };

  useEffect(() => {
    geoLocation();
  }, []);

  useEffect(() => {
    if (coordinates) {
      getWeather(coordinates.lat, coordinates.lon);
    }
  }, [units]);

  return (
    <main className="flex flex-col bg-cover bg-center items-center min-h-screen" style={{ backgroundImage: "url('/images/sunset.jpg')" }}>
      <header className="flex justify-center items-center h-20 bg-black/40 shadow-lg backdrop-blur-2xl w-full py-4 mb-4">
        <div className='w-full flex items-center flex-col'>
          <div className='w-full flex justify-center md:justify-between my-4 items-center max-w-4xl'>
            <nav className="hidden md:space-x-2 lg:space-x-4 md:block gap-4">
              {['London', 'Delhi', 'Tokyo', 'Paris', 'Mumbai'].map((city) => (
                <button
                  key={city}
                  className="hover:underline underline-offset-4"
                  onClick={() => handleSearch(city)}
                >
                  {city}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <SearchBar onSearch={handleSearch} />
              <button
                onClick={geoLocation}
                className="bg-white/20 backdrop-blur-lg rounded-md p-2 shadow-sm"
                title="Use current location"
              >
                <IoLocationOutline className='size-6' />
              </button>
              {['metric', 'imperial'].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setUnits(unit)}
                  className={`${units === unit ? 'bg-white/20 backdrop-blur-lg rounded-md py-2 p-1 pr-2 shadow-sm' : 'hover:underline underline-offset-4'}`}
                  disabled={units === unit}
                  title={unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
                >
                  {unit === 'metric' ? <TbTemperatureCelsius className='size-6' /> : <TbTemperatureFahrenheit className='size-6' />}
                </button>
              ))}
            </div>
          </div>
          {loading && (
            <div className="fixed top-0 left-0 w-[90%] h-1 bg-gradient-to-r from-red-400 via-green-400 to-purple-400 animate-loading"></div>
          )}
        </div>
      </header>

      {error && <p className="text-red-500">{error}</p>}
      <div className='w-full flex items-center justify-center'>
        {weatherData && forecastData && (
          <WeatherDetails
            weatherData={weatherData}
            forecastData={forecastData}
            location={location}
            units={units}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
