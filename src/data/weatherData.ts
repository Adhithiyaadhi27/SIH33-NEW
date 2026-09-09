export interface WeatherData {
  region: string;
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  wind: number;
  icon: string;
  forecast: Array<{ day: string; temp: number; condition: string; icon: string }>;
  alerts: string[];
}

export const MOCK_WEATHER: WeatherData[] = [
  {
    region: 'Madurai, TN',
    temp: 33,
    condition: 'Partly Cloudy',
    humidity: 72,
    rainfall: 2.1,
    wind: 12,
    icon: '⛅',
    forecast: [
      { day: 'Mon', temp: 34, condition: 'Sunny', icon: '☀️' },
      { day: 'Tue', temp: 32, condition: 'Cloudy', icon: '☁️' },
      { day: 'Wed', temp: 30, condition: 'Rain', icon: '🌧️' },
      { day: 'Thu', temp: 31, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Fri', temp: 33, condition: 'Sunny', icon: '☀️' },
    ],
    alerts: ['Heavy rainfall expected on Wednesday — secure harvested crops'],
  },
  {
    region: 'Ooty, TN',
    temp: 18,
    condition: 'Misty',
    humidity: 88,
    rainfall: 5.3,
    wind: 8,
    icon: '🌫️',
    forecast: [
      { day: 'Mon', temp: 19, condition: 'Misty', icon: '🌫️' },
      { day: 'Tue', temp: 17, condition: 'Rain', icon: '🌧️' },
      { day: 'Wed', temp: 16, condition: 'Rain', icon: '🌧️' },
      { day: 'Thu', temp: 18, condition: 'Cloudy', icon: '☁️' },
      { day: 'Fri', temp: 20, condition: 'Sunny', icon: '☀️' },
    ],
    alerts: ['Cold wave advisory — protect sensitive crops from frost'],
  },
  {
    region: 'Nashik, MH',
    temp: 29,
    condition: 'Sunny',
    humidity: 45,
    rainfall: 0,
    wind: 15,
    icon: '☀️',
    forecast: [
      { day: 'Mon', temp: 30, condition: 'Sunny', icon: '☀️' },
      { day: 'Tue', temp: 31, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', temp: 29, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Thu', temp: 28, condition: 'Cloudy', icon: '☁️' },
      { day: 'Fri', temp: 30, condition: 'Sunny', icon: '☀️' },
    ],
    alerts: [],
  },
  {
    region: 'Kinnaur, HP',
    temp: 14,
    condition: 'Clear',
    humidity: 35,
    rainfall: 0,
    wind: 10,
    icon: '🌤️',
    forecast: [
      { day: 'Mon', temp: 15, condition: 'Clear', icon: '🌤️' },
      { day: 'Tue', temp: 14, condition: 'Cloudy', icon: '☁️' },
      { day: 'Wed', temp: 12, condition: 'Rain', icon: '🌧️' },
      { day: 'Thu', temp: 13, condition: 'Clear', icon: '🌤️' },
      { day: 'Fri', temp: 15, condition: 'Sunny', icon: '☀️' },
    ],
    alerts: ['Apple harvesting window — optimal conditions this week'],
  },
];
