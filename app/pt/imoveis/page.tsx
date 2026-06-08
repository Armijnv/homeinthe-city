import type { Metadata } from "next";
import { RealEstateOverviewPage } from "@/app/components/RealEstatePages";
import { compactJsonLd, JsonLdScript } from "@/app/lib/structuredData";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import {
  propertyListingListQuery,
  realtorProviderQuery,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Imóveis no Brasil | Aluguéis Mensais, Casas à Venda e Apoio Local",
  description:
    "Imóveis selecionados no Brasil para estrangeiros, nômades digitais, expatriados, compradores internacionais e proprietários. Aluguéis mensais, casas à venda, relocação e apoio de intérprete.",
  keywords: [
    "imóveis no Brasil",
    "imóveis à venda no Brasil",
    "aluguel mensal Brasil",
    "aluguéis para nômades digitais Brasil",
    "apartamentos mobiliados Brasil",
    "casas à venda no Brasil",
    "comprar imóvel no Brasil",
    "casas de praia Brasil",
    "moradia para expatriados Brasil",
    "relocação Brasil",
    "imóveis internacionais Brasil",
    "investimento imobiliário Brasil",
  ],
  alternates: {
    canonical: "https://homeinthe.city/pt/imoveis",
    languages: {
      en: "https://homeinthe.city/real-estate",
      pt: "https://homeinthe.city/pt/imoveis",
      nl: "https://homeinthe.city/nl/vastgoed",
    },
  },
  openGraph: {
    title: "Encontre Seu Lugar no Brasil | Home in the City",
    description:
      "Estadias mensais, casas selecionadas e apoio local confiável para nômades digitais, compradores estrangeiros, expatriados e proprietários no Brasil.",
    url: "https://homeinthe.city/pt/imoveis",
    siteName: "Home in the City",
    images: [
      {
        url: "https://homeinthe.city/porto-alegre-river.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

type RealtorProfile = Parameters<typeof RealEstateOverviewPage>[0]["realtor"];

const structuredData = compactJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://homeinthe.city/pt/imoveis#service",
      name: "Imóveis Home in the City no Brasil",
      serviceType: [
        "Aluguéis mensais no Brasil",
        "Venda de imóveis no Brasil",
        "Relocação no Brasil",
        "Serviços de intérprete para visitas a imóveis",
        "Apoio imobiliário internacional no Brasil",
      ],
      description:
        "Estadias mensais selecionadas, casas à venda e apoio local no Brasil para visitantes internacionais, nômades digitais, trabalhadores remotos, expatriados, compradores estrangeiros e proprietários.",
      provider: {
        "@type": "Organization",
        "@id": "https://homeinthe.city/#organization",
        name: "Home in the City",
        url: "https://homeinthe.city",
      },
      areaServed: {
        "@type": "Country",
        name: "Brasil",
      },
      availableLanguage: ["Português", "Inglês", "Holandês"],
      audience: [
        {
          "@type": "Audience",
          audienceType: "Nômades digitais e trabalhadores remotos",
        },
        {
          "@type": "Audience",
          audienceType: "Compradores estrangeiros e expatriados",
        },
        {
          "@type": "Audience",
          audienceType: "Proprietários estrangeiros no Brasil",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://homeinthe.city/pt/imoveis#webpage",
      name: "Encontre Seu Lugar no Brasil",
      url: "https://homeinthe.city/pt/imoveis",
      description:
        "Uma página premium de imóveis da Home in the City para aluguéis mensais, casas únicas, venda de imóveis, apoio de relocação e serviços de intérprete no Brasil.",
      inLanguage: "pt-BR",
      isPartOf: {
        "@id": "https://homeinthe.city/#website",
      },
      about: {
        "@id": "https://homeinthe.city/pt/imoveis#service",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://homeinthe.city/pt/imoveis#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Estrangeiros podem comprar imóvel no Brasil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Estrangeiros geralmente podem comprar imóveis urbanos no Brasil, embora documentos, CPF e verificações jurídicas locais sejam importantes.",
          },
        },
        {
          "@type": "Question",
          name: "Quais são os melhores lugares no Brasil para nômades digitais?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nômades digitais costumam considerar Porto Alegre, Florianópolis, Garopaba, São Paulo e Rio de Janeiro conforme necessidades de internet, estilo de vida, praia, negócios e apoio local.",
          },
        },
        {
          "@type": "Question",
          name: "Posso alugar apartamento mobiliado no Brasil por vários meses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. A Home in the City foca em aluguéis mensais e apartamentos mobiliados no Brasil para trabalhadores remotos, executivos, pesquisadores e visitantes internacionais de longa permanência.",
          },
        },
        {
          "@type": "Question",
          name: "Como compradores internacionais visitam imóveis no Brasil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Compradores internacionais podem organizar visitas guiadas com contexto local, orientação sobre bairros e apoio de idioma antes de fazer uma proposta.",
          },
        },
        {
          "@type": "Question",
          name: "A Home in the City ajuda em visitas e negociações?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. A Home in the City pode ajudar em visitas a imóveis, coordenação local, perguntas práticas e comunicação com vendedores, corretores ou proprietários.",
          },
        },
        {
          "@type": "Question",
          name: "A Home in the City oferece apoio de intérprete?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Apoio de intérprete está disponível em inglês, português e holandês para visitas, reuniões, compromissos de relocação e negociações no Brasil.",
          },
        },
      ],
    },
  ],
});

export default async function Page() {
  const [listings, realtor] = await Promise.all([
    client.fetch<PropertyListing[]>(propertyListingListQuery),
    client.fetch<RealtorProfile>(realtorProviderQuery),
  ]);

  return (
    <>
      <JsonLdScript data={structuredData} />
      <RealEstateOverviewPage lang="pt" listings={listings} realtor={realtor} />
    </>
  );
}
