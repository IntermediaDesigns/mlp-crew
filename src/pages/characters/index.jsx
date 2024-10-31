import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Pagination } from '../../components/shared/Pagination';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

const KINDS = ['Alicorn', 'Unicorn', 'Pegasus', 'Earth', 'Human', 'Dragon', 'Other'];

export default function Characters() {
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    kind: '',
    residence: '',
    occupation: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['characters', currentPage, pageSize, filters],
    queryFn: () => api.getCharacters(pageSize, (currentPage - 1) * pageSize)
  });

  const filteredData = data?.data?.filter(character => {
    if (filters.kind && !character.kind?.includes(filters.kind)) return false;
    if (filters.residence && !character.residence?.toLowerCase().includes(filters.residence.toLowerCase())) return false;
    if (filters.occupation && !character.occupation?.toLowerCase().includes(filters.occupation.toLowerCase())) return false;
    return true;
  });

  const totalItems = filteredData?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.kind || "all"}
              onValueChange={(value) => handleFilterChange('kind', value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by kind" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All kinds</SelectItem>
                {KINDS.map(kind => (
                  <SelectItem key={kind} value={kind}>{kind}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Filter by residence"
              value={filters.residence}
              onChange={(e) => handleFilterChange('residence', e.target.value)}
            />

            <Input
              placeholder="Filter by occupation"
              value={filters.occupation}
              onChange={(e) => handleFilterChange('occupation', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData?.map((character) => (
          <Link key={character.id} to={`/characters/${character.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">{character.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {character.kind && (
                    <div className="flex flex-wrap gap-2">
                      {character.kind.map((kind) => (
                        <span
                          key={kind}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                          {kind}
                        </span>
                      ))}
                    </div>
                  )}
                  {character.image?.[0] && (
                    <img 
                      src={character.image[0]} 
                      alt={character.name}
                      className="w-full h-96 object-cover object-top rounded-md"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
