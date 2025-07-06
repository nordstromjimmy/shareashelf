export type Bottle = {
  id: string;
  shelf_id: string;
  name: string;
  distillery: string | null;
  vintage: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
};
