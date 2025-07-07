import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-900 to-zinc-900"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
      <div className="max-w-2xl text-center z-10 animate-fade-in">
        <Image
          src="/logo.png"
          className="mx-auto"
          width={160}
          height={160}
          alt="TopShelfy logo"
        />
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Show off your whiskey shelf
          </span>{" "}
          online
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl mb-10">
          Build a stunning digital shelf, add your bottles, tasting notes, and
          share with friends. All in minutes.
        </p>
        <a
          href="/register"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-xl font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-orange-600/25 transition"
        >
          Build your shelf now
        </a>
      </div>
    </main>
  );
}
