import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface PropertySearchProps {
  onSearch: (propertyNumber: string) => void;
}

export const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Search Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search">Property Number</Label>
            <Input
              id="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter property number"
            />
          </div>
          <Button type="submit" className="mt-8">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
