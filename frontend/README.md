# weather-engine-maritime/frontend/README.md

# Weather Engine - Maritime Weather Intelligence

## Context

This project is a part of the MariTHON hackathon organized by Integrated Maritime Exchange (IME) & TBIGEU. Our goal is to develop a ship-aware weather integration system that provides real-time maritime weather alerts, predicts conditions up to 10 days, suggests optimal per-segment speed considering wind, waves, and current, and visualizes all of this on a compact web dashboard.

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- Optional: Mapbox token for enhanced map features

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-engine-maritime.git
   cd weather-engine-maritime/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` provided:
   ```
   cp .env.example .env
   ```

4. Set your Mapbox token in the `.env` file if you have one:
   ```
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token
   ```

### Running the Application

To start the frontend application in development mode, run:
```
npm start
```

This will start the application on `http://localhost:3000` by default.

### Using Mock Data

If you do not have access to the backend or want to use mock data, set the `USE_MOCK` environment variable to `1` in your `.env` file:
```
USE_MOCK=1
```

### Building for Production

To create a production build of the application, run:
```
npm run build
```

This will generate a `build` directory with the optimized production files.

## Features

- **Map Visualization**: Displays a route with markers and overlays for weather conditions.
- **Timeline Slider**: Allows users to select forecast times and view corresponding weather data.
- **Alerts Panel**: Shows real-time alerts based on weather conditions.
- **Speed Optimization**: Provides an "Optimize Speed" button that calculates and displays optimized speeds and fuel consumption.

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. For any questions or suggestions, please reach out to the team.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.