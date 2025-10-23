import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/compression";

interface PropertyFormData {
  propertyNumber: string;
  ownerName: string;
  location: string;
  image: FileList;
}

export const PropertyRegistration = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    if (!data.image || data.image.length === 0) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      const imageFile = data.image[0];
      const originalSize = imageFile.size;

      // Compress image using neural compression
      const { compressedBlob, compressedSize, compressionRatio, qualityScore } = 
        await compressImage(imageFile);

      // Upload original image
      const originalExt = imageFile.name.split('.').pop();
      const originalPath = `${data.propertyNumber}/original.${originalExt}`;
      const { error: originalError } = await supabase.storage
        .from('land-images')
        .upload(originalPath, imageFile);

      if (originalError) throw originalError;

      // Upload compressed image
      const compressedPath = `${data.propertyNumber}/compressed.webp`;
      const { error: compressedError } = await supabase.storage
        .from('land-images')
        .upload(compressedPath, compressedBlob);

      if (compressedError) throw compressedError;

      // Get public URLs
      const { data: { publicUrl: originalUrl } } = supabase.storage
        .from('land-images')
        .getPublicUrl(originalPath);

      const { data: { publicUrl: compressedUrl } } = supabase.storage
        .from('land-images')
        .getPublicUrl(compressedPath);

      // Save property data
      const { error: dbError } = await supabase
        .from('properties')
        .insert({
          property_number: data.propertyNumber,
          owner_name: data.ownerName,
          location: data.location,
          original_image_url: originalUrl,
          compressed_image_url: compressedUrl,
          original_size_bytes: originalSize,
          compressed_size_bytes: compressedSize,
          compression_ratio: compressionRatio,
          quality_score: qualityScore,
        });

      if (dbError) throw dbError;

      toast.success("Property registered successfully!");
      reset();
      setPreview(null);
      onSuccess();
    } catch (error) {
      console.error("Error registering property:", error);
      toast.error("Failed to register property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-2xl">Register New Property</CardTitle>
        <CardDescription>Upload land images with neural compression</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="propertyNumber">Property Number</Label>
            <Input
              id="propertyNumber"
              {...register("propertyNumber", { required: "Property number is required" })}
              placeholder="e.g., LR-2024-001"
            />
            {errors.propertyNumber && (
              <p className="text-sm text-destructive">{errors.propertyNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              {...register("ownerName", { required: "Owner name is required" })}
              placeholder="Full name of property owner"
            />
            {errors.ownerName && (
              <p className="text-sm text-destructive">{errors.ownerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Property location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Land Image</Label>
            <div className="flex flex-col gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                onChange={handleImageChange}
              />
              {preview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Register Property
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
