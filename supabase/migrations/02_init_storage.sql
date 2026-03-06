-- 02_init_storage.sql
-- Create a new public storage bucket for strategy records

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('strategy_records', 'strategy_records', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can read files from public buckets
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'strategy_records' );

-- Policy: Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'strategy_records' );

-- Policy: Authenticated users can update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE
TO authenticated
USING ( bucket_id = 'strategy_records' );

-- Policy: Authenticated users can delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE
TO authenticated
USING ( bucket_id = 'strategy_records' );
