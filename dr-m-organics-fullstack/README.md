# Dr M Organics — Full Stack MERN Website

A working full-stack e-commerce website for **Dr M Organics** with customer shop, cart, checkout, order emails, newsletter, contact form, and admin product/order management.

## Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Email: Nodemailer
- Deployment: GitHub + Render + MongoDB Atlas

---

## 1. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@drmorganics.com
ADMIN_PASSWORD=admin12345
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_NOTIFY_EMAIL=your_business_email@gmail.com
```

Seed products and admin:

```bash
npm run seed
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 2. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

Fill `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 3. Admin Login

Use the admin values from your backend `.env` after running seed:

```text
Email: ADMIN_EMAIL
Password: ADMIN_PASSWORD
```

Admin pages:

```text
/admin/login
/admin/dashboard
/admin/products
/admin/orders
```

---

## 4. Render Deployment

### Backend on Render

Create a **Web Service**:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Add environment variables from `server/.env.example`.

Set:

```env
CLIENT_URL=https://your-vercel-or-render-frontend-url.com
```

### Frontend on Render or Vercel

- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Set:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## 5. Email Notes

For Gmail, use an App Password, not your normal Gmail password.

If email variables are missing, orders still save in MongoDB, but emails are skipped.

---

## API Routes

### Auth

- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin
- `PUT /api/products/:id` admin
- `DELETE /api/products/:id` admin

### Orders

- `POST /api/orders`
- `GET /api/orders` admin
- `GET /api/orders/:id` admin
- `PUT /api/orders/:id/status` admin

### Contact

- `POST /api/contact`

### Newsletter

- `POST /api/newsletter`
