import supabase from './supabase.js';

async function saveScore(userId, username, maxScore) {
    const { data, error } = await supabase.from('scores').insert([
        { user_id: userId, pseudo: username, maxScore: maxScore },
    ]);
    return { data, error };
}

export { saveScore };
