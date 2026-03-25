export const board = {
  getScores: () =>
    fetch("/api/scores", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
      },
    }).then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
      return res.json();
    }),

  setScore: (bestscore) => {
    const token = localStorage.getItem("firebaseToken");
    console.log(
      "Attempting to update score with token:",
      token ? "Present" : "Missing"
    );

    if (!token) {
      console.error(
        "No Firebase token found. User might not be authenticated."
      );
      return Promise.reject(new Error("User not authenticated"));
    }

    return fetch("/api/score", {
      method: "PUT",
      body: JSON.stringify({ score: bestscore }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Server response error:", errorData);
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Erreur mise à jour score:", error);
        throw error;
      });
  },
};

export const score = {
  board,
};
