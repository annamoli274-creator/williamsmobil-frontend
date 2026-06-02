Déploiement frontend (Next.js) — Instructions rapides

1) Créer un dépôt GitHub pour le frontend (ex: `williamsmobil-frontend`).
2) Dans Vercel, relier ce dépôt et définir :
   - Build Command: `npm run build`
   - Output Directory: `.next`

Variables d'environnement à ajouter (Vercel):
- BACKEND_URL=https://<YOUR_RAILWAY_DOMAIN>
- NEXT_PUBLIC_FRONTEND_URL=https://<YOUR_VERCEL_DOMAIN>
- PAYPAL_CLIENT_ID=...
- PAYPAL_CLIENT_SECRET=...
- PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
- WHATSAPP_PHONE_NUMBER_ID=...
- WHATSAPP_TOKEN=...
- WHATSAPP_RECIPIENT_NUMBER=...

Commandes Git pour pousser local -> GitHub (exécuter dans `frontend/`):

```bash
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
git push -u origin main
```

Tester local:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- Assure-toi que `NEXT_PUBLIC_FRONTEND_URL` correspond au domaine Vercel (ex: https://your-site.vercel.app)
- Configure `BACKEND_URL` en production vers l'URL Railway (https://xxx.railway.app)
