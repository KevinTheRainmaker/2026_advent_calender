-- Add name and commitment fields to mandalas table
-- Migration: Add name and commitment for Mandala chart display

ALTER TABLE mandalas
ADD COLUMN name TEXT,
ADD COLUMN commitment TEXT;

-- Add comments for documentation
COMMENT ON COLUMN mandalas.name IS 'User name displayed on Mandala chart';
COMMENT ON COLUMN mandalas.commitment IS 'User commitment/resolve (다짐) displayed on Mandala chart';
