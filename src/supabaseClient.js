import { createClient } from '../node_modules/@supabase/supabase-js/dist/module/index.js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour connecter l'utilisateur
async function signIn(email, password) {
    try {
        const { user, session, error } = await supabase.auth.signIn({
            email,
            password
        });
        if (error) {
            throw error;
        }
        console.log('Utilisateur connecté:', user);
        console.log('Session:', session);
    } catch (error) {
        console.error('Erreur lors de la connexion:', error.message);
    }
}

// Fonction pour inscrire un nouvel utilisateur
async function signUp(email, password) {
    try {
        const { user, session, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            throw error;
        }
        console.log('Utilisateur inscrit:', user);
        console.log('Session:', session);
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error.message);
    }
}

document.getElementById('connexionButton').addEventListener('click', () => {
    const pseudo = document.getElementById('pseudoIn').value;
    const password = document.getElementById('passwordIn').value;
    signIn(pseudo, password);
});

document.getElementById('inscriptionButton').addEventListener('click', () => {
    const pseudo = document.getElementById('pseudoUp').value;
    const password = document.getElementById('passwordUp').value;
    signUp(pseudo, password);
});