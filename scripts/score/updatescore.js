import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { Firestore, getDoc, getDocs, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

export async function updateScore(player) {
    try {
        const auth = getAuth(firebaseApp);
        const currentUser = auth.currentUser;
        console.log('Auth :', auth);
        console.log('currentUser :', currentUser);

        if (!currentUser) {
            throw new Error("Aucun utilisateur connecté");
        }

        const currentUid = currentUser.uid;
        console.log('currentUid :', currentUid);

        // Recherche du document avec l'UID correspondant à l'utilisateur connecté
        const querySnapshot = await getDocs(collection(db, "users"));
        let documentRef;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.uid === currentUid) {
                documentRef = doc.ref;
            }
        });

        if (!documentRef) {
            throw new Error('Document non trouvé pour l\'utilisateur actuel.');
        }

        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
            console.log("Document data:", documentSnapshot.data());
            const userData = documentSnapshot.data();
            const oldScore = userData.bestscore;
            const newScore = player.score;

            if (newScore > oldScore) {
                await updateDoc(documentRef, { bestscore: newScore });
                console.log('Score mis à jour avec succès');
            } else {
                console.log('Nouveau score inférieur ou égal à l\'ancien score');
            }
        } else {
            console.log("No document found for the current user.");
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour du score :", error);
    }
}
