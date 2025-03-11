
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./index.ts";

export async function handleBackgroundProcessing(
  requestId: string,
  type: string,
  generationPromise: Promise<string>,
  supabaseAdmin: ReturnType<typeof createClient>,
  userId?: string
): Promise<void> {
  // Créer ou mettre à jour l'entrée dans la table de contenus générés
  const { error: insertError } = await supabaseAdmin
    .from('generated_content')
    .upsert({
      request_id: requestId,
      content_type: type,
      status: 'processing',
      user_id: userId || null,
      updated_at: new Date().toISOString()
    }, { 
      onConflict: 'request_id' 
    });
  
  if (insertError) {
    console.error('Erreur lors de la création de l\'enregistrement initial:', insertError);
  }
  
  // Utiliser EdgeRuntime.waitUntil pour permettre à la fonction de continuer 
  // en arrière-plan même si la connexion est fermée
  EdgeRuntime.waitUntil((async () => {
    try {
      const generatedContent = await generationPromise;
      console.log(`Génération réussie pour requestId: ${requestId}`);
      
      // Améliorer le formatage des jours pour éviter le problème des deux "Jour 1"
      let processedContent = generatedContent;
      if (type === 'nutrition') {
        // Remplacer les titres génériques qui causent des problèmes
        processedContent = processedContent.replace(/# Plan Nutritionnel(.*?)(?=# Jour 1|\Z)/s, '');
        // S'assurer que les jours sont correctement formatés
        for (let i = 1; i <= 7; i++) {
          const dayRegex = new RegExp(`# Jour ${i}`, 'g');
          if (!processedContent.match(dayRegex)) {
            processedContent = processedContent.replace(
              /# Jour \d+(?![\s\S]*# Jour \d+)/,
              `# Jour ${i}`
            );
          }
        }
      }
      
      // Stocker le résultat dans la table de contenus générés
      if (supabaseAdmin) {
        const { error: updateError } = await supabaseAdmin
          .from('generated_content')
          .update({
            content: processedContent,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('request_id', requestId);
        
        if (updateError) {
          console.error('Erreur lors de la mise à jour du contenu généré:', updateError);
        }
        
        // Si un utilisateur est associé au contenu, sauvegarder également dans sa table personnelle
        if (userId && type === 'nutrition') {
          try {
            // Extraire les recettes et ingrédients
            const { data, error } = await supabaseAdmin
              .from('nutrition_plans')
              .insert({
                user_id: userId,
                content: processedContent,
                recipes: '[]', // Simplifié pour cet exemple, le client va parser
                ingredients: '[]' // Simplifié pour cet exemple, le client va parser
              });
              
            if (error) {
              console.error('Erreur lors de la sauvegarde du plan nutritionnel:', error);
            }
          } catch (err) {
            console.error('Exception lors de la sauvegarde du plan nutritionnel:', err);
          }
        }
      }
    } catch (error) {
      console.error(`Erreur en arrière-plan pour requestId: ${requestId}`, error);
      
      // Mettre à jour le statut en cas d'erreur
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('generated_content')
          .update({
            status: 'error',
            content: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('request_id', requestId);
      }
    }
  })());
}
