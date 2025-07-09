"use client";

import React, { useState, useRef } from "react";
import ShareShelf from "@/components/ShareShelf";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import toast from "react-hot-toast";
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
  showDetails?: boolean;
  customizable?: boolean;
  shareUrl?: string;
  shelfId?: string;
};

const Showroom: React.FC<ShowroomProps> = ({
  topShelfItems = [],
  favoriteItems = [],
  otherItems = [],
  background = "dark_wood",
  ownerName = "",
  showDetails = true,
  customizable = false,
  shareUrl,
  shelfId,
}) => {
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [previewName, setPreviewName] = useState(ownerName);
  const [previewBg, setPreviewBg] = useState(background);
  const [viewMode, setViewMode] = useState<"grid" | "slide">("grid");

  const createScrollRef = () => useRef<HTMLDivElement>(null);
  const topRef = createScrollRef();
  const favRef = createScrollRef();
  const otherRef = createScrollRef();

  const cardClass =
    "relative bg-zinc-900/70 backdrop-blur-md p-4 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 border border-amber-800 w-52";

  const handleSaveSettings = async () => {
    if (!shelfId) return;
    const savingToast = toast.loading("Saving showroom...");
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("shelves")
      .update({
        owner_name: previewName,
        background_theme: previewBg,
      })
      .eq("id", shelfId);

    if (error) {
      console.error("Save failed", error);
      toast.error("Failed to save changes.", { id: savingToast });
    } else {
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

  const renderGridSection = (items: Bottle[], title: string, badge?: string) =>
    items.length > 0 && (
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-serif">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 px-6">
          {items.map((bottle) => (
            <div
              key={bottle.id}
              className={cardClass}
              onClick={() => setSelectedBottle(bottle)}
            >
              {badge && (
                <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-bold">
                  {badge}
                </div>
              )}
              <img
                src={bottle.image_url || "/bottle.png"}
                alt={bottle.name}
                className="w-full h-64 object-contain rounded"
              />
              <div className="text-center mt-3">
                <div className="text-lg font-semibold text-amber-200 drop-shadow">
                  {bottle.name}
                </div>
                {showDetails && bottle.vintage && (
                  <div className="text-sm text-amber-100 mt-1">
                    {bottle.vintage}
                  </div>
                )}
              </div>
            </div>
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
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-serif">
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
            className="flex space-x-6 overflow-x-auto overflow-y-hidden px-24 snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
          >
            {items.map((bottle) => (
              <div
                key={bottle.id}
                className={`${cardClass} flex-shrink-0 snap-center`}
                onClick={() => setSelectedBottle(bottle)}
              >
                <img
                  src={bottle.image_url || "/bottle.png"}
                  alt={bottle.name}
                  className="w-full h-64 object-contain rounded"
                />
                <div className="text-center mt-3">
                  <div className="text-lg font-semibold text-amber-200 drop-shadow">
                    {bottle.name}
                  </div>
                  {showDetails && bottle.vintage && (
                    <div className="text-sm text-amber-100 mt-1">
                      {bottle.vintage}
                    </div>
                  )}
                </div>
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
          <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row gap-4 px-4">
            <input
              type="text"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded text-amber-200 placeholder-amber-400"
              placeholder="Owner name"
            />
            <select
              value={previewBg}
              onChange={(e) => setPreviewBg(e.target.value)}
              className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded text-amber-200"
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

        <div className="flex space-x-4 mb-12">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "slide"
                ? "bg-amber-600 text-zinc-900"
                : "bg-zinc-800 text-amber-200 hover:bg-amber-700 hover:text-zinc-900"
            }`}
          >
            <Columns3 className="w-5 h-5" />
            Slide
          </button>
        </div>

        {previewName && (
          <h1 className="text-4xl font-serif font-bold text-amber-300 mb-16 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]">
            {previewName}&apos;s Shelf
          </h1>
        )}

        {viewMode === "grid" ? (
          <>
            {renderGridSection(topShelfItems, "Top Shelf 🥇", "🥇")}
            {renderGridSection(favoriteItems, "Favorites ⭐", "⭐")}
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedBottle(null)}
        >
          <div
            className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-amber-300"
              onClick={() => setSelectedBottle(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedBottle.image_url || "/bottle.png"}
              alt={selectedBottle.name}
              className="w-full h-full object-contain rounded mb-4"
            />
            <h2 className="text-2xl font-bold text-amber-200 mb-2 font-serif">
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
                <div className="italic">"{selectedBottle.notes}"</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showroom;
