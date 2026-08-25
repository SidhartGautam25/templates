# Setup & Quickstart Guide: Real Estate Website Template

This template provides a modern real estate property listing website complete with an admin panel and property management. Follow these steps to initialize and run the project on your local machine.

---

## 1. Configure Environment Variables

Create your local `.env` file from the provided example:
```bash
cp .env.example .env
```

Open `.env` in your editor and configure the following variables:
* **`DATABASE_URL`**: Your MySQL or MariaDB connection string (e.g. `mysql://user:pass@localhost:3306/db_name`).
* **`AUTH_SECRET`**: A random secret key for session encryption. Generate one with:
  ```bash
  npx auth secret
  ```
* **`ADMIN_USER`** & **`ADMIN_PASSWORD`**: Credentials you want to use to log into the `/admin` dashboard.
* **`FTP_HOST`**, **`FTP_USER`**, **`FTP_PASSWORD`**: Connection details for the FTP server where uploaded property listings/images will be stored (optional/falls back to local filesystem if not set).
* **`LEADRAT_API_KEY`**: Your LeadRat CRM key for ingesting lead forms (optional).

---

## 2. Install Dependencies

We recommend using **pnpm**, but you can use **npm** or **yarn**:
```bash
# If using pnpm (recommended)
pnpm install

# If using npm
npm install
```
*Note: Installing dependencies automatically triggers the `postinstall` hook to generate your local Prisma Client.*

---

## 3. Setup the Database

Apply the Prisma schema to your database:

```bash
# Push schema to database
npx prisma db push
```

---

## 4. Run the Development Server

Start Next.js in development mode:
```bash
# If using pnpm
pnpm dev

# If using npm
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the site, and visit **[http://localhost:3000/admin](http://localhost:3000/admin)** to manage listings, configurations, and view customer enquiries.
