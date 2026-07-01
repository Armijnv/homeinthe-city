import type { CityGuideLang as Lang } from "@/app/lib/cityGuides";
import type { CityLiveInfo } from "@/app/lib/cityLiveInfo";

const labels: Record<
  Lang,
  {
    title: string;
    temperature: string;
    moon: string;
    sunrise: string;
    sunset: string;
    rain: string;
    uv: string;
    wind: string;
    moonPhases: Record<NonNullable<CityLiveInfo["moonPhase"]>, string>;
  }
> = {
  en: {
    title: "Live city info",
    temperature: "Temp",
    moon: "Moon",
    sunrise: "Sunrise",
    sunset: "Sunset",
    rain: "Rain",
    uv: "UV",
    wind: "Wind",
    moonPhases: {
      new: "New",
      waxingCrescent: "Waxing crescent",
      firstQuarter: "First quarter",
      waxingGibbous: "Waxing gibbous",
      full: "Full",
      waningGibbous: "Waning gibbous",
      lastQuarter: "Last quarter",
      waningCrescent: "Waning crescent",
    },
  },
  pt: {
    title: "Info ao vivo",
    temperature: "Temp",
    moon: "Lua",
    sunrise: "Nascer",
    sunset: "Pôr do sol",
    rain: "Chuva",
    uv: "UV",
    wind: "Vento",
    moonPhases: {
      new: "Nova",
      waxingCrescent: "Crescente",
      firstQuarter: "Quarto crescente",
      waxingGibbous: "Gibosa crescente",
      full: "Cheia",
      waningGibbous: "Gibosa minguante",
      lastQuarter: "Quarto minguante",
      waningCrescent: "Minguante",
    },
  },
  nl: {
    title: "Live stadsinfo",
    temperature: "Temp",
    moon: "Maan",
    sunrise: "Zonsopkomst",
    sunset: "Zonsondergang",
    rain: "Regen",
    uv: "UV",
    wind: "Wind",
    moonPhases: {
      new: "Nieuw",
      waxingCrescent: "Wassende sikkel",
      firstQuarter: "Eerste kwartier",
      waxingGibbous: "Wassend",
      full: "Vol",
      waningGibbous: "Afnemend",
      lastQuarter: "Laatste kwartier",
      waningCrescent: "Afnemende sikkel",
    },
  },
};

const localeByLang: Record<Lang, string> = {
  en: "en-US",
  pt: "pt-BR",
  nl: "nl-NL",
};

function formatTime(value: string | undefined, lang: Lang) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(localeByLang[lang], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-stone-500">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-stone-950">{value}</dd>
    </div>
  );
}

export default function CityLiveInfoWidget({
  info,
  lang,
}: {
  info?: CityLiveInfo | null;
  lang: Lang;
}) {
  if (!info) return null;

  const t = labels[lang];
  const sunrise = formatTime(info.sunrise, lang);
  const sunset = formatTime(info.sunset, lang);
  const items = [
    typeof info.temperatureC === "number"
      ? { label: t.temperature, value: `${Math.round(info.temperatureC)}°C` }
      : null,
    info.moonPhase
      ? { label: t.moon, value: t.moonPhases[info.moonPhase] }
      : null,
    sunrise ? { label: t.sunrise, value: sunrise } : null,
    sunset ? { label: t.sunset, value: sunset } : null,
    typeof info.rainChancePercent === "number"
      ? { label: t.rain, value: `${Math.round(info.rainChancePercent)}%` }
      : null,
    typeof info.uvIndex === "number"
      ? { label: t.uv, value: String(Math.round(info.uvIndex)) }
      : null,
    typeof info.windSpeedKmh === "number"
      ? { label: t.wind, value: `${Math.round(info.windSpeedKmh)} km/h` }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  if (!items.length) return null;

  return (
    <aside
      aria-label={t.title}
      className="rounded-2xl bg-white/92 p-4 shadow-xl shadow-black/10 ring-1 ring-white/70 backdrop-blur-md"
    >
      <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-stone-600">
        {t.title}
      </h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <InfoItem key={`${item.label}-${item.value}`} {...item} />
        ))}
      </dl>
    </aside>
  );
}
