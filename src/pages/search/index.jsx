// src/pages/search/index.jsx
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, Tv, Music } from 'lucide-react'
import { api } from '@/services/api'
import { SearchInput } from '@/components/shared/SearchInput'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useDebounce } from '@/hooks/useDebounce'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm)

  const [
    charactersQuery,
    episodesQuery,
    songsQuery
  ] = useQueries({
    queries: [
      {
        queryKey: ['searchCharacters', debouncedSearch],
        queryFn: () => debouncedSearch ? api.searchCharacters(debouncedSearch) : { data: [] },
        enabled: !!debouncedSearch
      },
      {
        queryKey: ['searchEpisodes', debouncedSearch],
        queryFn: () => debouncedSearch ? api.searchEpisodes(debouncedSearch) : { data: [] },
        enabled: !!debouncedSearch
      },
      {
        queryKey: ['searchSongs', debouncedSearch],
        queryFn: () => debouncedSearch ? api.searchSongs(debouncedSearch) : { data: [] },
        enabled: !!debouncedSearch
      }
    ]
  })

  const isLoading = charactersQuery.isLoading || episodesQuery.isLoading || songsQuery.isLoading
  const hasResults = !!(
    charactersQuery.data?.data?.length ||
    episodesQuery.data?.data?.length ||
    songsQuery.data?.data?.length
  )

  return (
    <div className="container py-8 space-y-6">
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search characters, episodes, and songs..."
      />

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && debouncedSearch && !hasResults && (
        <div className="text-center py-8 text-muted-foreground">
          No results found for "{debouncedSearch}"
        </div>
      )}

      {!isLoading && hasResults && (
        <div className="space-y-8">
          {/* Characters Results */}
          {charactersQuery.data?.data?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Characters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {charactersQuery.data.data.map((character) => (
                  <Link key={character.id} to={`/characters/${character.id}`}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                      </CardHeader>
                      {character.image?.[0] && (
                        <CardContent>
                          <img
                            src={character.image[0]}
                            alt={character.name}
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Episodes Results */}
          {episodesQuery.data?.data?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Episodes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {episodesQuery.data.data.map((episode) => (
                  <Link key={episode.id} to={`/episodes/${episode.id}`}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{episode.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Season {episode.season}, Episode {episode.episode}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Songs Results */}
          {songsQuery.data?.data?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Songs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {songsQuery.data.data.map((song) => (
                  <Link key={song.id} to={`/songs/${song.id}`}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{song.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          From {song.episode}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}