"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import type { Bottle } from "@/types/bottle";
import ConfirmModal from "./ConfirmModal";
import compressImage from "@/lib/compressImage";
import { Camera, Upload } from "lucide-react";

export default function EditBottleForm({ bottle }: { bottle: Bottle }) {
  const router = useRouter();

  // All your existing fields
  const [name, setName] = useState(bottle.name);
  const [distillery, setDistillery] = useState(bottle.distillery ?? "");
  const [vintage, setVintage] = useState(bottle.vintage ?? "");
  const [notes, setNotes] = useState(bottle.notes ?? "");
  const [abv, setAbv] = useState(bottle.abv ?? "");
  const [bottleSize, setBottleSize] = useState(bottle.bottle_size ?? "");
  const [region, setRegion] = useState(bottle.region ?? "");
  const [caskType, setCaskType] = useState(bottle.cask_type ?? "");
  const [age, setAge] = useState(bottle.age ?? "");
  const [bottlingYear, setBottlingYear] = useState(bottle.bottling_year ?? "");
  const [pricePaidValue, setPricePaidValue] = useState(
    bottle.price_paid_value ?? ""
  );
  const [pricePaidCurrency, setPricePaidCurrency] = useState(
    bottle.price_paid_currency ?? ""
  );
  const [rating, setRating] = useState(bottle.rating ?? "");
  const [favorite, setFavorite] = useState(bottle.favorite ?? false);
  const [topShelf, setTopShelf] = useState(bottle.top_shelf ?? false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Image upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    bottle.image_url ?? null
  );
  const [imagePublicUrl] = useState<string | null>(bottle.image_url ?? null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const compressed = await compressImage(file, 0.8, 1000);
    console.log("Compressed size:", compressed.size / 1024, "KB");

    setCompressedBlob(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      let finalImageUrl = imagePublicUrl ?? bottle.image_url;

      // Upload new image if selected
      if (compressedBlob) {
        const filePath = `user-uploads/${Date.now()}-${name.replace(
          /\s+/g,
          "-"
        )}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("bottle-images")
          .upload(filePath, compressedBlob);

        if (uploadError) throw uploadError;

        finalImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bottle-images/${filePath}`;
      }

      // Update bottle record
      const { error } = await supabase
        .from("bottles")
        .update({
          name,
          distillery,
          vintage,
          notes,
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
          image_url: finalImageUrl,
        })
        .eq("id", bottle.id);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      // Delete old image if a new one was uploaded
      if (compressedBlob && bottle.image_url) {
        const oldPath = extractStoragePath(bottle.image_url);
        await supabase.storage.from("bottle-images").remove([oldPath]);
      }

      router.refresh();
      router.push(`/shelf/${bottle.shelf_id}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const supabase = createBrowserClient();
    try {
      if (bottle.image_url) {
        const path = extractStoragePath(bottle.image_url);
        await supabase.storage.from("bottle-images").remove([path]);
      }
      const { error } = await supabase
        .from("bottles")
        .delete()
        .eq("id", bottle.id);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      router.refresh();
      router.push(`/shelf/${bottle.shelf_id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong.");
      }
    }
  };

  function extractStoragePath(publicUrl: string): string {
    const parts = publicUrl.split("/bottle-images/");
    return parts[1] || "";
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

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
          rows={4}
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

      {/* Rest of your inputs unchanged... */}
      <div className="pt-6 mt-6 border-t border-zinc-700 space-y-4">
        <h2 className="text-xl font-bold mb-2">Additional details</h2>
        <div className="grid grid-cols-2 gap-4">
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
            <span className="text-zinc-300">Mark as favorite</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={topShelf}
              onChange={(e) => setTopShelf(e.target.checked)}
              className="mr-2"
            />
            <span className="text-zinc-300">Move to top shelf</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>

      <ConfirmModal
        title="Delete bottle"
        message="Are you sure you want to delete this bottle?"
        onConfirm={handleDelete}
      >
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-red-600/40 cursor-pointer"
        >
          Delete bottle
        </button>
      </ConfirmModal>
    </form>
  );
}
