const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Cette fonction s'exécute automatiquement toutes les 24 heures
exports.autoDeleteOldMessages = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();
    const cutoffMs = 10 * 1000; // 45 jours en millisecondes
    const cutoffDate = new Date(now - cutoffMs);

    try {
      // Sélectionner les messages datant de plus de 45 jours
      const snapshot = await db
        .collection("community_chat")
        .where("createdAt", "<=", cutoffDate)
        .get();

      if (snapshot.empty) {
        console.log("Aucun message expiré à supprimer.");
        return null;
      }

      // Suppression par lots (Batch)
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Suppression effectuée : ${snapshot.size} message(s) effacé(s).`);
    } catch (error) {
      console.error("Erreur lors de la suppression automatique :", error);
    }
  });