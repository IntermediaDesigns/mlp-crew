// src/pages/episodes/[id].jsx
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Calendar, Users, Music } from 'lucide-react'
import { api } from '@/services/api'
import { DetailHeader } from '@/components/shared/DetailHeader'
import { DataCard } from '@/components/shared/DataCard'
import { AttributeList } from '@/components/shared/AttributeList'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function EpisodeDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['episode', id],
    queryFn: () => api.getEpisodeById(id)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    )
  }

  const episode = data?.data?.[0]

  if (!episode) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Episode not found</p>
      </div>
    )
  }

  return (
    <div>
      <DetailHeader 
        title={episode.name}
        backTo="/episodes"
        backLabel="Episodes"
      />
      
      <div className="container py-8 grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Season {episode.season}, Episode {episode.episode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Aired {episode.airdate}</span>
              </div>
              {episode.song && (
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <span>{episode.song.length} Songs</span>
                </div>
              )}
            </div>

            <DataCard title="Credits">
              <AttributeList
                data={{
                  "Written by": episode.writtenby?.split('\n').join(', '),
                  "Story by": episode.storyby?.split('\n').join(', '),
                  "Storyboard": episode.storyboard?.split('\n').join(', '),
                }}
              />
            </DataCard>

            {episode.song && (
              <DataCard title="Songs">
                <ul className="space-y-2">
                  {episode.song.map((song, index) => (
                    <li key={index} className="text-sm">{song}</li>
                  ))}
                </ul>
              </DataCard>
            )}
          </div>

          <div>
            {episode.image && (
              <img
                src={episode.image}
                alt={episode.name}
                className="rounded-lg border shadow-sm w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}