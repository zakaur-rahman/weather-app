import Image from 'next/image';
import React from 'react';

interface HourlyForecastProps {
    hoursToShow: {
      dt: number;
     dt_txt:string;
     description:string;
     icon:string;
     temp_max:number;
     temp_min:number;
     temp:number
    }[];
  }
const HourlyForecast: React.FC<HourlyForecastProps> = ({ hoursToShow }) => {
    
  //const hoursToShow = hourly.slice(0, 5); // Show next 5 time slots (3-hour interval)

  return (
    <div className="mt-8">
      <h3 className="text-md md:text-lg w-full text-start font-semibold mb-2">3 Hour Step Forecast</h3>
      <div className="flex justify-between border-t-[2px] pt-4 text-sm md:text-md font-light">
        {hoursToShow.map((hour) => (
          <div key={hour.dt} className="flex flex-col  items-center">
            <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <Image
              src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
              alt={hour.description}
              className="w-14 h-14"
              width={40}
              height={40}
            />
            <p>{Math.round(hour.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
