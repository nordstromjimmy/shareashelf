import HandleResetRedirect from "@/components/HandleResetRedirect";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <HandleResetRedirect />
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/bg-image.jpg"
          alt="Whiskey shelf background"
          fill
          className="object-cover [object-position:center_right] sm:[object-position:center]"
          style={{ opacity: 0.25 }}
        />
      </div>

      {/* Radial gradient to darken edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/60 to-black/80 z-10"></div>

      {/* Main content */}
      <div className="max-w-2xl text-center z-30 animate-fade-in">
        {/*         <Image
          src="/logo.png"
          className="mx-auto mb-4"
          width={160}
          height={160}
          alt="TopShelfy logo"
        /> */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Show off your liquor shelf
          </span>{" "}
          online
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl mb-10">
          Build a stunning digital shelf, add your bottles and share with
          friends and community. <br></br>All in minutes.
        </p>
        <a
          href="/login"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-xl font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-orange-600/25 transition"
        >
          Build your shelf now
        </a>
      </div>
    </main>
  );
}
