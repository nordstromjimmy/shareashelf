export type Bottle = {
  id: string;
  shelf_id: string;
  name: string;
  distillery: string | null;
  vintage: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;

  // New extended fields
  abv: number | null; // Alcohol by volume %
  bottle_size: number | null; // in ml
  region: string | null; // e.g. Islay, Highlands
  cask_type: string | null; // e.g. Sherry, Bourbon
  age: number | null; // age statement (years)
  bottling_year: number | null;
  price_paid_value: number | null; // $ or your currency
  price_paid_currency: string | null;
  current_value: number | null; // updated over time
  rating: number | null; // 1-100 personal score
  favorite: boolean; // true / false
  top_shelf: boolean; // true / false
};
