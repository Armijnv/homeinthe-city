export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white px-6 pt-28 pb-16">
      <div className="max-w-3xl mx-auto">

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-light mb-6">
          Your local partner in Porto Alegre
        </h1>

        {/* Subline */}
        <p className="text-lg text-stone-300 mb-10">
          I help international business visitors navigate Porto Alegre with ease —
          from meetings and translation to local insight that saves time and avoids mistakes.
        </p>

        {/* Trust block */}
        <div className="bg-white text-stone-800 p-6 rounded-2xl mb-8">
          <h2 className="text-xl mb-4">What I do</h2>
          <ul className="space-y-2">
            <li>• On-site interpreting (English ↔ Portuguese)</li>
            <li>• Business meeting support</li>
            <li>• Help you communicate clearly and confidently</li>
            <li>• Local guidance beyond Google</li>
          </ul>
        </div>

        {/* Why me */}
        <div className="bg-white/10 p-6 rounded-2xl mb-8">
          <h2 className="text-xl mb-3">Why work with me</h2>
          <p className="text-stone-300">
            25+ years living in Brazil, with a background in hospitality and business.
            I understand both sides — local culture and international expectations.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center md:text-left">
          <a
            href="https://wa.me/+5551997783369"
            target="_blank"
            className="inline-block bg-white text-stone-900 px-8 py-4 rounded-full text-sm hover:bg-stone-200 transition-colors"
          >
            Contact me on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}