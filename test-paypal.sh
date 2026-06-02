#!/bin/bash
# Script de test des routes PayPal API
# Usage: bash test-paypal.sh

API_URL="http://localhost:3000"
CUSTOMER_NAME="Test Customer"
CUSTOMER_EMAIL="test@example.com"

echo "🧪 Testing PayPal API Routes"
echo "================================"
echo ""

# ==========================================
# 1️⃣ TEST: Créer une commande
# ==========================================
echo "1️⃣  Testing POST /api/paypal/create-order"
echo "---"

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/api/paypal/create-order" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "name": "Caravane Premium",
        "quantity": 1,
        "price": 1500
      }
    ],
    "totalAmount": 1500,
    "currency": "USD",
    "customerName": "'$CUSTOMER_NAME'",
    "customerEmail": "'$CUSTOMER_EMAIL'"
  }')

echo "Response:"
echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
echo ""

# Extrait l'ID PayPal
PAYPAL_ORDER_ID=$(echo "$CREATE_RESPONSE" | jq -r '.paypalOrderId' 2>/dev/null)

if [ -z "$PAYPAL_ORDER_ID" ] || [ "$PAYPAL_ORDER_ID" = "null" ]; then
  echo "❌ Failed to extract PayPal Order ID"
  echo "Make sure you have:"
  echo "  - NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local"
  echo "  - PAYPAL_CLIENT_SECRET in .env.local"
  exit 1
fi

echo "✅ PayPal Order ID: $PAYPAL_ORDER_ID"
echo ""
echo "🔗 PayPal Sandbox URL:"
echo "https://www.sandbox.paypal.com/checkoutnow?token=$PAYPAL_ORDER_ID"
echo ""
echo "Go to the URL above and approve the payment, then run:"
echo "bash test-paypal.sh $PAYPAL_ORDER_ID"
echo ""
