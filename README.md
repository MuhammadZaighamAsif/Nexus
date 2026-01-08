# Nexus - Business Networking Platform

A modern, full-featured business networking platform built with React, TypeScript, and Tailwind CSS. Connect entrepreneurs with investors, manage meetings, handle payments, and streamline collaboration.

## 🚀 Live Demo

[View Live Application](https://nexus-apps.vercel.app/login)

## ✨ Features

### 🔐 Authentication & Security
- **User Authentication**: Secure login/signup for entrepreneurs and investors
- **Two-Factor Authentication**: Enhanced security with 2FA (bypass for demo accounts)
- **Role-Based Access**: Separate dashboards for entrepreneurs and investors
- **Password Recovery**: Forgot password functionality

### 📊 Dashboard & Analytics
- **Personalized Dashboards**: Role-specific dashboards with key metrics
- **Wallet Balance Display**: Real-time balance tracking on dashboards
- **Activity Tracking**: Recent activities and notifications
- **Profile Completion**: Progress indicators and profile management

### 💰 Payment System (Milestone 5)
- **Mock Payment UI**: Stripe/PayPal inspired payment interface
- **Transaction Management**:
  - Deposit funds with card simulation
  - Withdraw funds with bank account simulation
  - Transfer funds between users
  - Transaction history with full details
- **Funding Deals**: Investor-to-entrepreneur funding flow
- **Wallet Balance**: Real-time balance updates and tracking

### 📅 Calendar & Scheduling
- **FullCalendar Integration**: Professional calendar interface
- **Availability Management**: Add/modify availability slots
- **Meeting Requests**: Send and manage meeting invitations
- **Meeting Management**: Accept/decline and view confirmed meetings
- **Time Zone Support**: Proper date/time handling

### 💬 Communication
- **Real-time Messaging**: Direct communication between users
- **Chat Interface**: Modern chat UI with user lists
- **Message History**: Persistent conversation history
- **Online Status**: User presence indicators

### 🤝 Collaboration
- **Collaboration Requests**: Send partnership requests
- **Request Management**: Accept/decline incoming requests
- **Connection Tracking**: View and manage business connections
- **Profile Discovery**: Browse entrepreneur and investor profiles

### 📄 Document Management
- **Document Upload**: File upload with drag-and-drop
- **Document Chamber**: Secure document sharing
- **PDF Viewer**: Integrated PDF viewing capabilities
- **File Organization**: Document categorization and sharing

### 🎨 User Experience
- **Responsive Design**: Mobile-first design approach
- **Modern UI/UX**: Beautiful interface with Tailwind CSS
- **Toast Notifications**: Real-time feedback and alerts
- **Loading States**: Smooth loading animations and states

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Libraries & Tools
- **React Router DOM**: Client-side routing
- **React Hot Toast**: Notification system
- **FullCalendar**: Advanced calendar functionality
- **React PDF**: PDF viewing and manipulation
- **React Dropzone**: File upload interface
- **Date-fns**: Date manipulation utilities
- **Axios**: HTTP client for API calls

### Development & Deployment
- **ESLint**: Code linting and formatting
- **Vite**: Build tool and dev server
- **Vercel**: Deployment platform
- **PostCSS**: CSS processing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nexus.git
   cd nexus
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🚀 Deployment

### Vercel Deployment (Recommended)
This project is pre-configured for Vercel deployment:

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect the Vite configuration
   - Deploy automatically

3. **Environment Variables** (if needed):
   - Add any required environment variables in Vercel dashboard

### Manual Deployment
```bash
# Build the project
npm run build

# Serve the dist folder with any static server
# Example with serve:
npx serve dist
```

## 📁 Project Structure

```
Nexus/
├── public/
│   └── pdf.worker.min.mjs          # PDF.js worker
├── src/
│   ├── components/
│   │   ├── calendar/               # Calendar components
│   │   ├── chat/                   # Chat and messaging
│   │   ├── collaboration/          # Collaboration requests
│   │   ├── entrepreneur/           # Entrepreneur-specific components
│   │   ├── investor/               # Investor-specific components
│   │   ├── layout/                 # Layout components (Navbar, Sidebar)
│   │   ├── payments/               # Payment system components
│   │   │   ├── PaymentForm.tsx     # Stripe/PayPal style payment UI
│   │   │   ├── TransactionHistory.tsx # Transaction log
│   │   │   ├── WalletBalance.tsx   # Balance display
│   │   │   └── FundingDealCard.tsx # Funding deal management
│   │   └── ui/                     # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── data/
│   │   ├── users.ts                # Mock user data
│   │   ├── messages.ts             # Mock message data
│   │   ├── meetings.ts             # Mock meeting data
│   │   ├── collaborationRequests.ts # Mock collaboration data
│   │   └── payments.ts             # Mock payment data
│   ├── pages/
│   │   ├── auth/                   # Authentication pages
│   │   ├── dashboard/              # Dashboard pages
│   │   ├── payments/               # Payment pages
│   │   ├── profile/                # Profile pages
│   │   ├── investors/              # Investor discovery
│   │   ├── entrepreneurs/          # Entrepreneur discovery
│   │   ├── messages/               # Messaging pages
│   │   ├── documents/              # Document management
│   │   ├── settings/               # User settings
│   │   └── videoCall/              # Video calling
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # App entry point
│   └── vite-env.d.ts               # Vite type definitions
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App-specific TypeScript config
├── tsconfig.node.json              # Node-specific TypeScript config
├── eslint.config.js                # ESLint configuration
├── vercel.json                     # Vercel deployment config
└── README.md                       # This file
```

## 🎯 Usage Guide

### For New Users
1. **Sign Up**: Create an account as entrepreneur or investor
2. **Complete Profile**: Fill in business details and preferences
3. **Enable 2FA** (optional): Add extra security layer
4. **Explore Dashboard**: View personalized metrics and activities

### Demo Accounts
Use these accounts for testing (no 2FA required):
- **Entrepreneur**: `sarah@techwave.io` / `password123`
- **Investor**: `michael@vcinnovate.com` / `password123`

### Key Workflows

#### 💰 Payment Management
1. Navigate to **Payments** in the sidebar
2. View wallet balance on dashboard
3. Deposit/withdraw/transfer funds
4. Manage funding deals (investors)
5. View transaction history

#### 📅 Meeting Scheduling
1. Go to **Calendar** section
2. Add availability slots
3. Send meeting requests
4. Accept/decline invitations
5. Join scheduled meetings

#### 🤝 Collaboration
1. Browse **Investors** or **Entrepreneurs**
2. Send collaboration requests
3. Manage incoming requests
4. Connect and communicate

#### 💬 Communication
1. Use **Messages** for direct chat
2. View online status
3. Send files and documents
4. Access chat history

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint)

### Mock Data
The application uses mock data for development:
- User accounts and profiles
- Messages and conversations
- Meetings and calendar events
- Transactions and payments
- Documents and files

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Add proper error handling
- Test on multiple devices/browsers


## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MuhammadZaighamAsif/nexus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MuhammadZaighamAsif/nexus/discussions)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Vercel** for seamless deployment
- **Open source community** for inspiration and tools

---

**Built with ❤️ using modern web technologies.**

*Last updated: January 8, 2026*

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


## 📞 Contact

For questions or support, please open an issue on GitHub or 
contact via  [email](zaighamasif06@gmail.com) .

---

Built with ❤️ using modern web technologies.