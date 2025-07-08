export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-zinc-400 mb-4">
          By using TopShelfy, you agree that you are of legal drinking age in
          your jurisdiction. You also agree not to upload offensive or illegal
          content. We reserve the right to remove content or suspend accounts at
          our discretion. <br></br>
          <br />
          By using TopShelfy, you agree to use the platform responsibly. We
          reserve the right to update these terms at any time.
        </p>
        <p className="text-zinc-400">
          Continued use of the app indicates your acceptance of these terms.
        </p>
      </div>
    </main>
  );
}
