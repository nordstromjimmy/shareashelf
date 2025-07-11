"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import compressImage from "@/lib/compressImage";
import { Camera, Upload } from "lucide-react";

export default function NewBottlePage() {
  const router = useRouter();
  const [shelfId, setShelfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fields
  const [name, setName] = useState("");
  const [distillery, setDistillery] = useState("");
  const [vintage, setVintage] = useState("");
  const [notes, setNotes] = useState("");
  const [abv, setAbv] = useState<number | "">("");
  const [bottleSize, setBottleSize] = useState<number | "">("");
  const [region, setRegion] = useState("");
  const [caskType, setCaskType] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [bottlingYear, setBottlingYear] = useState<number | "">("");
  const [pricePaidValue, setPricePaidValue] = useState<number | "">("");
  const [pricePaidCurrency, setPricePaidCurrency] = useState<string | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [favorite, setFavorite] = useState(false);
  const [topShelf, setTopShelf] = useState(false);

  // Image upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const loadShelf = async () => {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: shelf } = await supabase
        .from("shelves")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!shelf) {
        setErrorMsg("No shelf found. Please create one first.");
      } else {
        setShelfId(shelf.id);
      }
    };
    loadShelf();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const compressed = await compressImage(file, 0.8, 1000);

    setCompressedBlob(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelfId) {
      setErrorMsg("No shelf selected.");
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const userId = user.id;
    try {
      let finalImageUrl = "/bottle.png"; // fallback

      if (compressedBlob) {
        const filePath = `user_${userId}/${Date.now()}-${name.replace(
          /\s+/g,
          "-"
        )}.webp`;

        const { error } = await supabase.storage
          .from("bottle-images")
          .upload(filePath, compressedBlob);

        if (error) throw error;

        finalImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bottle-images/${filePath}`;
      }

      const { error } = await supabase.from("bottles").insert({
        shelf_id: shelfId,
        name,
        distillery,
        vintage,
        notes,
        image_url: finalImageUrl,
        abv: abv === "" ? null : abv,
        bottle_size: bottleSize === "" ? null : bottleSize,
        region,
        cask_type: caskType,
        age: age === "" ? null : age,
        bottling_year: bottlingYear === "" ? null : bottlingYear,
        price_paid_value: pricePaidValue === "" ? null : pricePaidValue,
        price_paid_currency:
          pricePaidCurrency === "" ? null : pricePaidCurrency,
        rating: rating === "" ? null : rating,
        favorite,
        top_shelf: topShelf,
      });

      if (error) throw error;

      router.push(`/shelf/${shelfId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Add a new bottle</h1>

      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            required
          />

          <input
            type="text"
            placeholder="Distillery"
            value={distillery}
            onChange={(e) => setDistillery(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <input
            type="text"
            placeholder="Vintage"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            rows={3}
          />
          <div className="flex flex-col items-center space-y-4">
            {/* Upload from gallery */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition shadow hover:shadow-orange-600/40"
            >
              <Upload className="w-6 h-6" />
              Upload from gallery
            </label>

            {/* Take photo */}
            <input
              id="camera-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="camera-upload"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition shadow hover:shadow-orange-600/40"
            >
              <Camera className="w-6 h-6" />
              Take photo
            </label>

            {previewUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Bottle preview"
                  className="rounded shadow max-h-48"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-700 space-y-4">
          <h2 className="text-xl font-bold mb-2">Additional details</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* All your inputs exactly the same */}
            <input
              type="number"
              step="0.1"
              placeholder="ABV (%)"
              value={abv}
              onChange={(e) =>
                setAbv(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Size (ml)"
              value={bottleSize}
              onChange={(e) =>
                setBottleSize(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Cask type"
              value={caskType}
              onChange={(e) => setCaskType(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Bottling year"
              value={bottlingYear}
              onChange={(e) =>
                setBottlingYear(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price paid"
              value={pricePaidValue}
              onChange={(e) =>
                setPricePaidValue(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Currency"
              value={pricePaidCurrency}
              onChange={(e) => setPricePaidCurrency(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Rating"
              value={rating}
              onChange={(e) =>
                setRating(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="mr-2"
              />
              <span className="text-zinc-300">Favorite ⭐</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={topShelf}
                onChange={(e) => setTopShelf(e.target.checked)}
                className="mr-2"
              />
              <span className="text-zinc-300">Top shelf 🥇</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
        >
          {loading ? "Saving..." : "Save bottle"}
        </button>
      </form>
    </main>
  );
}
