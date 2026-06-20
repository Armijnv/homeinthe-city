type Lang = "en" | "pt" | "nl";

export type ProviderServiceCard = {
  _key?: string;
  roles?: string[];
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
};

export default function ProviderServiceCards({
  lang,
  roles,
  services,
  title,
}: {
  lang: Lang;
  roles?: string[];
  services?: ProviderServiceCard[];
  title: string;
}) {
  const providerRoles = new Set(roles || []);
  const relevantServices = (services || [])
    .filter((service) =>
      service.roles?.some((role) => providerRoles.has(role)),
    )
    .map((service) => ({
      ...service,
      localizedTitle: service[`title_${lang}`] || service.title_en || "",
      localizedDescription:
        service[`description_${lang}`] || service.description_en || "",
    }))
    .filter(
      (service) => service.localizedTitle || service.localizedDescription,
    );

  if (!relevantServices.length) return null;

  return (
    <section className="mb-10 rounded-3xl bg-white p-8 text-stone-800">
      <h2 className="mb-4 text-2xl font-light">{title}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {relevantServices.map((service, index) => (
          <div
            key={service._key || `${service.localizedTitle}-${index}`}
            className="rounded-2xl bg-stone-50 p-4"
          >
            <h3 className="mb-2 font-medium text-stone-800">
              {service.localizedTitle}
            </h3>

            <p className="text-sm leading-relaxed text-stone-600">
              {service.localizedDescription}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
