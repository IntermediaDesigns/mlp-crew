// src/pages/characters/[id].jsx
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'
import { DetailHeader } from '@/components/shared/DetailHeader'
import { DataCard } from '@/components/shared/DataCard'
import { AttributeList } from '@/components/shared/AttributeList'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function CharacterDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['character', id],
    queryFn: () => api.getCharacterById(id)
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

  const character = data?.data?.[0]

  if (!character) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Character not found</p>
      </div>
    )
  }

  return (
    <div>
      <DetailHeader 
        title={character.name}
        backTo="/characters"
        backLabel="Characters"
      />
      
      <div className="container py-8 grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <DataCard title="Details">
              <AttributeList
                data={{
                  Name: character.name,
                  ...(character.alias && { Alias: character.alias }),
                  ...(character.sex && { Sex: character.sex }),
                  Kind: character.kind?.join(', ') || 'Unknown',
                }}
              />
            </DataCard>

            {character.occupation && (
              <DataCard title="Occupation">
                <div className="space-y-2">
                  {character.occupation.split('\n').map((occupation, index) => (
                    <p key={index} className="text-sm">{occupation}</p>
                  ))}
                </div>
              </DataCard>
            )}

            {character.residence && (
              <DataCard title="Residence">
                <div className="space-y-2">
                  {character.residence.split('\n').map((residence, index) => (
                    <p key={index} className="text-sm">{residence}</p>
                  ))}
                </div>
              </DataCard>
            )}
          </div>

          <div className="space-y-6">
            {character.image?.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${character.name} - Image ${index + 1}`}
                className="rounded-lg border shadow-sm w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}