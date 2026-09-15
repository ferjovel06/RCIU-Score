const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL environment variable is not set',
  );
}

export const env = Object.freeze({
  supabaseUrl,
});
