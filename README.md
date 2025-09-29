# Budget App

Een moderne web-applicatie voor het beheren van persoonlijke uitgaven en het krijgen van inzicht in je maandelijkse kosten.

## Features

- **Visueel overzicht** - Interactieve grafieken van je uitgaven per categorie
- **Vaste kosten beheer** - Stel je maandelijkse vaste kosten in (huur, abonnementen, etc.)
- **Variabele uitgaven tracking** - Houd bij wat je uitgeeft aan boodschappen, uitgaan, etc.
- **Persoonlijke accounts** - Veilige login via Firebase Authentication
- **Dark mode support** - Automatische dark/light mode ondersteuning
- **Responsive design** - Werkt perfect op desktop, tablet en mobiel

## Quick Start

### Vereisten
- Node.js (versie 16 of hoger)
- npm of yarn
- Firebase account

### Installatie

1. **Clone het project**
   ```bash
   git clone [repository-url]
   cd budget-app
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variables**
   - Kopieer `.env.example` naar `.env`
   - Vul je Firebase configuratie in:
   ```bash
   cp .env.example .env
   # Edit .env met je Firebase keys
   ```

4. **Start de development server**
   ```bash
   npm start
   ```

De app is nu beschikbaar op `http://localhost:3000`

## Tech Stack

- **Frontend**: React 19 met TypeScript
- **UI Framework**: React Bootstrap 5
- **State Management**: React Hooks
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Chart.js met react-chartjs-2
- **Styling**: CSS Custom Properties (CSS Variables)
- **Build Tool**: Create React App

## Gebruik

### Eerste keer
1. Registreer een account of log in
2. Stel je vaste kosten in (huur, internet, abonnementen)
3. Voeg je uitgaven toe wanneer je iets uitgeeft

### Dashboard
- **Overzicht**: Zie je totale uitgaven opgedeeld in vaste kosten en variabele uitgaven
- **Grafiek**: Visuele weergave van waar je geld naartoe gaat per categorie
- **Categorieën**: Boodschappen, Huur, Vrije tijd, Mobiliteit, Shopping, etc.

## Development

### Scripts
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build voor productie
npm run eject      # Eject CRA configuratie (niet aanbevolen)
```

### Project Structuur
```
src/
  ├── components/          # React componenten
  │   ├── CategoryChart.tsx    # Grafiek component
  │   ├── ExpenseForm.tsx      # Formulier nieuwe uitgaven
  │   ├── ExpenseList.tsx      # Lijst van uitgaven
  │   ├── FixedCostForm.tsx    # Formulier vaste kosten
  │   ├── FixedCostList.tsx    # Lijst vaste kosten
  │   └── Login.tsx            # Login/registratie
  ├── firebase.ts          # Firebase configuratie
  ├── types.ts             # TypeScript type definities
  ├── App.tsx              # Hoofd component
  ├── App.css              # Styling
  └── index.tsx            # Entry point
```

## Styling

De app gebruikt CSS Custom Properties voor theming en ondersteunt automatisch dark/light mode:

- **Light mode**: Lichte achtergrond, donkere tekst
- **Dark mode**: Donkere achtergrond, lichte tekst met verbeterd contrast

## Security

- Environment variables voor gevoelige gegevens (API keys)
- Firebase Authentication voor gebruikersbeheer
- Firestore security rules voor data bescherming
- `.env` bestanden uitgesloten van version control

## Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/amazing-feature`)
3. Commit je wijzigingen (`git commit -m 'Add amazing feature'`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request

## License

Dit project is gelicenseerd onder de MIT License.

## Support

Bij vragen of problemen, open een issue in de GitHub repository.

---

Gemaakt voor beter persoonlijk financieel overzicht.
