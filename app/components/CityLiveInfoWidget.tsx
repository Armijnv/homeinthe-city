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

type InfoItemData = {
  label: string;
  value: string;
  icon: string;
  mobile?: boolean;
};

function InfoItem({ label, value, icon, mobile = false }: InfoItemData) {
  return (
    <div
      className={
        mobile
          ? "flex min-w-0 items-center gap-1.5 md:block"
          : "hidden min-w-0 md:block"
      }
    >
      <dt className="shrink-0 text-[0.68rem] leading-none text-stone-500 md:text-[0.58rem] md:font-medium md:uppercase md:tracking-[0.1em]">
        <span aria-hidden="true" className="md:hidden">
          {icon}
        </span>
        <span className="sr-only md:not-sr-only">{label}</span>
      </dt>
      <dd className="truncate text-[0.72rem] font-medium leading-none text-stone-950 md:mt-0.5 md:text-[0.82rem] md:leading-tight">
        {value}
      </dd>
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
  const rawItems: Array<InfoItemData | null> = [
    typeof info.temperatureC === "number"
      ? {
          label: t.temperature,
          value: `${Math.round(info.temperatureC)}°C`,
          icon: "°",
          mobile: true,
        }
      : null,
    info.moonPhase
      ? {
          label: t.moon,
          value: t.moonPhases[info.moonPhase],
          icon: "◐",
          mobile: true,
        }
      : null,
    sunrise ? { label: t.sunrise, value: sunrise, icon: "↑", mobile: true } : null,
    sunset ? { label: t.sunset, value: sunset, icon: "↓", mobile: true } : null,
    typeof info.rainChancePercent === "number"
      ? { label: t.rain, value: `${Math.round(info.rainChancePercent)}%`, icon: "%" }
      : null,
    typeof info.uvIndex === "number"
      ? { label: t.uv, value: String(Math.round(info.uvIndex)), icon: "UV" }
      : null,
    typeof info.windSpeedKmh === "number"
      ? { label: t.wind, value: `${Math.round(info.windSpeedKmh)} km/h`, icon: "~" }
      : null,
  ];
  const items = rawItems.filter((item): item is InfoItemData => Boolean(item));

  if (!items.length) return null;

  return (
    <aside
      aria-label={t.title}
      className="inline-block max-w-full rounded-xl bg-white/92 px-2.5 py-2 shadow-lg shadow-black/10 ring-1 ring-white/70 backdrop-blur-md md:block md:rounded-2xl md:p-3"
    >
      <h2 className="sr-only md:not-sr-only md:mb-2 md:block md:text-[0.68rem] md:font-medium md:uppercase md:tracking-[0.14em] md:text-stone-600">
        {t.title}
      </h2>
      <dl className="flex max-w-full items-center gap-2.5 overflow-hidden md:grid md:grid-cols-2 md:gap-x-3 md:gap-y-2 lg:grid-cols-3">
        {items.map((item) => (
          <InfoItem key={`${item.label}-${item.value}`} {...item} />
        ))}
      </dl>
    </aside>
  );
}
