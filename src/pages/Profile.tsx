
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { userData, updateUserData, loading } = useUserData();
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setFormData({ ...userData });
    }
  }, [userData]);

  if (loading || !formData) {
    return <div className="flex items-center justify-center h-full">Chargement...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserData(formData);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="edit" onClick={() => setIsEditing(true)}>Modifier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Âge:</span>
                  <span>{formData.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sexe:</span>
                  <span>{formData.gender === 'male' ? 'Homme' : 'Femme'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Poids:</span>
                  <span>{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Taille:</span>
                  <span>{formData.height} cm</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Force et activité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Niveau de force:</span>
                  <span>{formData.strengthLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Niveau d'activité:</span>
                  <span>{formData.activityLevel}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Objectifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Objectif principal:</span>
                  <span>{formData.goal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Volume d'entraînement:</span>
                  <span>{formData.trainingVolume}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Régime alimentaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Régime:</span>
                  <span>{formData.dietType || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Allergies:</span>
                  <span>{formData.allergies ? 'Oui' : 'Non'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Santé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Conditions médicales:</span>
                  <span>{formData.medicalConditions ? 'Oui' : 'Non'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <Input 
                      id="age" 
                      name="age" 
                      type="number" 
                      value={formData.age || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexe</Label>
                    <Select 
                      value={formData.gender || ''} 
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input 
                      id="weight" 
                      name="weight" 
                      type="number" 
                      value={formData.weight || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Taille (cm)</Label>
                    <Input 
                      id="height" 
                      name="height" 
                      type="number" 
                      value={formData.height || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Force et activité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="strengthLevel">Niveau de force</Label>
                    <Select 
                      value={formData.strengthLevel || ''} 
                      onValueChange={(value) => handleSelectChange('strengthLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Niveau d'activité</Label>
                    <Select 
                      value={formData.activityLevel || ''} 
                      onValueChange={(value) => handleSelectChange('activityLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sédentaire</SelectItem>
                        <SelectItem value="light">Légère</SelectItem>
                        <SelectItem value="moderate">Modérée</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="very_active">Très active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Objectif principal</Label>
                    <Select 
                      value={formData.goal || ''} 
                      onValueChange={(value) => handleSelectChange('goal', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Perte de poids</SelectItem>
                        <SelectItem value="muscle_gain">Prise de muscle</SelectItem>
                        <SelectItem value="maintenance">Maintien</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingVolume">Volume d'entraînement</Label>
                    <Select 
                      value={formData.trainingVolume || ''} 
                      onValueChange={(value) => handleSelectChange('trainingVolume', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible (1-2 séances/semaine)</SelectItem>
                        <SelectItem value="medium">Moyen (3-4 séances/semaine)</SelectItem>
                        <SelectItem value="high">Élevé (5+ séances/semaine)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Régime alimentaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dietType">Régime</Label>
                    <Select 
                      value={formData.dietType || ''} 
                      onValueChange={(value) => handleSelectChange('dietType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="vegetarian">Végétarien</SelectItem>
                        <SelectItem value="vegan">Végétalien</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paléo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allergies" 
                      checked={formData.allergies || false} 
                      onCheckedChange={(checked) => handleSwitchChange('allergies', checked)} 
                    />
                    <Label htmlFor="allergies">Allergies alimentaires</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Santé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="medicalConditions" 
                      checked={formData.medicalConditions || false} 
                      onCheckedChange={(checked) => handleSwitchChange('medicalConditions', checked)} 
                    />
                    <Label htmlFor="medicalConditions">J'ai des conditions médicales particulières</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
