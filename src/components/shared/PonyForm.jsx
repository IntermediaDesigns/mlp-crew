import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { api } from "../../services/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const PONY_ATTRIBUTES = {
  kind: [
    "Unicorn",
    "Pegasus",
    "Alicorn",
    "Seapony",
    "Dragon",
    "Griffon",
    "Changeling",
    "Yak",
    "Hippogriff",
    "Siren",
  ],
  personality: ["Friendly", "Brave", "Clever", "Energetic", "Shy", "Creative"],
  skills: ["Magic", "Flying", "Athletics", "Art", "Music", "Leadership"],
};

const CATEGORIES = {
  "Fighter Class": {
    options: [
      "Warrior",
      "Mage",
      "Rogue",
      "Cleric",
      "Bard",
      "Ranger",
      "Druid",
      "Paladin",
    ],
    requiredSkills: {
      Warrior: ["Athletics"],
      Mage: ["Magic"],
      Rogue: ["Athletics"],
      Cleric: ["Magic"],
      Bard: ["Music"],
      Ranger: ["Athletics", "Flying"],
      Druid: ["Magic", "Athletics"],
      Paladin: ["Leadership", "Athletics"],
    },
  },
  "Team Role": {
    options: [
      "Project Manager",
      "Product Owner",
      "Developer",
      "Designer",
      "QA Engineer",
      "Software Engineer",
      "Scrum Master",
      "DevOps Engineer",
      "UX Designer",
      "Data Scientist",
      "Data Analyst",
      "Technical Writer",
      "Content Writer",
    ],
    requiredSkills: {
      "Project Manager": ["Leadership"],
      Developer: ["Magic"],
      Designer: ["Art"],
      "QA Engineer": ["Athletics"],
      "Software Engineer": ["Magic", "Athletics"],
      "Scrum Master": ["Leadership", "Athletics"],
      "DevOps Engineer": ["Magic", "Athletics"],
      "UX Designer": ["Art", "Creative"],
      "Data Scientist": ["Magic", "Clever"],
      "Data Analyst": ["Clever"],
      "Technical Writer": ["Creative"],
      "Content Writer": ["Creative"],
    },
  },
};

export default function PonyForm({ initialData = null, onSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      kind: "",
      personality: [],
      skills: [],
      description: "",
      image: "",
      category: "",
      role: "",
    }
  );

  // Fetch available ponies based on selected kind
  const { data: ponies, isLoading } = useQuery({
    queryKey: ["characters", formData.kind],
    queryFn: () => (formData.kind ? api.searchCharacters(formData.kind) : null),
    enabled: !!formData.kind,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required skills based on category and role
    if (formData.category && formData.role) {
      const requiredSkills =
        CATEGORIES[formData.category].requiredSkills[formData.role];
      const hasRequiredSkills = requiredSkills.every((skill) =>
        formData.skills.includes(skill)
      );

      if (!hasRequiredSkills) {
        alert(
          `This role requires the following skills: ${requiredSkills.join(
            ", "
          )}`
        );
        return;
      }
    }

    try {
      await onSubmit(formData);
      navigate("/ponies");
    } catch (error) {
      console.error("Error saving pony:", error);
    }
  };

  const handleAttributeClick = (category, value) => {
    setFormData((prev) => {
      if (category === "kind") {
        return { ...prev, [category]: value, image: "" }; // Reset image when kind changes
      }
      const array = prev[category] || [];
      const newArray = array.includes(value)
        ? array.filter((item) => item !== value)
        : [...array, value];
      return { ...prev, [category]: newArray };
    });
    console.log("formData:", formData);
  };

  const handlePonySelect = (image) => {
    setFormData((prev) => ({
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          placeholder="Enter pony name"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value, role: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CATEGORIES).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.category && (
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[formData.category].options.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Kind</label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.kind.map((kind) => (
            <Button
              key={kind}
              type="button"
              variant={formData.kind === kind ? "default" : "outline"}
              onClick={() => handleAttributeClick("kind", kind)}
            >
              {kind}
            </Button>
          ))}
        </div>
      </div>

      {/* Available Ponies Section */}
      {formData.kind && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Select a Pony Image
          </label>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] p-2 overflow-y-auto">
              {ponies?.data
                ?.filter(
                  (pony) =>
                    pony.kind?.includes(formData.kind) && pony.image?.[0]
                )
                .map((pony, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                      formData.image === pony.image[0]
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handlePonySelect(pony.image[0])}
                  >
                    <img
                      src={pony.image[0]}
                      alt="Pony"
                      className="w-full h-[160px] object-cover rounded-md"
                    />
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Personality Traits
        </label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.personality.map((trait) => (
            <Button
              key={trait}
              type="button"
              variant={
                formData.personality?.includes(trait) ? "default" : "outline"
              }
              onClick={() => handleAttributeClick("personality", trait)}
            >
              {trait}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Skills</label>
        <div className="flex flex-wrap gap-2">
          {PONY_ATTRIBUTES.skills.map((skill) => (
            <Button
              key={skill}
              type="button"
              variant={formData.skills?.includes(skill) ? "default" : "outline"}
              onClick={() => handleAttributeClick("skills", skill)}
            >
              {skill}
            </Button>
          ))}
        </div>
        {formData.category && formData.role && (
          <p className="text-sm text-muted-foreground mt-2">
            Required skills for {formData.role}:{" "}
            {CATEGORIES[formData.category].requiredSkills[formData.role].join(
              ", "
            )}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full min-h-[100px] p-2 border rounded-md text-gray-900 dark:text-gray-900 bg-white dark:bg-white"
          placeholder="Describe your pony..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/ponies")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Pony" : "Create Pony"}
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
    image: PropTypes.string,
    category: PropTypes.string,
    role: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};
