# Firestore Security Specification

## 1. Data Invariants & Access Models
- **Apps Catalog (`/apps/{appId}`)**: Publicly readable so players can discover verified games, check bonus amounts, and access APK downloads. Write access requires valid schema shape.
- **Site Config (`/settings/{settingId}`)**: Publicly readable for site title, contact and social links.
- **Daily Claims (`/claims/{claimId}`)**: Anyone can create a daily streak claim record with valid payload constraint.
- **Promo Codes (`/promocodes/{promoId}`)**: Publicly readable for promo codes.
- **Test Connectivity (`/test/{docId}`)**: Publicly readable for connection verification.

## 2. Dirty Dozen Payloads Handled
1. Oversized document ID injection (>128 chars) -> Rejected via `isValidId()`.
2. Negative bonus numbers -> Rejected via type & boundary rules.
3. Missing required `name` or `downloadUrl` on app create -> Rejected.
4. Junk string overflow attack (>10000 chars) -> Blocked with string size checks.
5. Unauthorized schema field poisoning -> Blocked with validation helpers.
6. Timestamp manipulation -> Guarded.
