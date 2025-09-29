# Budget Management System

A modern web application for personal expense management and monthly budget tracking with professional financial dashboard.

## Features

- **Visual Overview** - Interactive charts showing expense distribution by category
- **Fixed Costs Management** - Set up monthly recurring expenses (rent, subscriptions, utilities)
- **Variable Expense Tracking** - Track daily expenses like groceries, entertainment, shopping
- **Personal Accounts** - Secure authentication via Firebase
- **Dark Mode Support** - Automatic dark/light theme switching
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices

## Quick Start

### Requirements
- Node.js (version 16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the project**
   ```bash
   git clone [repository-url]
   cd budget-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase keys
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The app is now available at `http://localhost:3000`

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: React Bootstrap 5
- **State Management**: React Hooks
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: CSS Custom Properties (CSS Variables)
- **Build Tool**: Create React App

## Usage

### First Time Setup
1. Register an account or sign in
2. Set up your fixed costs (rent, internet, subscriptions)
3. Add expenses as you spend money

### Dashboard
- **Overview**: See your total expenses broken down into fixed costs and variable expenses
- **Charts**: Visual representation of where your money goes by category
- **Categories**: Groceries, Housing, Entertainment, Transportation, Shopping, etc.

## Development

### Scripts
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject CRA configuration (not recommended)
```

### Project Structure
```
src/
  ├── components/          # React components
  │   ├── CategoryChart.tsx    # Chart component
  │   ├── ExpenseForm.tsx      # New expense form
  │   ├── ExpenseList.tsx      # Expense list display
  │   ├── FixedCostForm.tsx    # Fixed costs form
  │   ├── FixedCostList.tsx    # Fixed costs list
  │   └── Login.tsx            # Authentication component
  ├── firebase.ts          # Firebase configuration
  ├── types.ts             # TypeScript type definitions
  ├── App.tsx              # Main application component
  ├── App.css              # Application styling
  └── index.tsx            # Application entry point
```

## Styling

The app uses CSS Custom Properties for theming and supports automatic dark/light mode:

- **Light mode**: Light background with dark text
- **Dark mode**: Dark background with light text and improved contrast

## Security

- Environment variables for sensitive data (API keys)
- Firebase Authentication for user management
- Firestore security rules for data protection
- `.env` files excluded from version control

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the GitHub repository.

---

Built for better personal financial management and budget tracking.
