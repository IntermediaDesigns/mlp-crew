import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { api } from '../../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Card } from '../ui/card';

const PONY_ATTRIBUTES = {
  kind: ['Earth Pony', 'Unicorn', 'Pegasus', 'Alicorn'],
  personality: ['Friendly', 'Brave', 'Clever', 'Energetic', 'Shy', 'Creative'],
  skills: ['Magic', 'Flying', 'Athletics', 'Art', 'Music', 'Leadership']
};

export default function PonyForm({ initialData = null, onSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData || {
    name: '',
    kind: '',
    personality: [],
    skills: [],
    description: '',
    image: ''
  });

  // Fetch available ponies based on selected kind
  const { data: ponies, isLoading } = useQuery({
    queryKey: ['characters', formData.kind],
    queryFn: () => formData.kind ? api.searchCharacters(formData.kind) : null,
    enabled: !!formData.kind
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      navigate('/ponies');
    } catch (error) {
      console.error('Error saving pony:', error);
    }
  };

  const handleAttributeClick = (category, value) => {
    setFormData(prev => {
      if (category === 'kind') {
        return { ...prev, [category]: value, image: '' }; // Reset image when kind changes
      }
      const array = prev[category] || [];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [category]: newArray };
    });
  };

  const handlePonySelect = (image) => {
    setFormData(prev => ({
      ...prev,
      image: image,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          placeholder="Enter pony name"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Kind</label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.kind.map(kind => (
            <Button
              key={kind}
              type="button"
              variant={formData.kind === kind ? 'default' : 'outline'}
              onClick={() => handleAttributeClick('kind', kind)}
            >
              {kind}
            </Button>
          ))}
        </div>
      </div>

      {/* Available Ponies Section */}
      {formData.kind && (
        <div>
          <label className="block text-sm font-medium mb-2">Select a Pony Image</label>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
              {ponies?.data?.filter(pony => 
                pony.kind?.includes(formData.kind) && pony.image?.[0]
              ).map((pony, index) => (
                <Card 
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                    formData.image === pony.image[0] ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePonySelect(pony.image[0])}
                >
                  <img
                    src={pony.image[0]}
                    alt="Pony"
                    className="w-auto h-full object-cover rounded-md"
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Personality Traits</label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.personality.map(trait => (
            <Button
              key={trait}
              type="button"
              variant={formData.personality?.includes(trait) ? 'default' : 'outline'}
              onClick={() => handleAttributeClick('personality', trait)}
            >
              {trait}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Skills</label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.skills.map(skill => (
            <Button
              key={skill}
              type="button"
              variant={formData.skills?.includes(skill) ? 'default' : 'outline'}
              onClick={() => handleAttributeClick('skills', skill)}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full min-h-[100px] p-2 border rounded-md text-gray-900 dark:text-gray-900 bg-white dark:bg-white"
          placeholder="Describe your pony..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/ponies')}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Pony' : 'Create Pony'}
        </Button>
      </div>
    </form>
  );
}

PonyForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    kind: PropTypes.string,
    personality: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    image: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired
};
