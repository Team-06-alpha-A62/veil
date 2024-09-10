import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

const cities = [
  { name: 'Sofia', lat: 42.6977, lon: 23.3219 },
  { name: 'Plovdiv', lat: 42.1354, lon: 24.7453 },
  { name: 'Varna', lat: 43.2141, lon: 27.9147 },
  { name: 'Burgas', lat: 42.5048, lon: 27.4626 },
];

const WeatherCarouselWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const promises = cities.map(city =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=a33fa44b48a2e0601c7439a18efbe8f6&units=metric&lang=en`
        ).then(res => res.json())
      );

      const data = await Promise.all(promises);
      setWeatherData(data);
      setIsLoading(false);
    };

    fetchWeatherData();
  }, []);

  const handleNext = (): void => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % weatherData.length);
  };

  const handlePrev = (): void => {
    setCurrentSlide(
      prevSlide => (prevSlide - 1 + weatherData.length) % weatherData.length
    );
  };

  const getPrevSlide = () => {
    return (currentSlide - 1 + weatherData.length) % weatherData.length;
  };

  const getNextSlide = () => {
    return (currentSlide + 1) % weatherData.length;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!weatherData || weatherData.length === 0) {
    return <div>No weather data available.</div>;
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {weatherData?.map((data, index) => {
        let slideClass = 'opacity-0 scale-50';

        if (index === currentSlide) {
          slideClass = 'opacity-100 scale-100 z-20 pointer-events-auto';
        } else if (index === getPrevSlide() || index === getNextSlide()) {
          slideClass = 'opacity-50 scale-75 z-10 pointer-events-none';
        }

        return (
          <div
            className={`carousel-item absolute w-1/3 transition-all transform duration-500 ease-in-out ${slideClass}`}
            style={{
              left:
                index === getPrevSlide()
                  ? '0%'
                  : index === getNextSlide()
                  ? '66%'
                  : '33%',
            }}
            key={data.name}
          >
            <div className="p-6 justify-center bg-base-100 h-full w-full rounded-xl shadow-md flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-medium text-base-content mb-3">
                  {data.name}
                </div>
                <div className="shrink-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                    className="h-16 w-16"
                  />
                </div>
                <p className="text-base-content opacity-55">
                  {data.weather[0].description}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {data.main.temp}°C
                </p>
                <div className="flex flex-col items-center text-sm text-base-content opacity-55">
                  <span>Humidity: {data.main.humidity}%</span>
                  <span>Wind Speed: {data.wind.speed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        className=" absolute left-0  z-30 flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
        onClick={handlePrev}
      >
        <FaChevronLeft className="text-lg" />
      </button>
      <button
        className="absolute right-0 z-30 flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
        onClick={handleNext}
      >
        <FaChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default WeatherCarouselWidget;
