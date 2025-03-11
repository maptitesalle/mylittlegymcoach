
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, previousRecipes = [], requestId } = await req.json();
    
    // Vérifier que nous avons reçu un prompt
    if (!prompt) {
      throw new Error('Prompt non fourni');
    }
    
    // Vérifier que l'API key est disponible
    if (!openAIApiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }
    
    // Modifier le prompt pour exclure les recettes précédentes si elles existent
    let modifiedPrompt = prompt;
    if (type === 'nutrition' && previousRecipes.length > 0) {
      modifiedPrompt += `\n\nImportant: Ne pas proposer à nouveau les recettes suivantes qui ont déjà été suggérées:\n${previousRecipes.join('\n')}`;
    }

    console.log(`Génération de contenu ${type} avec GPT-4o-mini...`);
    
    // Démarrer la génération dans une tâche d'arrière-plan
    const generationPromise = generateContent(modifiedPrompt, type);
    
    // Si nous avons un requestId, nous pouvons gérer cela comme une tâche d'arrière-plan
    if (requestId) {
      // Utiliser EdgeRuntime.waitUntil pour permettre à la fonction de continuer 
      // en arrière-plan même si la connexion est fermée
      EdgeRuntime.waitUntil((async () => {
        try {
          const generatedContent = await generationPromise;
          console.log(`Génération réussie pour requestId: ${requestId}`);
          // Ici, vous pourriez stocker le résultat dans une table Supabase pour le récupérer plus tard
        } catch (error) {
          console.error(`Erreur en arrière-plan pour requestId: ${requestId}`, error);
        }
      })());
      
      // Retourner immédiatement une réponse au client
      return new Response(JSON.stringify({ 
        status: 'processing',
        message: 'La génération du contenu a démarré en arrière-plan',
        requestId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Mode synchrone - attendre la génération et renvoyer le résultat
      const generatedContent = await generationPromise;
      console.log('Génération réussie');

      return new Response(JSON.stringify({ content: generatedContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Erreur dans la fonction generate-content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Fonction pour générer le contenu avec OpenAI
async function generateContent(prompt: string, type: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: getSystemPrompt(type)
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: getMaxTokens(type),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur de l\'API OpenAI:', errorData);
    throw new Error(`Erreur de l'API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Réponse inattendue de l\'API OpenAI');
  }
  
  return data.choices[0].message.content;
}

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'nutrition':
      return `Tu es un expert en nutrition et diététique, spécialisé dans la création de plans alimentaires personnalisés. 
      Ta mission est de créer un plan nutritionnel détaillé sur 7 jours avec un format structuré et exportable.
      
      Pour chaque jour:
      1. Inclure exactement 3 repas (petit-déjeuner, déjeuner, dîner) et 1 collation
      2. Fournir des recettes complètes avec:
         - Titre de la recette
         - Liste d'ingrédients détaillée avec quantités précises
         - Instructions de préparation étape par étape
      3. Inclure les macronutriments et calories par repas et le total journalier
      
      Format ton plan nutritionnel en utilisant markdown pour une structure claire:
      - Utilise # pour les grands titres (jours)
      - Utilise ## pour les repas
      - Utilise ### pour les informations détaillées (ingrédients, instructions)
      - Utilise des listes à puces pour les étapes et ingrédients
      
      Ta réponse doit être organisée et lisible, avec une attention particulière aux détails nutritionnels liés aux objectifs spécifiques de l'utilisateur.`;
      
    case 'supplements':
      return `Tu es un expert en compléments alimentaires et nutrition sportive. 
      Ta mission est de recommander des compléments alimentaires adaptés au profil et aux objectifs de l'utilisateur.
      
      Fournir des recommandations précises incluant:
      1. Nom des compléments recommandés
      2. Dosage quotidien recommandé
      3. Moment optimal de prise dans la journée
      4. Bénéfices attendus spécifiques au profil
      5. Possibles interactions ou contre-indications
      
      Format ta réponse avec des sections claires et structurées en markdown.`;
      
    case 'flexibility':
      return `Tu es un expert en étirements et mobilité. 
      Ta mission est de créer un programme d'étirements personnalisé basé sur les niveaux de souplesse actuels de l'utilisateur.
      
      Pour chaque zone identifiée comme problématique:
      1. Suggérer 2-3 étirements spécifiques
      2. Détailler la technique correcte
      3. Recommander la durée et la fréquence
      4. Inclure des progressions possibles
      
      Format ta réponse avec des sections claires et structurées en markdown.`;
      
    default:
      return "Tu es un assistant utile qui répond de manière précise et pertinente aux questions de l'utilisateur.";
  }
}

function getMaxTokens(type: string): number {
  switch (type) {
    case 'nutrition':
      return 4000; // Plan nutritionnel détaillé sur 7 jours
    case 'supplements':
      return 1500; // Recommandations de compléments
    case 'flexibility':
      return 2000; // Programme d'étirements personnalisé
    default:
      return 1000;
  }
}
