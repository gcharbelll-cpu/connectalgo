-- Add whatsapp_number column to settings table
ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '96176374971';
