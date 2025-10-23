-- Create storage bucket for land images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('land-images', 'land-images', true, 52428800);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_number TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  location TEXT,
  original_image_url TEXT NOT NULL,
  compressed_image_url TEXT NOT NULL,
  original_size_bytes INTEGER NOT NULL,
  compressed_size_bytes INTEGER NOT NULL,
  compression_ratio DECIMAL(5,2) NOT NULL,
  quality_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all properties
CREATE POLICY "Allow public read access to properties"
ON public.properties FOR SELECT
TO public
USING (true);

-- Allow public insert for new property registrations
CREATE POLICY "Allow public insert for properties"
ON public.properties FOR INSERT
TO public
WITH CHECK (true);

-- Create storage policies for land images
CREATE POLICY "Allow public read access to land images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'land-images');

CREATE POLICY "Allow public upload to land images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'land-images');

-- Create index for faster property number searches
CREATE INDEX idx_properties_property_number ON public.properties(property_number);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();