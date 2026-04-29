export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white px-6 pt-28 pb-16">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl md:text-6xl font-light mb-6">
          Your local partner in Porto Alegre
        </h1>

        <p className="text-lg text-stone-300 mb-8">
          I help international business visitors navigate Porto Alegre with ease —
          from meetings and translation to local insight that saves time and avoids mistakes.
        </p>

        <div className="bg-white text-stone-800 p-6 rounded-2xl mb-8">
          <h2 className="text-xl mb-2">What I do</h2>
          <ul className="space-y-2">
            <li>• On-site interpreting (English ↔ Portuguese)</li>
            <li>• Business meeting support</li>
            <li>• Local guidance and logistics</li>
            <li>• Trusted recommendations</li>
          </ul>
        </div>

        <a
          href="https://wa.me/+5551997783369"
          target="_blank"
          className="inline-block bg-white text-stone-900 px-8 py-4 rounded-full"
        >
          Contact me on WhatsApp
        </a>

      </div>
    </div>
  );
}