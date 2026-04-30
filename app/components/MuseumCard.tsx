import Image from "next/image";

export default function MuseumCard({
  href,
  image,
  title,
  dates,
  description,
}: {
  href: string;
  image: string;
  title: string;
  dates: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden p-5 hover:shadow-lg transition-shadow">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 items-start"
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div>
          <h3 className="text-lg text-stone-800 mb-1">{title}</h3>

          <p className="text-sm text-stone-500 mb-2">{dates}</p>

          <p className="text-stone-600 mb-2">{description}</p>

          <span className="text-sm text-stone-400">
            View exhibition →
          </span>
        </div>
      </a>
    </div>
  );
}