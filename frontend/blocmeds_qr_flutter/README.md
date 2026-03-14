
# BlocMeds QR: Secure Drug/Medicine Verification with Base DLT

BlocMeds QR is a Flutter-based mobile application designed to combat counterfeit pharmaceuticals by enabling users to verify drug authenticity through QR code scanning, powered by the Base Distributed Ledger Technology (DLT). With a modern interface, seamless API integration, and a gamified rewards system, BlocMeds QR ensures transparency in the pharmaceutical supply chain while incentivizing user participation.

I Made the mobile app version, because some people in my region dont like using webapp, some prefer mobile app, and also i want to add a feature soon, the one
where if user scan medicine qr code in an area with no access to internet, the app will save the details and once he's in a place with access to internet he'll se
results as notification in his phone.

## Key Features

- QR Code Scanning: Verify drug authenticity by scanning QR codes, retrieving critical details from a secure backend:
  - Batch ID
  - Drug Name
  - Expiry Date
  - Manufacturer
  - Token ID
- QR Code Generation: Create QR codes for drug batches to enable secure data sharing (admin access in production).
- Fake Drug Reporting: Report suspicious drugs to enhance supply chain integrity, with rewards for community contributions.
- Tokenized Incentives: Earn ETH tokens and achievements (e.g., "First Scan", "5 Day Streak") for verifying and reporting drugs.
- User Profiles: Track balance, scan history, reports, and trust score using Hive for persistent storage.
- Real-Time Verification: Integrates with a live API (https://blocmeds-backend-production.up.railway.app) for instant results.
- Modern UI: Material 3 design with light/dark themes and Lottie animations for a user-friendly experience.

## Technical Stack

- Framework: Flutter 3.x (Dart) with Material 3 design
- Blockchain: Base DLT for secure, tamper-proof verification
- Backend: REST API hosted on Railway
- Storage: Hive for local user data (balance, scans, achievements)
- Key Packages:
  - mobile_scanner: ^5.1.0 for QR scanning
  - qr_flutter: ^4.1.0 for QR generation
  - vibrate: ^0.1.0 for haptic feedback
  - flutter_spinkit: ^5.2.1 for loading animations
  - provider: ^6.1.2 for state management
  - http: ^1.2.2 for API calls
  - fluttertoast: ^8.2.2 for notifications
  - lottie: ^3.1.2 for animations
- Build Tools: Android Studio, Gradle (NDK 27.0.12077973, Java 11)

## Getting Started

### Prerequisites
- Flutter SDK: >=3.0.0 <4.0.0
- Development Environment: Android Studio or VS Code
- Device: Android device/emulator (API 34 recommended)
- Git: For cloning the repository

### Installation
1. Clone the Repository:
   ```bash
   git clone https://github.com/myusername/blocmeds_qr.git
   cd blocmeds_qr
   ```
2. Install Dependencies:
   ```bash
   flutter pub get
   ```
3. Set Up Assets:
   - Create the assets directory:
     ```bash
     mkdir assets/animations
     touch assets/animations/placeholder.txt
     ```
   - Optionally, add Lottie animations (success.json, error.json) from LottieFiles (https://lottiefiles.com).
4. Run the App:
   ```bash
   flutter run
   ```
   For a release APK:
   ```bash
   flutter build apk --release
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

### Configuration
- Android Permissions (android/app/src/main/AndroidManifest.xml):
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-feature android:name="android.hardware.camera" android:required="false" />
  ```
- Build Settings (android/app/build.gradle):
  ```gradle
  android {
      ndkVersion "27.0.12077973"
      compileOptions {
          sourceCompatibility JavaVersion.VERSION_11
          targetCompatibility JavaVersion.VERSION_11
      }
  }
  ```

## How It Works
1. Home Screen: Navigate using quick action buttons (Scan QR, Generate QR, Report Fake) or the bottom navigation bar.
2. Scan QR: Scan a drug’s QR code to verify authenticity via the Base-backed API. Valid codes (e.g., RX-2024-001A) display,like in example below:
   ```
   Verified Drug
   Batch ID: RX-2024-001A
   Drug Name: Paracetamol
   Expiry: 2026-12-31
   Manufacturer: PharmaCorp
   Token ID: TOKEN-12345
   ```
   Invalid codes trigger a "Fake Detected" alert with an option to report.
3. Generate QR: Input drug details to create QR codes for batch verification (admin feature).
4. Report Fake: Submit reports for suspicious drugs, earning 50 ETH and updating your trust score.
5. Rewards & Profile: View ETH balance, scan/report history, and achievements in the profile section.

## Testing the App
- Sample QR Code: Generate a QR code with RX-2024-001A using QR Code Generator (https://www.qr-code-generator.com).
- API Testing:
  ```bash
  curl https://blocmeds-backend-production.up.railway.app/api/drugs/verify/RX-2024-001A
  ```
- Emulator: Test on Pixel 6 (API 34) with camera enabled.
- Debugging: Run with verbose output:
  ```bash
  flutter run --verbose
  ```

## Real-World Impact
BlocMeds QR addresses the global issue of counterfeit drugs, which endanger millions of lives annually. By leveraging Base’s DLT, the app ensures immutable and transparent verification of drug authenticity, fostering trust in the pharmaceutical supply chain. The tokenized rewards system incentivizes user participation, creating a community-driven approach to healthcare safety.

## Future Enhancements
- Offline Verification: Cache API responses for offline functionality.
- Analytics Dashboard: Visualize user trust scores and scan trends.
- Global Accessibility: Implement multi-language support and localization.
- And Many More.

