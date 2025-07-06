"use client";

import { Bottle } from "../types/bottle";
import Link from "next/link";

export default function BottleCard({ bottle }: { bottle: Bottle }) {
  return (
    <Link
      href={`/shelf/${bottle.shelf_id}/bottle/${bottle.id}`}
      className="relative bg-zinc-800 p-4 rounded-xl shadow hover:scale-105 transition-transform w-full max-w-xs mx-auto block"
    >
      {/* Favorite star */}
      {bottle.favorite && (
        <div className="absolute top-2 right-2 text-yellow-400 text-xl">⭐</div>
      )}

      <img
        src={bottle.image_url || "/bottle.png"}
        alt={bottle.name}
        className="w-full h-36 sm:h-40 object-contain rounded mb-3"
      />

      <h2 className="text-lg font-bold mb-1 truncate">{bottle.name}</h2>
      <p className="text-zinc-400 text-sm truncate">{bottle.distillery}</p>

      {bottle.vintage && (
        <p className="text-zinc-500 text-sm truncate">
          Vintage: {bottle.vintage}
        </p>
      )}

      {/* More collector data */}
      <div className="mt-2 space-y-1 text-sm">
        {bottle.region && (
          <p className="text-zinc-400 truncate">Region: {bottle.region}</p>
        )}
        {bottle.abv && (
          <p className="text-zinc-400 truncate">ABV: {bottle.abv}%</p>
        )}
        {bottle.age && (
          <p className="text-zinc-400 truncate">Age: {bottle.age} yrs</p>
        )}
        {bottle.rating && (
          <p className="text-orange-400 truncate">
            Rating: {bottle.rating}/100
          </p>
        )}
      </div>
    </Link>
  );
}
