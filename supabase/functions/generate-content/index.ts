
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
    const { prompt, type, previousRecipes = [] } = await req.json();
    
    // Modify the prompt to exclude previous recipes if they exist
    let modifiedPrompt = prompt;
    if (type === 'nutrition' && previousRecipes.length > 0) {
      modifiedPrompt += `\n\nImportant: Ne pas proposer à nouveau les recettes suivantes qui ont déjà été suggérées:\n${previousRecipes.join('\n')}`;
    }

    console.log(`Generating ${type} content with GPT-4o-mini...`);
    
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
            content: modifiedPrompt 
          }
        ],
        max_tokens: getMaxTokens(type),
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

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
