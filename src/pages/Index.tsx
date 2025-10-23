import { useState, useEffect } from "react";
import { PropertyRegistration } from "@/components/PropertyRegistration";
import { PropertySearch } from "@/components/PropertySearch";
import { PropertyComparison } from "@/components/PropertyComparison";
import { PropertyList } from "@/components/PropertyList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Upload, Search, Database } from "lucide-react";

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

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = async (propertyNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_number', propertyNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Property not found');
        } else {
          throw error;
        }
        return;
      }

      setSelectedProperty(data);
      toast.success('Property found!');
    } catch (error) {
      console.error('Error searching property:', error);
      toast.error('Failed to search property');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <header className="bg-gradient-earth text-primary-foreground py-12 shadow-elegant">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Land Registry</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl">
            Advanced neural image compression for efficient land records management
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="register" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="register" className="gap-2">
              <Upload className="h-4 w-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Database className="h-4 w-4" />
              All Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <PropertyRegistration onSuccess={fetchProperties} />
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <PropertySearch onSearch={handleSearch} />
            </div>
            {selectedProperty && (
              <div className="animate-in fade-in duration-500">
                <PropertyComparison property={selectedProperty} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : (
              <PropertyList 
                properties={properties} 
                onViewProperty={(property) => setSelectedProperty(property)}
              />
            )}
            {selectedProperty && (
              <div className="animate-in fade-in duration-500">
                <PropertyComparison property={selectedProperty} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Neural Image Compression Technology • Powered by Advanced Algorithms</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
