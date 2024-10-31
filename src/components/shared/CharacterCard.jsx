import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export function CharacterCard({ character }) {
  return (
    <Link to={`/characters/${character.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg">{character.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {character.kind && (
              <div>
                <p className="text-sm font-medium">Type:</p>
                <div className="flex flex-wrap gap-1">
                  {character.kind.map((type) => (
                    <span
                      key={type}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {character.occupation && (
              <div>
                <p className="text-sm font-medium">Occupation:</p>
                <p className="text-sm text-muted-foreground">{character.occupation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
