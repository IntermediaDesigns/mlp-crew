import { useQueries } from '@tanstack/react-query';
import { Users, Tv, Music } from 'lucide-react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export default function Dashboard() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['characters'],
        queryFn: () => api.getCharacters()
      },
      {
        queryKey: ['episodes'],
        queryFn: () => api.getEpisodes()
      },
      {
        queryKey: ['songs'],
        queryFn: () => api.getSongs()
      }
    ]
  });

  const [charactersQuery, episodesQuery, songsQuery] = queries;
  const isLoading = queries.some(query => query.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Characters",
      value: charactersQuery.data?.data?.length || 0,
      icon: Users,
      description: "Unique characters in the series"
    },
    {
      title: "Total Episodes",
      value: episodesQuery.data?.data?.length || 0,
      icon: Tv,
      description: "Episodes across all seasons"
    },
    {
      title: "Total Songs",
      value: songsQuery.data?.data?.length || 0,
      icon: Music,
      description: "Musical numbers in the series"
    }
  ];

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div>
      <img
                    src="./mlp2.jpg"
                    alt="group"
                    className="min-w-[70%] h-auto object-cover rounded-2xl mx-auto"
                  />
      </div>
    </div>
  );
}
