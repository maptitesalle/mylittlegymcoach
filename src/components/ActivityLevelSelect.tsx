
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityLevels = {
  sedentary: {
    label: 'Sédentaire (peu ou pas d\'activité physique régulière)',
    nap: 1.2
  },
  lightly_active: {
    label: 'Légèrement actif (activité physique légère, marche occasionnelle)',
    nap: 1.375
  },
  moderately_active: {
    label: 'Modérément actif (quelques séances de sport par semaine)',
    nap: 1.55
  },
  very_active: {
    label: 'Très actif (activité physique intense quotidienne)',
    nap: 1.725
  }
};

interface ActivityLevelSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="activityLevel">Niveau d'activité physique</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="activityLevel">
          <SelectValue placeholder="Sélectionnez votre niveau d'activité" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(activityLevels).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { ActivityLevelSelect, activityLevels };
