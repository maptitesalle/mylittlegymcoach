
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateContent } from "./content-generator.ts";
import { getSystemPrompt, getMaxTokens } from "./prompt-manager.ts";
import { handleBackgroundProcessing } from "./background-processing.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, previousRecipes = [], requestId, userId } = await req.json();
    
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
    
    // Initialiser le client Supabase (uniquement si l'URL et la clé de service sont disponibles)
    const supabaseAdmin = supabaseUrl && supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey)
      : null;
    
    // Si requestId est fourni, vérifier si on a déjà un résultat pour cette requête
    if (requestId && supabaseAdmin) {
      const { data: existingContent, error: fetchError } = await supabaseAdmin
        .from('generated_content')
        .select('content, status')
        .eq('request_id', requestId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Erreur lors de la vérification du contenu existant:', fetchError);
      } else if (existingContent && existingContent.status === 'completed') {
        console.log(`Contenu déjà généré pour requestId: ${requestId}`);
        return new Response(JSON.stringify({ 
          content: existingContent.content 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Démarrer la génération dans une tâche d'arrière-plan
    const generationPromise = generateContent(modifiedPrompt, type, openAIApiKey, getSystemPrompt, getMaxTokens);
    
    // Si nous avons un requestId, nous pouvons gérer cela comme une tâche d'arrière-plan
    if (requestId && supabaseAdmin) {
      // Créer ou mettre à jour l'entrée dans la table de contenus générés
      await handleBackgroundProcessing(requestId, type, generationPromise, supabaseAdmin, userId);
      
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
