import supabase from './supabase.js';

async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { user, error };
}

async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({
        email,
        password,
    });
    return { user, error };
}

async function signOut() {
    await supabase.auth.signOut();
}

export { signUp, signIn, signOut };
