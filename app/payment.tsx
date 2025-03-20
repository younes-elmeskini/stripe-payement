'use client'
import { useState } from "react";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialisation de Stripe avec ta clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "18px",
      color: "#333",
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "12px 16px",
    },
    invalid: {
      color: "#e5424d",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Appel API pour créer PaymentIntent
    const res = await fetch("http://localhost:4000/activity/67d201c895dde471f6525780/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityId: "67d201c895dde471f6525780",
        quantity: 5,
        currency: "usd",
        userId: "67b7184e12b6bc512a645525",
      }),
    });

    const data = await res.json();
    const clientSecret = data.clientSecret;

    // Confirmer le paiement avec le client secret
    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement)!,
      },
    });

    if (result?.error) {
      setMessage(result.error.message || "Erreur");
    } else if (result?.paymentIntent?.status === "succeeded") {
      setMessage("✅ Paiement réussi !");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <label style={{ display: "block", marginBottom: "12px" }}>
        Carte bancaire
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "12px",
            marginTop: "8px",
            background: "#fff",
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: "16px",
          padding: "12px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Paiement en cours..." : "Payer"}
      </button>

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}
    </form>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;