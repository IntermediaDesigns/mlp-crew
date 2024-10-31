import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Pagination } from '../../components/shared/Pagination';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export default function Episodes() {
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    writer: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['episodes', currentPage, pageSize, filters],
    queryFn: () => api.getEpisodes(pageSize, (currentPage - 1) * pageSize)
  });

  const filteredData = data?.data?.filter(episode => {
    if (filters.title && !episode.name?.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.writer && !(
      episode.writtenby?.toLowerCase().includes(filters.writer.toLowerCase()) ||
      episode.storyby?.toLowerCase().includes(filters.writer.toLowerCase())
    )) return false;
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Filter by title"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
            />
            <Input
              placeholder="Filter by writer"
              value={filters.writer}
              onChange={(e) => handleFilterChange('writer', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData?.map((episode) => (
          <Link key={episode.id} to={`/episodes/${episode.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">
                  Episode {episode.episode}: {episode.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Season {episode.season}</p>
                    <p className="text-sm text-muted-foreground">
                      Air Date: {new Date(episode.airdate).toLocaleDateString()}
                    </p>
                  </div>
                  {episode.writtenby && (
                    <div>
                      <p className="text-sm font-medium">Written by:</p>
                      <p className="text-sm text-muted-foreground">{episode.writtenby}</p>
                    </div>
                  )}
                  {episode.image && (
                    <img
                      src={episode.image}
                      alt={episode.name}
                      className="w-full h-96 object-cover rounded-md mt-2"
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
