import { useQuery } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

function calculateSuccessMetrics(ponies) {
  const total = ponies.length;
  if (total === 0) return { stats: {}, teamSuccess: 0 };

  // Calculate attribute percentages
  const stats = {
    kinds: {},
    personalities: {},
    skills: {},
    roles: {}
  };

  // Calculate totals
  ponies.forEach(pony => {
    // Kinds
    stats.kinds[pony.kind] = (stats.kinds[pony.kind] || 0) + 1;

    // Personalities
    pony.personality?.forEach(trait => {
      stats.personalities[trait] = (stats.personalities[trait] || 0) + 1;
    });

    // Skills
    pony.skills?.forEach(skill => {
      stats.skills[skill] = (stats.skills[skill] || 0) + 1;
    });

    // Roles
    if (pony.role) {
      stats.roles[pony.role] = (stats.roles[pony.role] || 0) + 1;
    }
  });

  // Convert to percentages
  Object.keys(stats).forEach(category => {
    Object.keys(stats[category]).forEach(key => {
      stats[category][key] = Math.round((stats[category][key] / total) * 100);
    });
  });

  // Calculate team success score (0-100)
  let teamSuccess = 0;
  
  // Leadership bonus
  if (stats.skills['Leadership'] > 20) teamSuccess += 20;
  
  // Diversity bonus (kinds)
  const kindDiversity = Object.keys(stats.kinds).length;
  teamSuccess += kindDiversity * 10;

  // Skill coverage
  const skillCoverage = Object.keys(stats.skills).length;
  teamSuccess += skillCoverage * 5;

  // Role balance (if using roles)
  const hasRoles = Object.keys(stats.roles).length > 0;
  if (hasRoles) {
    const roleBalance = Math.min(...Object.values(stats.roles));
    teamSuccess += roleBalance;
  }

  // Cap at 100
  teamSuccess = Math.min(100, teamSuccess);

  return { stats, teamSuccess };
}

export default function PoniesPage() {
  const navigate = useNavigate();
  const { data: ponies, isLoading, refetch } = useQuery({
    queryKey: ['ponies'],
    queryFn: () => api.getPonies()
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pony?')) {
      await api.deletePony(id);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const { stats, teamSuccess } = calculateSuccessMetrics(ponies || []);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Ponies</h1>
        <Button onClick={() => navigate('/ponies/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Pony
        </Button>
      </div>

      {/* Team Stats */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Team Statistics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium mb-2">Team Success Score</h3>
            <div className="text-2xl font-bold text-primary">{teamSuccess}%</div>
          </div>

          {Object.entries(stats).map(([category, values]) => (
            Object.keys(values).length > 0 && (
              <div key={category}>
                <h3 className="font-medium mb-2 capitalize">{category}</h3>
                <div className="space-y-1">
                  {Object.entries(values).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span>{key}</span>
                      <span>{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </Card>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {ponies?.map((pony) => (
            <Card 
              key={pony.id} 
              className={`w-[300px] overflow-hidden transition-all duration-300 ${
                teamSuccess >= 75 ? 'border-primary/50' : ''
              }`}
            >
              {pony.image && (
                <div className="relative h-[300px]">
                  <img
                    src={pony.image}
                    alt={pony.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 p-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/ponies/${pony.id}/edit`);
                      }}
                    >
                      <Pencil className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(pony.id);
                      }}
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg tracking-wider">
                    <span className="font-semibold tracking-wider">Name: </span>{" "}
                    {pony.name}
                  </h3>
                  <p className="text-lg text-muted-foreground">{pony.kind}</p>
                </div>

                <div className="space-y-2">
                  {pony.personality?.length > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                      <p className="text-lg font-medium tracking-wider">Personality:</p>
                      <div className="flex flex-wrap gap-1">
                        {pony.personality.map((trait) => (
                          <span
                            key={trait}
                            className="text-xs bg-primary/10 text-primary p-2 rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {pony.skills?.length > 0 && (
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-medium tracking-wider">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {pony.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-primary/10 text-primary p-2 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                <Button
                  variant="link"
                    className="p-2 tracking-wider border hover:text-green-500 hover:border-green-500"
                  onClick={() => navigate(`/ponies/${pony.id}`)}
                >
                  View Details
                </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
