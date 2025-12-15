# MemoryLane 🕰️

MemoryLane is a web application that lets users create digital time capsules containing letters and images, which unlocks at a chosen future date. Capsules remain sealed until their unlock time, allowing users to preserve memories and revisit them later.

---

## ✨ Features

- User registration with secure password hashing
- Create time capsules with title and unlock date
- Group capsules under meaningful themes (e.g., Childhood, Family, Friends, Milestones)
- Write letters and store personal memories
- Upload and display images inside capsules
- Add collaborators to a capsule and allow them to contribute memories
- Capsules stay locked until the unlock time
- Automatic unlocking based on date & time
- Human-readable countdown for locked capsules
- Separate views for unlocked and upcoming capsules
- Share capsules with selected recipients
- Delete capsules owned by the creator
- Fully responsive, mobile-friendly UI

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend**
- Next.js API Routes
- Prisma ORM

**Database**
- PostgreSQL

**Authentication**
- Custom authentication (API-based)
- Password hashing using `bcryptjs`

---

## 🔐 Authentication Details

- Users are stored in a `User` table via Prisma
- Passwords are hashed using `bcryptjs`
- Authentication is handled through custom API routes
- No third-party auth providers are used

## Test Credentials 
 - Email           | Password |
 - test1@gmail.com | test123  |
 - test2@gmail.com | test234  |
 - test3@gmail.com | test345  |

 ## Deployed Link
-  https://memory-lane-h0mk838f6-neha-kumaris-projects-68c9fc76.vercel.app/login

## ⚙️ Installation & Setup

 **1️. Clone the repository**
- git clone https://github.com/Neha-Kumari2311/MemoryLane.git
- cd MemoryLane

**2️. Install dependencies**
- npm install

**3. Environment Variables**
- This project requires the following environment variables to run locally.
- Create a `.env` file in the root directory and add:
- DATABASE_URL=postgresql://username:password@localhost:5432/memorylane
 
**4. Setup Prisma & Database**
- npx prisma migrate dev
- npx prisma generate

**5️. Run the development server**
- npm run dev

## 📸 Screenshots
- available at ./screenshots


## 🔮 Future Enhancements

- Suggest captions, create summaries, or transcribe old audio files using Gemini.

- Public and private capsule visibility options  

- Allow family members to react, comment, or add reflection to newly unlocked capsules.
  



