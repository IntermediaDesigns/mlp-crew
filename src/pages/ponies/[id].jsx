import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pencil, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export default function PonyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pony, isLoading } = useQuery({
    queryKey: ["pony", id],
    queryFn: () => api.getPonyById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/ponies")}
            className="text-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
        </div>
        <Button onClick={() => navigate(`/ponies/${id}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Pony
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-wider flex justify-center">
          {pony.name}
        </h1>
        {pony.image && (
          <div className="mb-6">
            <img
              src={pony.image}
              alt={pony.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Type</h3>
          <p>{pony.kind}</p>
        </div>

        {pony.personality?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Personality Traits</h3>
            <div className="flex flex-wrap gap-2">
              {pony.personality.map((trait) => (
                <span
                  key={trait}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {pony.skills?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {pony.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {pony.description && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{pony.description}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
