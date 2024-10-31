// src/pages/songs/[id].jsx
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Music, Clock, Play } from 'lucide-react'
import { api } from '@/services/api'
import { DetailHeader } from '@/components/shared/DetailHeader'
import { DataCard } from '@/components/shared/DataCard'
import { AttributeList } from '@/components/shared/AttributeList'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

export default function SongDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['song', id],
    queryFn: () => api.getSongById(id)
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

  const song = data?.data?.[0]

  if (!song) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Song not found</p>
      </div>
    )
  }

  return (
    <div>
      <DetailHeader 
        title={song.name}
        backTo="/songs"
        backLabel="Songs"
      />
      
      <div className="container py-8 grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{song.length}</span>
              </div>
              {song.episode && (
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <span>From {song.episode}</span>
                </div>
              )}
            </div>

            <DataCard title="Credits">
              <AttributeList
                data={{
                  "Music by": song.musicby?.split('\n').join(', '),
                  "Lyrics by": song.lyricsby?.split('\n').join(', '),
                  "Key signature": song.keysignature?.split('\n').join(', '),
                }}
              />
            </DataCard>

            {song.video && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Watch</h2>
                <Button asChild className="w-full">
                  <a href={song.video} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Watch on YouTube
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}