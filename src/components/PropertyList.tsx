import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingDown } from "lucide-react";

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

interface PropertyListProps {
  properties: Property[];
  onViewProperty: (property: Property) => void;
}

export const PropertyList = ({ properties, onViewProperty }: PropertyListProps) => {
  if (properties.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-8 text-center text-muted-foreground">
          No properties registered yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id} className="shadow-card overflow-hidden hover:shadow-elegant transition-all">
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={property.compressed_image_url}
              alt={property.property_number}
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold">{property.property_number}</h3>
              <p className="text-sm text-muted-foreground">{property.owner_name}</p>
              {property.location && (
                <p className="text-xs text-muted-foreground">{property.location}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <TrendingDown className="h-3 w-3" />
                {property.compression_ratio.toFixed(1)}x
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewProperty(property)}
              >
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
