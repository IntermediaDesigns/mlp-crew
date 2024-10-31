import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Filter, Music, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Pagination } from '../../components/shared/Pagination';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export default function Songs() {
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    author: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['songs', currentPage, pageSize, filters],
    queryFn: () => api.getSongs(pageSize, (currentPage - 1) * pageSize)
  });

  const filteredData = data?.data?.filter(song => {
    if (filters.title && !song.name?.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.author && !(
      song.musicby?.toLowerCase().includes(filters.author.toLowerCase()) ||
      song.lyricsby?.toLowerCase().includes(filters.author.toLowerCase())
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

  const handleVideoClick = (e, url) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
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
              placeholder="Filter by author"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData?.map((song) => (
          <Link key={song.id} to={`/songs/${song.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  {song.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {song.episode && (
                    <div>
                      <p className="text-sm font-medium">Featured in:</p>
                      <p className="text-sm text-muted-foreground">{song.episode}</p>
                    </div>
                  )}
                  {song.length && (
                    <p className="text-sm text-muted-foreground">
                      Duration: {song.length}
                    </p>
                  )}
                  {song.musicby && (
                    <div>
                      <p className="text-sm font-medium">Music by:</p>
                      <p className="text-sm text-muted-foreground">{song.musicby}</p>
                    </div>
                  )}
                  {song.lyricsby && (
                    <div>
                      <p className="text-sm font-medium">Lyrics by:</p>
                      <p className="text-sm text-muted-foreground">{song.lyricsby}</p>
                    </div>
                  )}
                  {song.video && (
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                      onClick={(e) => handleVideoClick(e, song.video)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Watch on YouTube
                    </Button>
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
