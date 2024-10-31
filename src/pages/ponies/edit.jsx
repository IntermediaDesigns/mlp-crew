import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import PonyForm from '../../components/shared/PonyForm';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export default function EditPonyPage() {
  const { id } = useParams();
  
  const { data: pony, isLoading } = useQuery({
    queryKey: ['pony', id],
    queryFn: () => api.getPonyById(id)
  });

  const handleSubmit = async (formData) => {
    return api.updatePony(id, formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Pony</h1>
      <PonyForm initialData={pony} onSubmit={handleSubmit} />
    </div>
  );
}
