# 🍕 PizzaHub — Full-Stack Multi-Vendor Pizza Ordering Platform

![PizzaHub Banner](/public/assets/logo-icon.png)

A modern, full-stack multi-vendor pizza ordering web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Express.js**, **MongoDB**, **Better Auth**, and **Stripe**. 

PizzaHub connects passionate pizza kitchens and cloud restaurants with hungry diners through a seamless, responsive, and secure digital dining experience.

---

## 🌟 Key Features

### 🛒 1. Customer Experience
- **Explore Full Menu (`/menu`):** Browse delicious pizzas with dynamic category filtering (*Classic Pizzas, Vegetarian Pizzas, Meat Lovers, Gourmet Pizzas, Sides & Appetizers, Beverages & Desserts*).
- **Interactive Product Details (`/menu/[id]`):** Customize crust types (Thin, Pan, Stuffed), pizza sizes (Personal, Regular, Large), and add extra toppings with real-time price calculation.
- **Cart & Seamless Ordering:** Add customized items to cart, select delivery address, and place cash or card orders.
- **Customer Dashboard (`/profile`, `/orders`):** View past and active order status, update delivery profile, and change avatar photo.
- **Become a Vendor Onboarding (`/partnership`):** Customers or chefs can submit their restaurant details to instantly upgrade their account to a verified vendor.

### 🏪 2. Vendor Portal (`/vendor/dashboard`)
- **Restaurant Profile & Branding:** Manage shop name, bio, logo, and primary delivery city (*Dhaka, Chattogram, Rajshahi, Sylhet*).
- **Menu Item Management:** Add and update menu items with up to 5 ImageBB photo uploads, crust options, and category classification.
- **Plan Enforcement:** Free tier vendors can publish up to 3 active menu items.
- **Premium Subscription Upgrade:** Integrated with **Stripe Checkout** (৳499 BDT) for unlimited menu items, verified badges, and priority admin reviews.
- **Order Management:** Real-time customer order notifications with one-click Accept/Reject and preparation status updates.

### 🛡️ 3. Admin Control Panel (`/admin/dashboard`)
- **Financial Overview & Metrics:** Real-time metrics for Total Revenue, This Month's Revenue, This Year's Revenue, Paid Vendors, and Completed Transactions.
- **Transaction History & CSV Export (`/admin/transactions`):** Audit all Stripe subscription transactions with receipt IDs, vendor emails, amounts, status badges, Stripe session IDs, and one-click **Export CSV** reporting.
- **Menu Approval Queue:** Review vendor-submitted items, inspect ingredient photos and pricing, and approve or reject them before they appear on the public menu.
- **User Management & Moderation:** View all registered accounts (*Customer, Vendor, Admin*) with one-click **Block / Unblock** capabilities that immediately revoke access on the server.

### 🔐 4. Authentication, Security & RBAC
- **Better Auth + MongoDB:** Secure session management via HTTP-only cookies and MongoDB database adapter.
- **Role-Based Access Control (RBAC):** Server-side route protection guards (`proxyAdminGuard`, `proxyVendorGuard`, `proxyCustomerGuard`) preventing unauthorized cross-dashboard visits.
- **Google OAuth & Email/Password:** One-click Google sign-in defaulting new users to the customer role, plus email/password authentication.
- **Server-Side Block Enforcement:** Instant block detection queries MongoDB in real-time so blocked users cannot perform any actions.
- **Dual Auth on Express API:** Express backend verifies both Better Auth session cookies and JWT Bearer tokens (`/api/jwt`).

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org) + [React 19](https://react.dev) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Lucide React](https://lucide.dev) |
| **Animation & UX** | [Framer Motion](https://www.framer.com/motion) |
| **Authentication** | [Better Auth](https://www.better-auth.com), Google OAuth, JWT |
| **Backend API** | [Node.js](https://nodejs.org) + [Express.js](https://expressjs.com) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with native Node.js driver |
| **Payments** | [Stripe Checkout & Webhooks](https://stripe.com) |
| **Language & Tooling** | TypeScript (Frontend) & JavaScript (Backend) |

---

## 📁 Repository Structure

```text
pizzahub/
├── src/
│   ├── app/
│   │   ├── (admin-dashboard)/       # Admin dashboard & management routes
│   │   │   ├── admin/menu/          # Menu item review & approval
│   │   │   ├── admin/transactions/  # Payments & Revenue overview + CSV export
│   │   │   └── admin/users/         # User moderation & account blocking
│   │   ├── (auth)/                  # Sign In & Sign Up flows
│   │   ├── (customer-dashboard)/    # Customer profile & orders
│   │   ├── (vendor-dashboard)/      # Vendor menu, orders, & subscription
│   │   ├── api/                     # Next.js API route handlers
│   │   ├── auth/redirect/           # Post-login role-based smart redirect
│   │   ├── menu/                    # Explore full menu & product details
│   │   ├── partnership/             # Become a vendor partner registration
│   │   └── page.tsx                 # Homepage with featured items
│   ├── components/                  # Reusable UI components & shadcn widgets
│   ├── lib/                         # MongoDB client, Auth, Session, Stripe helpers
│   └── types/                       # Shared TypeScript interfaces & types
└── pizzahub-server/                 # Express.js REST API Server
    ├── index.js                     # Express entry point (Port 5000)
    └── src/
        ├── config/db.js             # MongoDB Atlas connection & collections
        ├── controllers/             # API business logic
        ├── middlewares/auth.js      # Session & JWT token verification
        └── routes/                  # Express API route modules
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v20.x or higher
- **npm** or **pnpm**
- A **MongoDB Atlas** database cluster
- A **Stripe** account (for test payments & webhooks)

---

### 2. Environment Variables

#### Frontend (`pizzahub/.env`)
```env
# MongoDB Connection
MONGODB_BETTER_AUTH_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pizzahub?retryWrites=true&w=majority

# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Express API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe Credentials
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Backend Server (`pizzahub-server/.env`)
```env
PORT=5000
MONGODB_BETTER_AUTH_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pizzahub?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=pizzahub_jwt_secret_token_batch14_secure_key_2026
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 3. Installation & Local Development

#### Step A: Run the Frontend (Next.js)
```bash
# In the root repository directory (pizzahub)
npm install
npm run dev
```
The frontend will start at **http://localhost:3000**.

#### Step B: Run the Backend (Express)
```bash
# In a separate terminal, navigate to the server folder
cd pizzahub-server
npm install
npm run dev
```
The Express API will start at **http://localhost:5000**.

---

## 💳 Testing Stripe Webhooks Locally

To test real-time payment confirmations and subscription upgrades in local development:
```bash
# Forward Stripe webhooks to your local Express server
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```
Copy the webhook signing secret output by Stripe CLI into your server's `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 🛡️ User Roles & Access Control

| Role | Default Landing | Allowed Capabilities |
|---|---|---|
| **Customer** | `/` (Home) | Browse menus, customize pizzas, place orders, track delivery, apply as partner. |
| **Vendor** | `/vendor/dashboard` | Manage menu items, accept/reject customer orders, upgrade to Premium plan. |
| **Admin** | `/admin/dashboard` | Platform revenue stats, approve/reject menu items, block/unblock users, CSV exports. |

---

## 📄 License
This project is licensed under the **ISC License**.
