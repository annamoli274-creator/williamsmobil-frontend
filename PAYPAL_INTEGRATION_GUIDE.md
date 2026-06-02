# 🎯 GUIDE D'INTÉGRATION PAYPAL COMPLET

## 📋 TABLE DES MATIÈRES
1. [Configuration PayPal](#configuration-paypal)
2. [Architecture du système](#architecture-du-système)
3. [Intégration dans le checkout](#intégration-dans-le-checkout)
4. [Tester en local](#tester-en-local)
5. [Déployer en production](#déployer-en-production)
6. [Dépannage](#dépannage)

---

## 🔐 Configuration PayPal

### Étape 1: Créer un compte développeur
1. Va sur https://developer.paypal.com/
2. Crée ou connecte-toi à ton compte PayPal
3. Accède au Dashboard

### Étape 2: Créer une application
1. Va dans **Apps & Credentials**
2. Sélectionne **Sandbox** (pour les tests)
3. Clique sur **Create App** sous "REST API apps"
4. Donne un nom à ton app (ex: "Williams Mobil")

### Étape 3: Récupérer tes credentials
Tu verras deux sections:

**Sandbox:**
- **Client ID**: `ARu9...` (public, à exposer)
- **Secret**: `EG-...` (PRIVÉ, à garder secret)

**Production:**
- Récupère les mêmes infos mais en mode production quand tu es prêt

### Étape 4: Configurer .env.local

```bash
# Copie .env.local.example en .env.local
cp .env.local.example .env.local
```

Remplis les variables:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=ARu9...
PAYPAL_CLIENT_ID=ARu9...
PAYPAL_CLIENT_SECRET=EG-...
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com  # Pour tests
```

---

## 🏗️ Architecture du Système

```
Frontend (Next.js)
    ↓
1. Utilisateur clique "Pay with PayPal"
    ↓
2. /api/paypal/create-order
    ├─ Appelle PayPal API
    ├─ Crée une commande
    └─ Retourne l'ID PayPal
    ↓
3. Redirige vers PayPal Checkout
    ├─ Utilisateur se connecte
    ├─ Approuve le paiement
    └─ PayPal redirige vers notre callback
    ↓
4. /api/paypal/callback
    ├─ Reçoit l'approbation
    ├─ Appelle /api/paypal/capture-order
    └─ Capture le paiement
    ↓
5. /api/paypal/capture-order
    ├─ Vérifie le paiement PayPal
    ├─ Génère la facture PDF
    ├─ Envoie l'email de confirmation
    ├─ Optionnel: Sauvegarde dans Express backend
    └─ Redirection vers /checkout/success
```

### 📁 Fichiers Créés

```
frontend/
├── src/
│   ├── services/
│   │   ├── paypalService.ts        # API PayPal
│   │   ├── invoiceService.ts       # Génération PDF
│   │   └── emailService.ts         # Envoi emails
│   ├── types/
│   │   └── paypal.ts               # Types TypeScript
│   ├── components/
│   │   └── PayPalButton.tsx        # Bouton PayPal
│   ├── app/
│   │   ├── api/paypal/
│   │   │   ├── create-order/route.ts
│   │   │   ├── capture-order/route.ts
│   │   │   └── callback/route.ts
│   │   └── checkout/
│   │       └── success/page.tsx
│   └── ...
├── .env.local                       # Variables d'environnement
└── package.json
```

---

## 🛒 Intégration dans le Checkout

### Option 1: Remplacer complètement le checkout

Édite `src/app/checkout/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import PayPalButton from "@/components/PayPalButton";
import { OrderItem } from "@/types/paypal";

export default function CheckoutPage() {
  const [items, setItems] = useState<OrderItem[]>([
    {
      name: "Caravane Premium",
      quantity: 1,
      price: 1500,
      sku: "CARAVANE-001",
    },
  ]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const [customerName, setCustomerName] = useState("John Doe");
  const [customerEmail, setCustomerEmail] = useState("john@example.com");

  const handlePaymentSuccess = (orderId: string) => {
    console.log("✅ Payment successful:", orderId);
    // Tu peux faire une logique supplémentaire ici
  };

  const handlePaymentError = (error: string) => {
    console.error("❌ Payment error:", error);
    // Affiche une notification d'erreur
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Résumé de la commande */}
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="bg-gray-100 rounded p-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 font-bold">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire et paiement */}
        <div>
          <h2 className="text-xl font-bold mb-4">Billing Info</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full mb-6 p-2 border rounded"
          />

          <PayPalButton
            items={items}
            totalAmount={totalAmount}
            currency="USD"
            customerName={customerName}
            customerEmail={customerEmail}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
}
```

### Option 2: Ajouter PayPal aux paiements existants

Dans ton CheckoutPage existant, ajoute:

```tsx
import PayPalButton from "@/components/PayPalButton";

// Dans le rendu JSX:
{paymentMethod === "paypal" && (
  <PayPalButton
    items={items}
    totalAmount={totalAmount}
    currency="USD"
    customerName={customerName}
    customerEmail={customerEmail}
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
  />
)}
```

---

## 🧪 Tester en Local

### 1. Configurer les variables
Assure-toi que `.env.local` est rempli correctement:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=ton_client_id
PAYPAL_CLIENT_SECRET=ton_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

### 2. Configurer Email (Nodemailer)
Pour tester l'envoi d'email:

**Avec Gmail:**
1. Active la vérification 2FA sur ton compte Gmail
2. Va sur https://myaccount.google.com/apppasswords
3. Crée un mot de passe d'application
4. Ajoute à `.env.local`:
```
SMTP_USER=ton_email@gmail.com
SMTP_PASS=ton_mot_de_passe_app
```

**Avec Mailtrap (dev):**
```
SMTP_USER=ton_username
SMTP_PASS=ton_password
```

### 3. Lancer le dev server
```bash
cd frontend
npm run dev
```

### 4. Tester le flux complet
1. Va sur http://localhost:3000/checkout
2. Remplis le formulaire
3. Clique "Pay with PayPal"
4. Tu seras redirigé vers PayPal Sandbox

**Comptes Sandbox:**
- **Buyer**: sb-buyers@paypal.com / test1234
- **Seller**: sb-sellers@paypal.com / test1234

5. Approuve le paiement
6. Tu seras redirigé vers `/checkout/success`
7. Vérifie que l'email a été envoyé

---

## 🚀 Déployer en Production

### 1. Créer un compte PayPal Business
Si tu n'en as pas déjà un

### 2. Récupérer les credentials Production
1. PayPal Dashboard → Production mode
2. Copie le Client ID et Secret production

### 3. Configurer Vercel
Ajoute les variables d'environnement sur Vercel:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=ton_client_id_prod
PAYPAL_CLIENT_ID=ton_client_id_prod
PAYPAL_CLIENT_SECRET=ton_secret_prod
PAYPAL_BASE_URL=https://api-m.paypal.com
NEXT_PUBLIC_FRONTEND_URL=https://tondomaine.com
SMTP_USER=ton_email
SMTP_PASS=ton_mot_de_passe
```

### 4. Tester en production
Une fois déployé:
1. Va sur https://tondomaine.com/checkout
2. Effectue un vrai paiement de test ($0.01)
3. Vérifie que la facture est reçue par email

---

## 🐛 Dépannage

### ❌ "PayPal configuration missing"
- Vérifies que `NEXT_PUBLIC_PAYPAL_CLIENT_ID` est défini
- Relance `npm run dev` après avoir modifié `.env.local`

### ❌ "Failed to create PayPal order"
1. Vérifie que `PAYPAL_CLIENT_ID` et `PAYPAL_CLIENT_SECRET` sont corrects
2. Assure-toi que `PAYPAL_BASE_URL` pointe vers le bon endpoint
3. Regarde les logs du terminal Next.js

### ❌ "Email not sending"
1. Vérifie que `SMTP_USER` et `SMTP_PASS` sont corrects
2. Si tu utilises Gmail, vérifie que tu as créé un mot de passe d'application
3. Regarde les logs pour l'erreur exacte

### ❌ "PDF generation error"
- Assure-toi que PDFKit est installé: `npm install pdfkit`
- Vérifie que les données ne contiennent pas de caractères spéciaux problématiques

### ❌ Paiement "PENDING" au lieu de "COMPLETED"
- Le statut peut être "PROCESSING" ou "PENDING"
- Attends quelques secondes avant de vérifier
- Regarde les logs PayPal pour plus de détails

---

## 📊 Suivre les Paiements

### Logs PayPal Dashboard
1. Va sur PayPal Dashboard
2. **Transactions** → Voir tous les paiements
3. Clique sur une transaction pour les détails

### Logs Vercel
1. Vercel Dashboard → Ton projet
2. **Functions** → Vois les logs d'exécution
3. Cherche "✅ Payment captured" ou "❌" pour les erreurs

---

## 🔒 Sécurité

### Points importants:
- ✅ Ne jamais exposer `PAYPAL_CLIENT_SECRET`
- ✅ Valide toujours les montants côté serveur
- ✅ Utilise HTTPS en production
- ✅ Stocke les IDs PayPal pour les réclamations
- ✅ Implémente une logique d'idempotence (évite les doubles paiements)

---

## 💡 Améliorations Futures

1. **Intégration avec le backend Express**
   - Sauvegarde les commandes en DB
   - Stocke les transactions

2. **Système de remboursement**
   - Implémente les remboursements PayPal

3. **Webhooks PayPal**
   - Reçois les notifications en temps réel
   - Gère les cas edge (paiements perdus, etc.)

4. **Multi-devise**
   - Accepte plusieurs devises PayPal

5. **Paiements récurrents**
   - Abonnements mensuels/annuels

---

## 📚 Ressources

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal REST API Reference](https://developer.paypal.com/docs/api/orders/v2/)
- [Nodemailer Docs](https://nodemailer.com/)
- [PDFKit Docs](http://pdfkit.org/)

---

**Tout est prêt ! Commence par la configuration PayPal et le testing en local.** ✨
