import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'; 
/* =========================
   APP SETUP
========================= */

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY =process.env.SERVICE_KEY; // ⚠️ server only

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);

/* =========================
   ROUTES
========================= */

/**
 * GET dish by ID
 * URL example:
 * http://localhost:3000/dish/3
 */
app.get("/dish/:id", async (req, res) => {
  const dishId = req.params.id;

  if (!dishId) {
    return res.status(400).json({ error: "Dish ID missing" });
  }

  try {
    console.log("Hello");
    const { data, error } = await supabase
      .from("dishes")
      .select("id,dish_name,ingredients,fact,glb_url,chef_word")
      .eq("id", dishId)
      .single();

    if (error) {
        console.log(error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});