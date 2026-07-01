export type CityLiveInfo = {
  temperatureC?: number;
  moonPhase?:
    | "new"
    | "waxingCrescent"
    | "firstQuarter"
    | "waxingGibbous"
    | "full"
    | "waningGibbous"
    | "lastQuarter"
    | "waningCrescent";
  sunrise?: string;
  sunset?: string;
  rainChancePercent?: number;
  uvIndex?: number;
  windSpeedKmh?: number;
};

type OpenMeteoForecast = {
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    sunrise?: string[];
    sunset?: string[];
    precipitation_probability_max?: Array<number | null>;
    uv_index_max?: Array<number | null>;
  };
};

function validCoordinates(latitude?: number, longitude?: number) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function moonPhaseForDate(date = new Date()): CityLiveInfo["moonPhase"] {
  const synodicMonth = 29.530588853;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const daysSinceKnownNewMoon =
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12) -
      knownNewMoon) /
    86400000;
  const age = ((daysSinceKnownNewMoon % synodicMonth) + synodicMonth) % synodicMonth;

  if (age < 1.84566) return "new";
  if (age < 5.53699) return "waxingCrescent";
  if (age < 9.22831) return "firstQuarter";
  if (age < 12.91963) return "waxingGibbous";
  if (age < 16.61096) return "full";
  if (age < 20.30228) return "waningGibbous";
  if (age < 23.99361) return "lastQuarter";
  if (age < 27.68493) return "waningCrescent";
  return "new";
}

function numberOrUndefined(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function getCityLiveInfo({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}): Promise<CityLiveInfo | null> {
  if (!validCoordinates(latitude, longitude)) return null;

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,wind_speed_10m",
    daily: "sunrise,sunset,precipitation_probability_max,uv_index_max",
    timezone: "auto",
    forecast_days: "1",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) return null;

    const forecast = (await response.json()) as OpenMeteoForecast;
    const info: CityLiveInfo = {
      temperatureC: numberOrUndefined(forecast.current?.temperature_2m),
      moonPhase: moonPhaseForDate(),
      sunrise: forecast.daily?.sunrise?.[0],
      sunset: forecast.daily?.sunset?.[0],
      rainChancePercent: numberOrUndefined(
        forecast.daily?.precipitation_probability_max?.[0],
      ),
      uvIndex: numberOrUndefined(forecast.daily?.uv_index_max?.[0]),
      windSpeedKmh: numberOrUndefined(forecast.current?.wind_speed_10m),
    };

    return Object.values(info).some((value) => value !== undefined) ? info : null;
  } catch {
    return null;
  }
}
