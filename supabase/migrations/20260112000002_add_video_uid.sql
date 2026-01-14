-- Add video_uid column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_uid VARCHAR(255);

-- Add video_uid column to photoshoot_looks table
ALTER TABLE photoshoot_looks ADD COLUMN IF NOT EXISTS video_uid VARCHAR(255);

-- Add comments
COMMENT ON COLUMN products.video_uid IS 'Cloudflare Stream video UID';
COMMENT ON COLUMN photoshoot_looks.video_uid IS 'Cloudflare Stream video UID';
