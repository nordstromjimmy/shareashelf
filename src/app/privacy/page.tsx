import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl">
        <Link href="/">
          <Image
            src="/logo.png"
            className="mx-auto mb-8 transition-transform duration-300 hover:scale-105"
            width={160}
            height={160}
            alt="TopShelfy logo"
          />
        </Link>
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-zinc-400 mb-4">
          At TopShelfy, your privacy is important to us. We do not sell your
          data. Any information you provide is used solely to enhance your
          experience with our app.
        </p>
        <p className="text-zinc-400">
          For detailed information on how we handle data, please contact us
          anytime.
        </p>
      </div>
    </main>
  );
}
