// pages/api/create-payment.ts
export default async function handler(req: any, res: any) {
  // Vérifie que la méthode est bien POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { activityId, quantity, currency, userId } = req.body;
    const backendUrl = "http://localhost:4000/activity/67d201c895dde471f6525780/payment"; // Ton backend Express
    const result = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, quantity, currency, userId }),
    });

    const data = await result.json();
    
    // Si tout est ok, renvoyer le clientSecret
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}