import { Bottle } from "../types/bottle";

export default function BottleCard({ bottle }: { bottle: Bottle }) {
  return (
    <div className="bg-zinc-800 p-3 rounded-xl shadow hover:scale-105 transition-transform duration-200 w-full max-w-xs mx-auto">
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
    </div>
  );
}
