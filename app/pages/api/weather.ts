// pages/api/weather.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Interfaces for the weather data
export interface WeatherData {
  name: string;
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherApiResponse {
  city: {
    id: number;
    name: string;
    coord: {
      lon: number;
      lat: number;
    };
    country: string;
    population: number;
  };
  list: ForecastData[];
}

export interface ForecastData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt_txt: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Function to fetch weather data
export const fetchWeather = async (
  lat: number,
  lon: number,
  units: string
): Promise<{ weather: WeatherData; forecast: ForecastData[] } | null> => {
  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            units: units,
            appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          },
        }
      ),
      axios.get<WeatherApiResponse>(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat,
            lon,
            units: units,
            appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          },
        }
      ),
    ]);

    const forecastData = forecastResponse.data.list;

    return {
      weather: weatherResponse.data,
      forecast: forecastData,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { lat, lon, units } = req.query;

  if (!lat || !lon || !units) {
    return res.status(400).json({ message: 'Latitude, longitude, and units are required' });
  }

  try {
    const weatherData = await fetchWeather(
      parseFloat(lat as string),
      parseFloat(lon as string),
      units as string
    );

    if (!weatherData) {
      return res.status(500).json({ message: 'Error fetching weather data' });
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
