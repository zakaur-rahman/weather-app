import axios from 'axios';

// Interface for the current weather data
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
      temp_min: number; // Add this if available in the API response
      temp_max: number; // Add this if available in the API response
    };
    wind: {
      speed: number;
    };
    sys: {
      country: string;
      sunrise:number;
      sunset:number;
    };
  }
  

// Interface for the forecast response
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

// Interface for each forecast data point (3-hour interval)
export interface ForecastData {
  dt: number; // Unix timestamp
  main: {
    temp: number; // Current temperature in Celsius
    feels_like: number; // Perceived temperature in Celsius
    temp_min: number; // Minimum temperature in Celsius
    temp_max: number; // Maximum temperature in Celsius
    pressure: number; // Atmospheric pressure in hPa
    humidity: number; // Humidity percentage
  };
  weather: WeatherCondition[];
  wind: {
    speed: number; // Wind speed in m/s or km/h
    deg: number; // Wind direction in degrees
  };
  clouds: {
    all: number; // Cloudiness percentage
  };
  dt_txt: string; // Formatted date-time string
}

// Interface for each weather condition
export interface WeatherCondition {
  id: number;
  main: string; // Group of weather parameters (e.g., Rain, Snow, Clear)
  description: string; // Detailed weather description
  icon: string; // Icon code for weather condition
}

// Fetch weather and forecast data
export const fetchWeather = async (
  lat: number,
  lon: number,
  units:string
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

    // Extract the forecast list from the forecast response
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
