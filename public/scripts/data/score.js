export const board = {
    getScores: () => fetch("/api/scores", {
        credentials: 'include',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) });
        }
        return res.json();
    }),
    setScore: (bestscore) => fetch("/api/score", {
        method: 'PUT',
        body: JSON.stringify({ bestscore }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }).then(res => res.json()),
}

export const score = {
    board
}