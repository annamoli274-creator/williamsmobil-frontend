/**
 * Page: /checkout/success
 * Affiche la confirmation de paiement réussi
 */

import React, { Suspense } from "react";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
