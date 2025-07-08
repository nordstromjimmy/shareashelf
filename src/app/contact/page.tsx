import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <Link href="/">
          <Image
            src="/logo.png"
            className="mx-auto mb-8 transition-transform duration-300 hover:scale-105"
            width={160}
            height={160}
            alt="TopShelfy logo"
          />
        </Link>
        <h1 className="text-4xl font-bold mb-6">Contact TopShelfy</h1>
        <p className="text-zinc-400 mb-8">
          Have questions or feedback? We'd love to hear from you. Please reach
          out to us at{" "}
          <a
            href="mailto:info@topshelfy.com"
            className="text-orange-400 hover:text-orange-500"
          >
            info@topshelfy.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
