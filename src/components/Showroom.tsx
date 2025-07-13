"use client";

import React, { useState, useRef, useEffect } from "react";
import ShareShelf from "@/components/ShareShelf";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import toast from "react-hot-toast";
import Image from "next/image";
import { X, Grid3x3, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";

type Bottle = {
  id: string;
  name: string;
  image_url: string;
  distillery?: string;
  abv?: number;
  rating?: number;
  notes?: string;
  vintage?: string;
  bottle_size?: number;
  region?: string;
  cask_type?: string;
  age?: number;
  bottling_year?: number;
  price_paid_value?: number;
  price_paid_currency?: string;
  favorite?: boolean;
  top_shelf?: boolean;
};

type ShowroomProps = {
  topShelfItems?: Bottle[];
  favoriteItems?: Bottle[];
  otherItems?: Bottle[];
  background?: string;
  ownerName?: string;
  username?: string;
  showDetails?: boolean;
  customizable?: boolean;
  shareUrl?: string;
  shelfId?: string;
  allowViewToggle?: boolean;
};

const Showroom: React.FC<ShowroomProps> = ({
  topShelfItems = [],
  favoriteItems = [],
  otherItems = [],
  background = "dark_wood",
  ownerName = "",
  username = "",
  showDetails = true,
  customizable = false,
  shelfId,
  allowViewToggle = false,
}) => {
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [previewName, setPreviewName] = useState(ownerName);
  const [previewUsername, setPreviewUsername] = useState<string>(username);
  const [previewBg, setPreviewBg] = useState(background);
  const [viewMode, setViewMode] = useState<"grid" | "slide">("grid");

  const [shareUrl, setShareUrl] = useState(
    `${process.env.NEXT_PUBLIC_SITE_URL}/s/${previewUsername}`
  );

  const topRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  // 🚀 LOCK SCROLL WHEN MODAL OPEN
  useEffect(() => {
    if (selectedBottle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBottle]);

  const handleSaveSettings = async () => {
    if (!shelfId) return;

    if (!previewName.trim()) {
      toast.error("Please enter a shelf name.");
      return;
    }

    const sanitizedUsername = previewUsername.trim().toLowerCase();
    if (!/^[a-z0-9_-]+$/.test(sanitizedUsername)) {
      toast.error(
        "Username must be one word, lowercase, letters, numbers, - or _ only."
      );
      return;
    }

    const supabase = createBrowserClient();

    const { data: existing, error: checkError } = await supabase
      .from("shelves")
      .select("id")
      .eq("username", sanitizedUsername)
      .neq("id", shelfId);

    if (checkError || (existing && existing.length > 0)) {
      toast.error("That username is already taken.");
      return;
    }

    const savingToast = toast.loading("Saving showroom...");

    const { error } = await supabase
      .from("shelves")
      .update({
        owner_name: previewName,
        username: sanitizedUsername,
        background_theme: previewBg,
      })
      .eq("id", shelfId);

    if (error) {
      console.error("Save failed", error);
      toast.error("Failed to save changes.", { id: savingToast });
    } else {
      setShareUrl(`${process.env.NEXT_PUBLIC_SITE_URL}/s/${sanitizedUsername}`);
      toast.success("Showroom saved!", { id: savingToast });
    }
  };

  const scrollBy = (
    ref: React.RefObject<HTMLDivElement | null>,
    offset: number
  ) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const BottleCard = ({ bottle }: { bottle: Bottle }) => (
    <div
      onClick={() => setSelectedBottle(bottle)}
      className="relative bg-zinc-900/70 backdrop-blur-md p-4 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 border border-amber-800 w-48 h-80 flex flex-col justify-between"
    >
      <img
        src={bottle.image_url || "/bottle.png"}
        alt={bottle.name}
        className="w-full h-56 object-contain rounded"
      />
      <div className="text-center mt-3">
        <div className="text-lg font-semibold text-amber-200 drop-shadow truncate">
          {bottle.name}
        </div>
      </div>
    </div>
  );

  const renderGridSection = (items: Bottle[], title: string) =>
    items.length > 0 && (
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-amber-300 drop-shadow font-serif">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 px-6">
          {items.map((bottle) => (
            <BottleCard key={bottle.id} bottle={bottle} />
          ))}
        </div>
      </div>
    );

  const renderSlideSection = (
    items: Bottle[],
    title: string,
    ref: React.RefObject<HTMLDivElement | null>
  ) =>
    items.length > 0 && (
      <div className="w-full max-w-7xl mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-300 drop-shadow font-serif">
          {title}
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollBy(ref, -300)}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-800/70 hover:bg-amber-500 p-2 rounded-full transition z-20"
          >
            <ChevronLeft className="text-amber-200 w-6 h-6" />
          </button>
          <div
            ref={ref}
            className={`flex space-x-6 overflow-x-auto overflow-y-hidden px-24 snap-x snap-mandatory ${
              items.length <= 3 ? "md:justify-center" : ""
            }`}
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
          >
            {items.map((bottle) => (
              <div
                key={bottle.id}
                className="flex-shrink-0 w-48 snap-center snap-always overflow-hidden cursor-pointer"
              >
                <BottleCard bottle={bottle} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollBy(ref, 300)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800/70 hover:bg-amber-500 p-2 rounded-full transition z-20"
          >
            <ChevronRight className="text-amber-200 w-6 h-6" />
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-start py-12"
      style={{
        backgroundImage: `url(/bg/${previewBg}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {customizable && (
          <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row flex-wrap gap-4 px-4 justify-center">
            <input
              type="text"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded text-amber-200 placeholder-amber-100/20 min-w-[220px]"
              placeholder="Owner name"
            />
            <input
              type="text"
              value={previewUsername}
              onChange={(e) => setPreviewUsername(e.target.value)}
              className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded text-amber-200 placeholder-amber-100/20 min-w-[220px]"
              placeholder="topshelfy.com/s/your-name"
            />
            <select
              value={previewBg}
              onChange={(e) => setPreviewBg(e.target.value)}
              className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded text-amber-200 min-w-[220px]"
            >
              <option value="neon_bar">Neon bar</option>
              <option value="bar">Standard bar</option>
              <option value="brick_wall">Brick Wall</option>
              <option value="wood_wall">Wood Wall</option>
              <option value="black">Black</option>
              <option value="space">Space</option>
              <option value="field">Field</option>
              <option value="farm">Farm</option>
              <option value="forest">Forest</option>
            </select>

            <button
              onClick={handleSaveSettings}
              className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-amber-600/40 transition cursor-pointer text-zinc-900"
            >
              Save changes
            </button>
            {shareUrl && <ShareShelf url={shareUrl} />}
          </div>
        )}

        {allowViewToggle && (
          <div className="flex space-x-4 mb-12">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-amber-600 text-zinc-900"
                  : "bg-zinc-800 text-amber-200 hover:bg-amber-700 hover:text-zinc-900"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("slide")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === "slide"
                  ? "bg-amber-600 text-zinc-900"
                  : "bg-zinc-800 text-amber-200 hover:bg-amber-700 hover:text-zinc-900"
              }`}
            >
              <Columns3 className="w-5 h-5" />
              Slide
            </button>
          </div>
        )}

        {previewName && (
          <h1 className="text-4xl font-serif font-bold text-amber-300 mb-16 drop-shadow">
            {previewName}&apos;s Shelf
          </h1>
        )}

        {viewMode === "grid" ? (
          <>
            {renderGridSection(topShelfItems, "Top Shelf 🥇")}
            {renderGridSection(favoriteItems, "Favorites ⭐")}
            {renderGridSection(otherItems, "Other Bottles 🍾")}
          </>
        ) : (
          <>
            {renderSlideSection(topShelfItems, "Top Shelf 🥇", topRef)}
            {renderSlideSection(favoriteItems, "Favorites ⭐", favRef)}
            {renderSlideSection(otherItems, "Other Bottles 🍾", otherRef)}
          </>
        )}
      </div>

      {selectedBottle && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setSelectedBottle(null)}
        >
          <div
            className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4 relative max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-amber-300"
              onClick={() => setSelectedBottle(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-96">
                <Image
                  src={selectedBottle.image_url || "/bottle.png"}
                  alt={selectedBottle.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-amber-200 mt-4 mb-2 font-serif">
              {selectedBottle.name}
            </h2>
            <div className="space-y-1 text-amber-100">
              {selectedBottle.distillery && (
                <div>Distillery: {selectedBottle.distillery}</div>
              )}
              {selectedBottle.vintage && (
                <div>Vintage: {selectedBottle.vintage}</div>
              )}
              {selectedBottle.abv && <div>ABV: {selectedBottle.abv}%</div>}
              {selectedBottle.bottle_size && (
                <div>Size: {selectedBottle.bottle_size}ml</div>
              )}
              {selectedBottle.region && (
                <div>Region: {selectedBottle.region}</div>
              )}
              {selectedBottle.cask_type && (
                <div>Cask: {selectedBottle.cask_type}</div>
              )}
              {selectedBottle.age && <div>Age: {selectedBottle.age}</div>}
              {selectedBottle.bottling_year && (
                <div>Bottled: {selectedBottle.bottling_year}</div>
              )}
              {selectedBottle.price_paid_value && (
                <div>
                  Price: {selectedBottle.price_paid_value}{" "}
                  {selectedBottle.price_paid_currency || ""}
                </div>
              )}
              {selectedBottle.rating && (
                <div>Rating: {selectedBottle.rating}/100</div>
              )}
              {selectedBottle.notes && (
                <div className="italic mt-4">
                  Tasting notes: "{selectedBottle.notes}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showroom;
