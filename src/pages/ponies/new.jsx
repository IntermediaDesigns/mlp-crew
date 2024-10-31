import { api } from '../../services/api';
import PonyForm from '../../components/shared/PonyForm';

export default function NewPonyPage() {
  const handleSubmit = async (formData) => {
    return api.createPony(formData);
  };

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Pony</h1>
      <PonyForm onSubmit={handleSubmit} />
    </div>
  );
}
