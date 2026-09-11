import { MOCK_WEATHER, type WeatherData } from '../../data/weatherData';
import { CloudRain, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';

interface WeatherWidgetProps {
  region?: string;
}

export default function WeatherWidget({ region }: WeatherWidgetProps) {
  const data = region ? MOCK_WEATHER.find((w) => w.region === region) : MOCK_WEATHER[0];
  if (!data) return null;

  return (
    <div className="glass-panel-sm p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-sm text-text-primary">{data.region}</h3>
          <p className="text-[10px] text-text-muted">Farming weather update</p>
        </div>
        <span className="text-3xl">{data.icon}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Thermometer className="w-3.5 h-3.5 text-soil-gold" />
          <span className="text-lg font-extrabold text-soil-gold">{data.temp}°C</span>
        </div>
        <span className="text-[10px] text-text-muted">{data.condition}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-panel p-2">
          <Droplets className="w-3 h-3 text-blue-300 mx-auto mb-0.5" />
          <div className="text-[10px] font-bold text-text-primary">{data.humidity}%</div>
          <div className="text-[8px] text-text-muted">Humidity</div>
        </div>
        <div className="glass-panel p-2">
          <CloudRain className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
          <div className="text-[10px] font-bold text-text-primary">{data.rainfall}mm</div>
          <div className="text-[8px] text-text-muted">Rainfall</div>
        </div>
        <div className="glass-panel p-2">
          <Wind className="w-3 h-3 text-gray-300 mx-auto mb-0.5" />
          <div className="text-[10px] font-bold text-text-primary">{data.wind}km/h</div>
          <div className="text-[8px] text-text-muted">Wind</div>
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="flex gap-2">
        {data.forecast.map((f) => (
          <div key={f.day} className="flex-1 text-center glass-panel p-1.5">
            <div className="text-[8px] text-text-muted">{f.day}</div>
            <div className="text-base">{f.icon}</div>
            <div className="text-[9px] font-bold text-text-primary">{f.temp}°</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-1">
          {data.alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-400/30">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[9px] text-amber-300 leading-relaxed">{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
