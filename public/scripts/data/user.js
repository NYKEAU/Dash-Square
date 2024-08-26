export const auth = {
    register: (pseudo, email, password) => fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ pseudo, email, password }),
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
    login: (identifier, password) => fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
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
    forgotPassword: (email) => fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
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
    logout: () => fetch("/api/logout", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) });
            }
            return res.json();
        }),
    getUser: () => fetch("/api/user", { credentials: 'include' })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) });
            }
            return res.json();
        }),
}

export const user = {
    auth
}