import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export default function PoniesPage() {
  const navigate = useNavigate();
  const {
    data: ponies,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ponies"],
    queryFn: () => api.getPonies(),
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pony?")) {
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

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Ponies</h1>
        <Button onClick={() => navigate("/ponies/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Pony
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {ponies?.map((pony) => (
            <Card key={pony.id} className="w-[300px] overflow-hidden">
              {pony.image && (
                <div className="relative h-[300px]">
                  <img
                    src={pony.image}
                    alt={pony.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 p-2 flex gap-2">
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
