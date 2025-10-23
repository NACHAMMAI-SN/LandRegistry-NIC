import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileImage, TrendingDown, Gauge, MapPin, User, Hash } from "lucide-react";

interface Property {
  id: string;
  property_number: string;
  owner_name: string;
  location: string | null;
  original_image_url: string;
  compressed_image_url: string;
  original_size_bytes: number;
  compressed_size_bytes: number;
  compression_ratio: number;
  quality_score: number | null;
  created_at: string;
}

interface PropertyComparisonProps {
  property: Property;
}

export const PropertyComparison = ({ property }: PropertyComparisonProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savedSpace = property.original_size_bytes - property.compressed_size_bytes;
  const savedPercentage = ((savedSpace / property.original_size_bytes) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Property Details</CardTitle>
              <CardDescription>Registered land information</CardDescription>
            </div>
            <Badge className="bg-gradient-earth">
              {property.compression_ratio.toFixed(1)}x Compression
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Property Number:</span>
              <span className="text-sm">{property.property_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Owner:</span>
              <span className="text-sm">{property.owner_name}</span>
            </div>
            {property.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{property.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Original Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={property.original_image_url}
                alt="Original land"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File Size:</span>
                <span className="font-medium">{formatFileSize(property.original_size_bytes)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">Original Quality</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Compressed Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border border-primary/50 bg-muted">
              <img
                src={property.compressed_image_url}
                alt="Compressed land"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File Size:</span>
                <span className="font-medium text-primary">
                  {formatFileSize(property.compressed_size_bytes)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">Neural Compressed (WebP)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant bg-gradient-earth text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Compression Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm opacity-90">Storage Saved</p>
              <p className="text-3xl font-bold">{formatFileSize(savedSpace)}</p>
              <p className="text-sm opacity-75">{savedPercentage}% reduction</p>
            </div>
            <Separator orientation="vertical" className="hidden md:block bg-white/20" />
            <div className="space-y-2">
              <p className="text-sm opacity-90">Compression Ratio</p>
              <p className="text-3xl font-bold">{property.compression_ratio.toFixed(2)}x</p>
              <p className="text-sm opacity-75">Neural compression</p>
            </div>
            <Separator orientation="vertical" className="hidden md:block bg-white/20" />
            <div className="space-y-2">
              <p className="text-sm opacity-90">Quality Score</p>
              <p className="text-3xl font-bold">
                {property.quality_score ? `${property.quality_score.toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-sm opacity-75">Visual fidelity maintained</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
