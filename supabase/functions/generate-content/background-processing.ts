
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./index.ts";

export async function handleBackgroundProcessing(
  requestId: string,
  type: string,
  generationPromise: Promise<string>,
  supabaseAdmin: ReturnType<typeof createClient>,
  userId?: string
): Promise<void> {
  // Log pour déboguer
  console.log(`Démarrage du traitement en arrière-plan pour requestId: ${requestId}, userId: ${userId || 'Non fourni'}`);
  
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
      console.log(`Génération réussie pour requestId: ${requestId}, userId: ${userId || 'Non fourni'}`);
      
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
            console.log(`Sauvegarde du plan nutritionnel pour l'utilisateur: ${userId}`);
            
            // Vérifier si un plan existe déjà avec ce requestId
            const { data: existingPlans, error: checkError } = await supabaseAdmin
              .from('nutrition_plans')
              .select('id')
              .eq('user_id', userId)
              .eq('request_id', requestId);
              
            if (checkError) {
              console.error('Erreur lors de la vérification des plans existants:', checkError);
            }
            
            // Si un plan avec ce requestId existe déjà, le mettre à jour
            if (existingPlans && existingPlans.length > 0) {
              const { error: updatePlanError } = await supabaseAdmin
                .from('nutrition_plans')
                .update({
                  content: processedContent,
                  recipes: '[]', // Simplifié pour cet exemple, le client va parser
                  ingredients: '[]', // Simplifié pour cet exemple, le client va parser
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('request_id', requestId);
                
              if (updatePlanError) {
                console.error('Erreur lors de la mise à jour du plan nutritionnel:', updatePlanError);
              } else {
                console.log(`Plan nutritionnel mis à jour pour l'utilisateur ${userId}`);
              }
            } else {
              // Sinon, insérer un nouveau plan
              const { error: insertPlanError } = await supabaseAdmin
                .from('nutrition_plans')
                .insert({
                  user_id: userId,
                  content: processedContent,
                  recipes: '[]', // Simplifié pour cet exemple, le client va parser
                  ingredients: '[]', // Simplifié pour cet exemple, le client va parser
                  request_id: requestId // Ajout du requestId pour pouvoir le retrouver plus tard
                });
                
              if (insertPlanError) {
                console.error('Erreur lors de la sauvegarde du plan nutritionnel:', insertPlanError);
              } else {
                console.log(`Nouveau plan nutritionnel créé pour l'utilisateur ${userId}`);
              }
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
