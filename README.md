# Pokemon App

A Next.js application for browsing Pokemon data using the PokeAPI.

## Features

-   Browse Pokemon list with pagination
-   View detailed Pokemon information
-   Responsive design
-   TypeScript support
-   Redux Toolkit for state management
-   Comprehensive test coverage

## Installation

1. Clone the repository

-   Using HTTPS

```bash
git clone https://github.com/HoussemBO04/pokimone.git
cd pokimone
```

-Using SSH

```bash
git clone git@github.com:HoussemBO04/pokimone.git
cd pokimone
```

2. Install dependencies

```bash
npm install
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` to view the detailed HTML report.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── PokemonList/     # Pokemon listing component
│   ├── PokemonDetails/  # Pokemon detail component
│   └── Pagination/      # Pagination component
└── lib/                 # Redux store and API setup
```

## Technologies Used

-   Next.js 15
-   React 19
-   TypeScript
-   Redux Toolkit
-   Jest & React Testing Library
-   Sass

## API

This project uses the [PokeAPI](https://pokeapi.co/) to fetch Pokemon data.

## License

This project is private and not licensed for public use.
