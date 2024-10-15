import Image from 'next/image';
import React from 'react';

interface DailyForecastProps {
  daysToShow: {
    dt: number;
   dt_txt:string;
   description:string;
   icon:string;
   temp_max:number;
   temp_min:number;
  }[];
}

const DailyForecast: React.FC<DailyForecastProps> = ({ daysToShow }) => {

  return (
    <div className="mt-4 pb-8">
      <h3 className="text-md md:text-lg w-full text-start font-semibold mb-2">Daily Forecast</h3>
      <div className="flex justify-between border-t-[2px] pt-4 text-sm md:text-md font-light">
        {daysToShow.map((day) => (
          <div key={day.dt} className="flex flex-col items-center">
            <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <Image
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-14 h-14"
              width={40}
              height={40}
            />
            <p>{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
