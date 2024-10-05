# Dark Triad Assessments Web Application

This web application provides various assessments related to the Dark Triad and Dark Tetrad personality traits: Machiavellianism, Narcissism, Psychopathy, and Sadism. It includes multiple assessment types and visualizations of results.

## Features

- Multiple assessment types:
  - Short Dark Triad (SD3)
  - Short Dark Tetrad (SD4)
  - MACH-IV
  - Dirty Dozen
- Interactive user interface
- Visualization of results
- Responsive design

## Project Structure

```
dark-triad-assessments-webapp/
├── public/
│   ├── script.js
│   └── styles.css
├── views/
│   └── index.ejs
├── server.js
├── build.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/dark-triad-assessments-webapp.git
   ```

2. Navigate to the project directory:

   ```
   cd dark-triad-assessments-webapp
   ```

3. Install dependencies:

   ```
   npm install
   ```

## Development

To run the application in development mode:

```
npm start
```

This will start the Express server, and you can view the application at `http://localhost:3000`.

## Building for Production

To build the application for production:

```
npm run build
```

This will generate a static HTML file and copy all necessary assets to the `dist` folder.

## Deployment

To deploy the application to GitHub Pages:

1. Update the `homepage` field in `package.json` with your GitHub Pages URL:

   ```json
   "homepage": "https://your-username.github.io/dark-triad-assessments-webapp"
   ```

2. Run the deployment script:

   ```
   npm run deploy
   ```

This will build the app and push it to the `gh-pages` branch of your repository.

## Built With

- Express.js - Web application framework
- EJS - Templating engine
- Chart.js - Charting library for visualizations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Short Dark Triad (SD3)](https://openpsychometrics.org/tests/SD3/)
- [Short Dark Tetrad (SD4)](https://openpsychometrics.org/tests/SD4/)
- [MACH-IV](https://openpsychometrics.org/tests/MACH-IV/)
- [Dirty Dozen](https://openpsychometrics.org/tests/DD/)
