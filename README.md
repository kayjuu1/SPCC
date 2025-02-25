# SPCC Church Database System

## Overview
The **SPCC Church Database System** is a simple and efficient church management system designed to help administrators track member information, manage dues, and keep records of church activities. The system is built with **React (Vite), TypeScript, Tailwind CSS, and ShadcnUI**, with **Supabase** as the backend for database operations.

## Features

### User Side
- No login required.
- Search for members by full or partial name (autocomplete and phonetic matching supported).
- View **only** unpaid dues and total outstanding amount.
- Read-only access; users **cannot** update details.

### Admin Side
- Register new members.
- Update member details.
- Record monthly dues and mark payments.
- Track previous months' dues.
- Mark a user as **deceased** or **left the church**.
- System logs all admin actions for accountability.
- Export admin action logs as **CSV**.

### Member Details Stored
- **ID (optional)**
- **Personal Details:** Name, Date of Birth
- **Membership Info:** Annual Dues Card (if applicable), Baptism & Confirmation status (with dates)
- **Contact Info:** Phone, Address
- **Church Details:** Dependents, Member’s Society, Member’s Role
- **Status:** `Active | Inactive | Dead | Not a Member`
- **Financial Status:** Has the member defaulted? (`true/false`)

## Tech Stack
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS + ShadcnUI
- **Backend:** Supabase (PostgreSQL)

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/kayjuu1/SPCC
   cd spcc-database
2. **Install dependencies:**
    ```sh
   npm install
3. **Set up environment variables: Create a .env file and add your Supabase credentials:**
   ```sh
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4. **Run the development server:**
   ```sh
   npm run dev
## Usage
- **Admin Panel:** Accessible to admins for managing members and dues.
- **User Search:** Search for members and check unpaid dues.
- **Add Member:** Click **"Add Member"** to open a form and register new members.

## Contribution
1. **Fork** the repository.
2. **Create a new branch:**
   ```sh
   git checkout -b feature-name
   git commit -m "Added new feature"
   git push origin feature-name

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- **ShadcnUI** for the design and component library.
- **Supabase** for the backend and database.

Made with ❤️ for St. Paul Catholic Church Community
