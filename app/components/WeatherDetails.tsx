import React from 'react';
import { WeatherData, ForecastData } from '../utils/fetchWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { WiSunrise } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa6";
import Image from 'next/image';


interface WeatherDetailsProps {
    weatherData: WeatherData;
    forecastData: ForecastData[];
    location: string;
    units: unknown
}

const fetchDailyForecast = (forecastData: ForecastData[]) => {
    const daily = forecastData
        .filter((day) => day.dt_txt.includes('12:00:00')) // Filter for 12:00:00 time
        .map((day) => ({
            dt: day.dt,
            dt_txt: day.dt_txt,
            icon: day.weather[0].icon, // Assuming there's at least one weather object
            description: day.weather[0].description, // Assuming there's at least one weather object
            temp_max: day.main.temp_max,
            temp_min: day.main.temp_min,
            temp: day.main.temp
        }));

    return daily;
};
const fetchHourlyForecast = (forecastData: ForecastData[]) => {
    const hourly = forecastData
        .filter((hour) => !hour.dt_txt.includes('12:00:00')) // Filter for 12:00:00 time
        .map((hour) => ({
            dt: hour.dt,
            dt_txt: hour.dt_txt,
            icon: hour.weather[0].icon, // Assuming there's at least one weather object
            description: hour.weather[0].description, // Assuming there's at least one weather object
            temp_max: hour.main.temp_max,
            temp_min: hour.main.temp_min,
            temp: hour.main.temp
        }));

    return hourly;
};



const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData, forecastData, location, units }) => {
    console.log("Daily", fetchDailyForecast(forecastData));

    return (
        <div className="max-w-4xl w-full md:mt-6 bg-gradient-to-b from-sky-700/10 to-sky-600/30 px-6 md:p-6 rounded-lg backdrop-blur-md shadow-xl text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">{location}</h2>
            <p className="text-md md:text-lg">
                {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })} | Local time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className='flex items-center justify-center flex-row font-bold gap-x-8'>
                <Image className='w-20 h-20' src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} width={40} height={40} alt={''} />
                <p className="capitalize text-green-300">{weatherData.weather[0].description}</p>
            </div>
            <div className="text-6xl font-bold">
                {Math.round(weatherData.main.temp)}°
            </div>
            <div className="text-lg md:text-xl flex items-center justify-center flex-row font-bold my-4">
                <p className='flex justify-center items-center gap-x-2'> <FaTemperatureHigh /> Feels Like: {Math.round(weatherData.main.feels_like)}°</p>
            </div>
            <div className="flex justify-between border-t-[2px] pt-4 text-sm md:text-md">
                <div className='flex flex-col gap-2 items-start'>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1'><FaTemperatureArrowUp className='size-4 md:size-6' /> High: {Math.round(weatherData?.main?.temp_max)}°</p>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1'> <FaTemperatureArrowDown className='size-4 md:size-6' /> Low: {Math.round(weatherData?.main?.temp_min)}°</p>
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1'><WiSunrise className='size-5 md:size-8' />Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1'> <WiSunset className='size-5 md:size-8'  />Sunset {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1' > <WiHumidity className='size-5 md:size-8'  /> Humidity: {weatherData.main.humidity}%</p>
                    <p className='flex justify-center items-center gap-0.5 md:gap-1'><FiWind className=' size-5 md:size-8'  /> Wind: {units === 'imperial' ? weatherData.wind.speed : (weatherData.wind.speed * 3.6).toFixed()} {units === 'imperial' ? 'mph' : 'kph'}</p>
                </div>
            </div>
            {forecastData && <HourlyForecast hoursToShow={fetchHourlyForecast(forecastData).slice(0, 5)} />}
            {forecastData && <DailyForecast daysToShow={fetchDailyForecast(forecastData)} />}
        </div>
    );
};

export default WeatherDetails;
