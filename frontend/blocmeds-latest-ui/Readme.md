
**Live Demo:** [https://blocmedsnew.vercel.app](https://blocmedsnew.vercel.app)

The **BlocMeds QR Scanner App** brings transparency and empowerment directly to users. Designed as a Progressive Web App (PWA), it allows users to **scan**, **verify**, **report**, and **earn rewards** — all within an elegant, mobile-first interface. Built with **React**, **TypeScript**, and **Vite**, it integrates seamlessly with the **BlocMeds Admin V2** backend and **Base-powered APIs** for live verification and immutable tracking.

---

##  Mission

**"To give every user the power to verify the authenticity of medicines in real-time, reducing counterfeit exposure and increasing public trust through Base-backed transparency."**

---

## Key Features

###  **UI/UX Excellence**

* Animated splash screen with QR pulse logo and loading progress.
* 4-step onboarding flow for first-time users (includes username setup).
* **Bottom navigation bar** for easy navigation (Home, Scan, Generate, Report, Profile).
* Dark mode with system preference detection.
* Glassmorphic, futuristic design with **blurred backgrounds** and **rounded edges**.
* Smooth motion effects — fade-ins, scaling transitions, and glowing highlights.
* Fully responsive for mobile and tablet users.

---

###  **Progressive Web App (PWA)**

* Fully installable on **iOS and Android** devices.
* Offline-first structure with cached assets.
* PWA manifest and service worker configured for smooth user experience.

---

###  **Home Dashboard**

* Displays **ETH balance** with animated pulse.
* Shows **Trust Score**, **Rank badge** (Bronze/Silver/Gold), and **recent activity feed**.
* **Leaderboard snippet** for top 5 users globally.
* Quick action buttons: *Scan, Generate, Report, View Rewards*.

---

###  **QR Scanning System**

* Real-time scanning powered by **Html5Qrcode**.
* Connects directly to the **BlocMeds backend API (Railway)** for live verification.
* Displays detailed scan results:

  * Drug name
  * Batch ID
  * Expiry date
  * Manufacturer
  * Token ID
* Result states: **Verified**, **Fake**, or **Invalid**.
* Users earn:

  * +10 ETH for verified scans
  * +50 ETH for fake drug reports
* Confetti and **Text-to-Speech voice feedback** enhance engagement.
* Tracks **total scans** and **scan streaks** automatically.

---

###  **QR Generation**

* Generate QR codes from valid batch IDs.
* **Download QR** as PNG or **share** via Web Share API.
* Displays a **history gallery** of the last five generated codes with thumbnails.

---

###  **Fake Drug Reporting**

* Report counterfeit drugs using batch ID and description.
* Upload supporting images with preview.
* **Voice-to-Text input** for easier reporting.
* +50 ETH reward per valid report.
* Report history with status tracking (Pending, Reviewed, Resolved).

---

###  **Profile & Rewards**

* Displays user avatar, username, rank badge (animated medal).
* **Stats Grid:** Trust Score, Total Scans, Reports, Streaks.
* Full transaction timeline of ETH earnings and usage.
* **Achievements System:** unlock badges for milestones.
* **Referral System:** generate and share your referral QR.
* Settings include:

  * Notifications toggle
  * Dark mode switch

---

###  **Data Management**

* Fully **LocalStorage-based persistence** for user stats and activity.
* Tracks:

  * Scan history
  * Reports
  * Streaks
  * Generated QR codes
  * Transactions
* **Trust Score Formula:**

  ```
  Trust Score = (Scans + Reports × 2) / 10
  ```
* **Ranking System:**

  * Bronze: < 5
  * Silver: 5–10
  * Gold: > 10

---

###  **Gamification Layer**

* Earn ETH tokens for active participation.
* Climb ranks through verified scans and reports.
* Maintain streaks for daily scanning.
* Compete on leaderboards.
* Unlock achievement badges for milestones.

---

##  Tech Stack

| Layer                | Technology                            | Purpose                    |
| -------------------- | ------------------------------------- | -------------------------- |
| **Frontend**         | React, TypeScript, Vite, Tailwind CSS | Core UI/UX                 |
| **UI Components**    | shadcn/ui                             | Modular interface elements |
| **QR Engine**        | Html5Qrcode                           | Live camera scanning       |
| **State Management** | LocalStorage                          | Offline data persistence   |
| **API Integration**  | REST (Node.js/Express backend)        | Drug verification          |
| **PWA Tools**        | Vite Plugin PWA, Service Worker       | Installability and caching |
| **Animations**       | Framer Motion, CSS Transitions        | Smooth effects             |
| **Speech & Audio**   | Web Speech API, Text-to-Speech        | Voice feedback             |

---

## Integration Note

>  **Important:**
> If you want to use the scanner app after uploading a medicine through **BlocMeds Admin V2**, ensure the API endpoint reads from the **`drug_batches`** collection instead of the **`drug`** collection.

This ensures that the verification data displayed to the user matches the immutable batch records stored on Base and Firebase.

---

##  Future Enhancements

* **Decentralized Identity (DID)** for verified user profiles.
* **AI-based fraud pattern alerts** integrated into user analytics.

---

##  Related Links

* **Admin V2 (Regulator Dashboard):** [https://blocmedsadmnew.netlify.app](https://blocmedsadmnew.netlify.app)
* **User App (New UI):** [https://blocmedsnew.vercel.app](https://blocmedsnew.vercel.app)
* **Base Consensus Topic Logs:** [View Logs on HashScan](https://hashscan.io/testnet/topic/0.0.6825354)
* **Pitch Deck:** [BlocMeds Pitch Deck](https://drive.google.com/file/d/1-X2itzViID5xqROR5f_LRDWW4qhdLl2C/view?usp=sharing)
* **Certificate:** [View Certificate](https://drive.google.com/file/d/1DNiF-e7p94Zows00-w_X-YJdMNURQHAu/view?usp=sharing)

---
