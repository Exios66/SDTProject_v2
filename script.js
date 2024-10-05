'use strict';

console.log('Script is running');

// ===== Module: Theme Management =====
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    const modules = [
        initializeDarkMode,
        initializeMenuToggle,
        initializeAssessments,
        initializeScientificArticles,
        initializeStroopTask,
        initializePsychometricCalculator,
        initializeBackgroundAndHistory
    ];

    modules.forEach(module => {
        try {
            module();
        } catch (error) {
            console.error(`Error initializing module: ${module.name}`, error);
        }
    });

    // Show the main content (assessments) immediately
    showMainContent();
}

function showMainContent() {
    const assessmentsSection = document.getElementById('assessments');
    if (assessmentsSection) {
        assessmentsSection.classList.remove('hidden');
    } else {
        console.error('Assessments section not found');
    }
}

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
        console.error('Dark mode toggle button not found');
        return;
    }
    darkModeToggle.addEventListener('click', toggleDarkMode);
    updateDarkModeToggle();
    
    // Check for user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        updateDarkModeToggle();
        updateChartColors();
    }
    
    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        updateDarkModeToggle();
        updateChartColors();
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateDarkModeToggle();
    updateStyles();
    updateChartColors();
    
    // Save user preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function updateDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
    darkModeToggle.style.color = document.body.classList.contains('dark-mode') ? '#ecf0f1' : '#333';
    
    // Update other UI elements
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#ecf0f1' : '#333';
    const backgroundColor = isDarkMode ? '#333' : '#ecf0f1';
    const accentColor = isDarkMode ? '#3498db' : '#2980b9';

    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);

    // Update specific elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.color = textColor;
        button.style.backgroundColor = accentColor;
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.color = textColor;
        input.style.backgroundColor = backgroundColor;
        input.style.borderColor = accentColor;
    });

    // Update chart colors if chart exists
    if (window.resultsChart) {
        updateChartColors(isDarkMode);
    }

    // Trigger a custom event for other parts of the application
    const event = new CustomEvent('themeChanged', { 
        detail: { 
            isDarkMode,
            textColor,
            backgroundColor,
            accentColor
        } 
    });
    document.dispatchEvent(event);

    // Log the theme change for debugging
    console.log(`Theme changed. Dark mode: ${isDarkMode}`);
}

function updateChartColors(isDarkMode) {
    if (!window.resultsChart) return;
    const textColor = isDarkMode ? '#ecf0f1' : '#333';
    const backgroundColor = isDarkMode ? '#333' : '#ecf0f1';

    window.resultsChart.options.scales.r.pointLabels.color = textColor;
    window.resultsChart.options.plugins.legend.labels.color = textColor;
    window.resultsChart.options.plugins.tooltip.backgroundColor = backgroundColor;
    window.resultsChart.options.plugins.tooltip.titleColor = textColor;
    window.resultsChart.options.plugins.tooltip.bodyColor = textColor;
    window.resultsChart.update();
}

// Function to apply saved dark mode preference
function applySavedDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        updateDarkModeToggle();
        updateChartColors(true);
    }
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', applySavedDarkModePreference);

// ===== Module: Menu Toggle =====
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (!menuToggle || !mainNav) {
        console.error('Required elements not found for menu toggle');
        return;
    }

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('show');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = mainNav.classList.contains('show');
        menuToggle.setAttribute('aria-expanded', isExpanded.toString());

        // Update menu toggle appearance
        updateMenuToggleAppearance(isExpanded);

        // Handle focus management
        if (isExpanded) {
            // Set focus to the first focusable element in the menu
            const firstFocusableElement = mainNav.querySelector('a, button, input, select, textarea');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        } else {
            // Return focus to menu toggle when closing
            menuToggle.focus();
        }

        // Announce menu state change for screen readers
        const menuStateAnnouncement = document.getElementById('menuStateAnnouncement');
        if (menuStateAnnouncement) {
            menuStateAnnouncement.textContent = isExpanded ? 'Menu opened' : 'Menu closed';
        } else {
            console.warn('Menu state announcement element not found');
        }
        
        // Update menu toggle icon or text if needed
        updateMenuToggleAppearance(isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !mainNav.contains(event.target)) {
            mainNav.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            updateMenuToggleAppearance(false);
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav.classList.contains('show')) {
            mainNav.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            updateMenuToggleAppearance(false);
            menuToggle.focus(); // Return focus to menu toggle
        }
    });

    // Initialize menu state
    const initialState = mainNav.classList.contains('show');
    menuToggle.setAttribute('aria-expanded', initialState.toString());
    updateMenuToggleAppearance(initialState);

    // Ensure the menu is properly hidden on page load if not expanded
    if (!initialState) {
        mainNav.style.display = 'none';
    }

    // Add resize event listener to handle menu visibility on window resize
    window.addEventListener('resize', () => {
        const isExpanded = mainNav.classList.contains('show');
        if (window.innerWidth > 768 && !isExpanded) { // Adjust breakpoint as needed
            mainNav.style.display = ''; // Reset to default display
        } else if (window.innerWidth <= 768 && !isExpanded) {
            mainNav.style.display = 'none';
        }
    });

    // Initialize focus trap for accessibility
    const focusableElements = mainNav.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    mainNav.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    });

    console.log('Menu toggle initialized');
}

function updateMenuToggleAppearance(isExpanded) {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        // Update icon or text based on menu state
        menuToggle.innerHTML = isExpanded ? '✕' : '☰';
        menuToggle.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    }
}

// ===== Module: Assessments =====
const assessments = {
    sdt3: [
        { question: "It's not wise to tell your secrets.", trait: "Machiavellianism" },
        // Add more SDT3 questions here
    ],
    dirtyDozen: [
        // Add Dirty Dozen questions here
    ],
    sdt4: [
        // Add SDT4 questions here
    ],
    machIV: [
        // Add MACH IV questions here
    ],
    mmpi: [
        // Add MMPI-style questions here
    ],
    hexaco: [
        // Add HEXACO questions here
    ],
    ocean: [
        // Add OCEAN questions here
    ]
};

let currentAssessment = '';
let currentQuestionIndex = 0;
let answers = {};
let autoAdvanceTimer;

function initializeAssessments() {
    const assessmentButtons = document.querySelectorAll('.assessment button');
    assessmentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const assessmentType = e.target.closest('.assessment').id;
            startAssessment(assessmentType);
        });
    });
}

function startAssessment(assessment) {
    if (!assessments[assessment]) {
        console.error(`Invalid assessment type: ${assessment}`);
        return;
    }

    currentAssessment = assessment;
    currentQuestionIndex = 0;
    answers = {};
    
    const elementsToToggle = ['assessments', 'assessmentQuestions', 'progressBarContainer'];
    elementsToToggle.forEach(toggleElementVisibility);

    showQuestion();
}

function toggleElementVisibility(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.toggle('hidden');
    } else {
        console.warn(`Element with id '${id}' not found`);
    }
}

function showQuestion() {
    const questionContainer = document.getElementById('assessmentQuestions');
    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }

    const currentAssessmentQuestions = assessments[currentAssessment];
    if (!currentAssessmentQuestions || currentQuestionIndex >= currentAssessmentQuestions.length) {
        console.error('Invalid question index or assessment');
        return;
    }

    const question = currentAssessmentQuestions[currentQuestionIndex];
    const totalQuestions = currentAssessmentQuestions.length;

    questionContainer.innerHTML = generateQuestionHTML(question, currentQuestionIndex, totalQuestions);

    updateProgressBar();
    startAutoAdvance();
}

function generateQuestionHTML(question, index, total) {
    return `
        <div class="question">
            <h3>Question ${index + 1} of ${total}</h3>
            <p>${question.question}</p>
            <div class="options">
                ${generateOptionsHTML()}
            </div>
        </div>
        <button onclick="submitAnswer()">Next</button>
        <div id="autoAdvanceTimer"></div>
    `;
}

function generateOptionsHTML() {
    return [1, 2, 3, 4, 5].map(value => `
        <label>
            <input type="radio" name="answer" value="${value}" onchange="resetAutoAdvance()">
            ${value} - ${getScaleLabel(value)}
        </label>
    `).join('');
}

function getScaleLabel(value) {
    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    return labels[value - 1] || 'Unknown';
}

function startAutoAdvance() {
    let timeLeft = 4;
    const timerDisplay = document.getElementById('autoAdvanceTimer');
    if (!timerDisplay) {
        console.error('Timer display element not found');
        return;
    }

    updateTimerDisplay(timerDisplay, timeLeft);

    autoAdvanceTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            updateTimerDisplay(timerDisplay, timeLeft);
        } else {
            clearInterval(autoAdvanceTimer);
            submitAnswer();
        }
    }, 1000);
}

function updateTimerDisplay(timerDisplay, timeLeft) {
    timerDisplay.textContent = `Auto-advancing in ${timeLeft} seconds...`;
}

function resetAutoAdvance() {
    clearInterval(autoAdvanceTimer);
    startAutoAdvance();
}

function submitAnswer() {
    clearInterval(autoAdvanceTimer);
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        processAnswer(selectedAnswer.value);
        advanceQuestion();
    } else {
        alert('Please select an answer before proceeding.');
        startAutoAdvance();
    }
}

function processAnswer(value) {
    const question = assessments[currentAssessment][currentQuestionIndex];
    const score = parseInt(value, 10);
    answers[question.trait] = (answers[question.trait] || 0) + (question.reversed ? 6 - score : score);
}

function advanceQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < assessments[currentAssessment].length) {
        showQuestion();
    } else {
        showResults();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    const progress = ((currentQuestionIndex + 1) / assessments[currentAssessment].length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

// ===== Module: Results Handling =====
function showResults() {
    toggleElementVisibility('assessmentQuestions');
    toggleElementVisibility('progressBarContainer');
    toggleElementVisibility('results');
    toggleElementVisibility('resultsChart');

    const traits = Object.keys(answers);
    const scores = traits.map(trait => {
        const maxScore = assessments[currentAssessment].filter(q => q.trait === trait).length * 5;
        return (answers[trait] / maxScore) * 100;
    });

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <h2>Your Results</h2>
        ${traits.map((trait, index) => `
            <p>${trait}: ${scores[index].toFixed(2)}% 
            <span class="trait-explanation" title="${getTraitExplanation(trait)}">ℹ</span></p>
        `).join('')}
        <button onclick="resetAssessment()">Take Another Assessment</button>
        <button onclick="exportResults()">Export Results</button>
        <button onclick="showInterpretation()">Show Detailed Interpretation</button>
    `;

    createChart(traits, scores);
}

function getTraitExplanation(trait) {
    const explanations = {
        'Machiavellianism': 'Tendency to manipulate and exploit others for personal gain.',
        'Narcissism': 'Excessive self-love, grandiosity, and need for admiration.',
        'Psychopathy': 'Lack of empathy, impulsivity, and antisocial behavior.',
        'Sadism': 'Deriving pleasure from inflicting pain or humiliation on others.',
        // Add explanations for other traits here
    };
    return explanations[trait] || 'No explanation available.';
}

function createChart(traits, scores) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#ecf0f1' : '#333';

    if (window.resultsChart) {
        window.resultsChart.destroy();
    }

    window.resultsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: traits,
            datasets: [{
                label: 'Scores',
                data: scores,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        color: textColor,
                        font: {
                            family: 'Lato, sans-serif'
                        }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Lato, sans-serif'
                        }
                    }
                }
            }
        }
    });
}

function resetAssessment() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('resultsChart').classList.add('hidden');
    document.getElementById('assessments').classList.remove('hidden');
    currentAssessment = '';
    currentQuestionIndex = 0;
    answers = {};
}

// ===== Module: Interpretation Modal =====
function showInterpretation() {
    const interpretationModal = document.getElementById('interpretationModal');
    const interpretationContent = document.getElementById('interpretationContent');
    
    let content = '<h3>Interpretation of Your Results</h3>';
    Object.keys(answers).forEach(trait => {
        const score = (answers[trait] / (assessments[currentAssessment].filter(q => q.trait === trait).length * 5)) * 100;
        content += `<h4>${trait}</h4>`;
        content += `<p>Your score: ${score.toFixed(2)}%</p>`;
        content += `<p>${getDetailedInterpretation(trait, score)}</p>`;
    });
    
    interpretationContent.innerHTML = content;
    interpretationModal.style.display = 'block';
}

function getDetailedInterpretation(trait, score) {
    const interpretations = {
        'Machiavellianism': {
            low: 'You tend to be straightforward in your interactions and may prefer direct approaches in dealing with others.',
            medium: 'You show a balance between strategic thinking and straightforward approaches in your interactions.',
            high: 'You tend to be strategic and calculating in your approach to social interactions and may be skilled at manipulating situations to your advantage.'
        },
        // Add interpretations for other traits here
    };

    if (score < 33) {
        return interpretations[trait].low;
    } else if (score < 66) {
        return interpretations[trait].medium;
    } else {
        return interpretations[trait].high;
    }
}

function closeInterpretationModal() {
    document.getElementById('interpretationModal').style.display = 'none';
}

// ===== Module: Scientific Articles =====
function initializeScientificArticles() {
    const showArticlesButton = document.getElementById('showScientificArticles');
    showArticlesButton.addEventListener('click', showScientificArticles);
}

function showScientificArticles() {
    const modal = document.getElementById('articlesModal');
    const articlesList = document.getElementById('articlesList');
    articlesList.innerHTML = '';

    const articles = [
        { title: "The Dark Triad of personality: A 10 year review", authors: "Furnham, A., Richards, S. C., & Paulhus, D. L.", year: 2013, journal: "Social and Personality Psychology Compass", doi: "10.1111/spc3.12018" },
        { title: "The Short Dark Triad (SD3): A Brief Measure of Dark Personality Traits", authors: "Jones, D. N., & Paulhus, D. L.", year: 2014, journal: "Assessment", doi: "10.1177/1073191113514105" },
        // Add more articles here
    ];

    articles.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${article.title}</strong><br>
                        ${article.authors} (${article.year})<br>
                        ${article.journal}<br>
                        DOI: <a href="https://doi.org/${article.doi}" target="_blank">${article.doi}</a>`;
        articlesList.appendChild(li);
    });

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('articlesModal').style.display = 'none';
}

// ===== Module: Stroop Task =====
function initializeStroopTask() {
    const startButton = document.querySelector('#stroopTask button');
    if (!startButton) {
        console.error('Stroop task start button not found');
        return;
    }
    startButton.addEventListener('click', startStroopTask);
}

function startStroopTask() {
    const stroopInstructions = document.getElementById('stroopInstructions');
    const stroopGame = document.getElementById('stroopGame');
    if (!stroopInstructions || !stroopGame) {
        console.error('Required Stroop task elements not found');
        return;
    }
    stroopInstructions.classList.add('hidden');
    stroopGame.classList.remove('hidden');

    const colors = ['red', 'blue', 'green', 'yellow'];
    const words = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    let currentRound = 0;
    let correctAnswers = 0;
    let totalTime = 0;
    let startTime;

    function nextRound() {
        if (currentRound >= 10) {
            endStroopTask();
            return;
        }

        const wordElement = document.getElementById('stroopWord');
        const colorIndex = Math.floor(Math.random() * colors.length);
        const wordIndex = Math.floor(Math.random() * words.length);

        wordElement.textContent = words[wordIndex];
        wordElement.style.color = colors[colorIndex];

        const buttonsContainer = document.getElementById('stroopButtons');
        buttonsContainer.innerHTML = '';
        colors.forEach(color => {
            const button = document.createElement('button');
            button.textContent = color.toUpperCase();
            button.style.backgroundColor = color;
            button.addEventListener('click', () => checkAnswer(color));
            buttonsContainer.appendChild(button);
        });

        startTime = performance.now();
    }

    function checkAnswer(selectedColor) {
        const endTime = performance.now();
        const reactionTime = endTime - startTime;
        totalTime += reactionTime;

        if (selectedColor === document.getElementById('stroopWord').style.color) {
            correctAnswers++;
        }

        currentRound++;
        updateProgress();
        nextRound();
    }

    function updateProgress() {
        const progressElement = document.getElementById('stroopProgress');
        if (progressElement) {
            progressElement.style.width = `${(currentRound / 10) * 100}%`;
        }
    }

    function endStroopTask() {
        const stroopGame = document.getElementById('stroopGame');
        const stroopResults = document.getElementById('stroopResults');
        if (!stroopGame || !stroopResults) {
            console.error('Required Stroop task result elements not found');
            return;
        }
        stroopGame.classList.add('hidden');
        stroopResults.classList.remove('hidden');

        const accuracyElement = document.getElementById('stroopAccuracy');
        const avgTimeElement = document.getElementById('stroopAvgTime');

        if (accuracyElement && avgTimeElement) {
            const accuracy = (correctAnswers / 10) * 100;
            const avgTime = totalTime / 10;
            accuracyElement.textContent = `${accuracy.toFixed(2)}%`;
            avgTimeElement.textContent = `${avgTime.toFixed(2)}ms`;
        }

        // Add more detailed analysis here
        const analysisElement = document.createElement('div');
        analysisElement.innerHTML = `
            <h4>Detailed Analysis:</h4>
            <p>Total correct answers: ${correctAnswers} out of 10</p>
            <p>Average reaction time: ${(totalTime / 10).toFixed(2)}ms</p>
            <p>Interpretation: ${interpretStroopResults(correctAnswers, totalTime / 10)}</p>
        `;
        stroopResults.appendChild(analysisElement);

        // Calculate and display percentile ranks
        const accuracyPercentile = calculatePercentile(accuracy, 50, 15); // Assuming normal distribution
        const speedPercentile = calculatePercentile(avgTime, 1000, 200, true); // Assuming lower is better
        
        const percentileElement = document.createElement('div');
        percentileElement.innerHTML = `
            <h4>Percentile Ranks:</h4>
            <p>Accuracy: ${accuracyPercentile.toFixed(2)}th percentile</p>
            <p>Speed: ${speedPercentile.toFixed(2)}th percentile</p>
        `;
        stroopResults.appendChild(percentileElement);
    }

    function interpretStroopResults(correctAnswers, avgTime) {
        let interpretation = "";
        if (correctAnswers >= 9) {
            interpretation += "Excellent accuracy. ";
        } else if (correctAnswers >= 7) {
            interpretation += "Good accuracy. ";
        } else {
            interpretation += "Room for improvement in accuracy. ";
        }

        if (avgTime < 800) {
            interpretation += "Very fast response time. ";
        } else if (avgTime < 1200) {
            interpretation += "Average response time. ";
        } else {
            interpretation += "Response time could be improved. ";
        }

        interpretation += "The Stroop effect demonstrates the interference in the reaction time of a task. ";
        interpretation += "A longer response time typically indicates a stronger interference effect. ";
        interpretation += "This test can provide insights into cognitive flexibility and executive function.";

        return interpretation;
    }

    function calculatePercentile(score, mean, stdDev, lowerIsBetter = false) {
        const zScore = (score - mean) / stdDev;
        const percentile = (1 - math.erf(zScore / Math.sqrt(2))) / 2;
        return lowerIsBetter ? percentile * 100 : (1 - percentile) * 100;
    }

    nextRound();
}

function resetStroopTask() {
    const stroopInstructions = document.getElementById('stroopInstructions');
    const stroopResults = document.getElementById('stroopResults');
    const stroopGame = document.getElementById('stroopGame');
    if (!stroopInstructions || !stroopResults || !stroopGame) {
        console.error('Required Stroop task elements not found for reset');
        return;
    }
    stroopResults.classList.add('hidden');
    stroopGame.classList.add('hidden');
    stroopInstructions.classList.remove('hidden');

    // Reset progress bar
    const progressElement = document.getElementById('stroopProgress');
    if (progressElement) {
        progressElement.style.width = '0%';
    }

    // Clear any previous results
    while (stroopResults.firstChild) {
        stroopResults.removeChild(stroopResults.firstChild);
    }

    // Reset global variables
    currentRound = 0;
    correctAnswers = 0;
    totalTime = 0;
}

// ===== Module: Psychometric Calculator =====
function initializePsychometricCalculator() {
    const calculatorSection = document.getElementById('psychometric');
    if (!calculatorSection) {
        console.error('Psychometric calculator section not found');
        return;
    }
    calculatorSection.innerHTML = `
        <h2>Psychometric Calculator</h2>
        <div>
            <label for="rawScore">Raw Score:</label>
            <input type="number" id="rawScore" min="0" max="100">
        </div>
        <div>
            <label for="mean">Population Mean:</label>
            <input type="number" id="mean" value="50">
        </div>
        <div>
            <label for="stdDev">Standard Deviation:</label>
            <input type="number" id="stdDev" value="10">
        </div>
        <button onclick="calculateZScore()">Calculate Z-Score</button>
        <div id="zScoreResult"></div>
        <div id="percentileResult"></div>
    `;
}

function calculateZScore() {
    const rawScore = parseFloat(document.getElementById('rawScore').value);
    const mean = parseFloat(document.getElementById('mean').value);
    const stdDev = parseFloat(document.getElementById('stdDev').value);

    if (isNaN(rawScore) || isNaN(mean) || isNaN(stdDev)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    if (stdDev <= 0) {
        alert('Standard deviation must be a positive number.');
        return;
    }

    const zScore = (rawScore - mean) / stdDev;
    const resultElement = document.getElementById('zScoreResult');
    const percentileElement = document.getElementById('percentileResult');
    const interpretationElement = document.getElementById('interpretationResult');
    
    if (resultElement && percentileElement && interpretationElement) {
        resultElement.textContent = `Z-Score: ${zScore.toFixed(2)}`;
        
        const { percentile, interpretation } = calculatePercentile(zScore);
        
        if (percentile !== null) {
            percentileElement.textContent = `Percentile: ${percentile}`;
            interpretationElement.textContent = `Interpretation: ${interpretation}`;
        } else {
            percentileElement.textContent = 'Error in percentile calculation';
            interpretationElement.textContent = interpretation;
        }

        // Additional contextualization
        let additionalContext = '';
        if (zScore > 3 || zScore < -3) {
            additionalContext = 'This score is considered extreme and may warrant further investigation.';
        } else if (zScore > 2 || zScore < -2) {
            additionalContext = 'This score is notably different from the average.';
        } else if (zScore > 1 || zScore < -1) {
            additionalContext = 'This score is moderately different from the average.';
        } else {
            additionalContext = 'This score is close to the average.';
        }

        const contextElement = document.createElement('p');
        contextElement.textContent = additionalContext;
        interpretationElement.appendChild(contextElement);
    } else {
        console.error('One or more result elements not found');
    }
}

function calculatePercentile(zScore) {
    try {
        const cdf = 0.5 * (1 + math.erf(zScore / Math.sqrt(2)));
        const percentile = cdf * 100;

        if (percentile < 0 || percentile > 100) {
            throw new Error('Calculated percentile is out of range');
        }

        let interpretation;
        if (percentile < 2.5) {
            interpretation = "Extremely low (bottom 2.5%)";
        } else if (percentile < 16) {
            interpretation = "Low (bottom 16%)";
        } else if (percentile < 84) {
            interpretation = "Average (middle 68%)";
        } else if (percentile < 97.5) {
            interpretation = "High (top 16%)";
        } else {
            interpretation = "Extremely high (top 2.5%)";
        }

        return {
            percentile: percentile.toFixed(2),
            interpretation: interpretation
        };
    } catch (error) {
        console.error('Error in percentile calculation:', error);
        return {
            percentile: null,
            interpretation: 'Error in calculation. Please check your inputs.'
        };
    }
}

// ===== Module: Background and History =====
function initializeBackgroundAndHistory() {
    const backgroundSection = document.getElementById('background');
    if (!backgroundSection) {
        console.error('Background section not found');
        return;
    }
    backgroundSection.innerHTML = `
        <h2>Background & History of Dark Triad Research</h2>
        <p>The Dark Triad is a group of three personality traits: Narcissism, Machiavellianism, and Psychopathy. These traits are called "dark" because of their malevolent qualities.</p>
        <h3>Timeline:</h3>
        <ul>
            <li><strong>1970s:</strong> Research on individual dark personality traits begins</li>
            <li><strong>2002:</strong> Paulhus and Williams coin the term "Dark Triad"</li>
            <li><strong>2010s:</strong> Development of various Dark Triad measurement tools</li>
            <li><strong>Present:</strong> Ongoing research into the impact of Dark Triad traits in various contexts</li>
        </ul>
        <button onclick="toggleMoreHistory()">Show More</button>
        <div id="moreHistory" class="hidden">
            <p>Additional historical information and research milestones...</p>
            <h4>Key Researchers:</h4>
            <ul>
                <li>Delroy L. Paulhus</li>
                <li>Kevin M. Williams</li>
                <li>Daniel N. Jones</li>
                <li>Robert D. Hare (Psychopathy research)</li>
            </ul>
            <h4>Important Studies:</h4>
            <ul>
                <li>Paulhus, D. L., & Williams, K. M. (2002). The Dark Triad of personality: Narcissism, Machiavellianism, and psychopathy.</li>
                <li>Jones, D. N., & Paulhus, D. L. (2014). Introducing the Short Dark Triad (SD3): A brief measure of dark personality traits.</li>
            </ul>
        </div>
    `;
}

function toggleMoreHistory() {
    const moreHistory = document.getElementById('moreHistory');
    const button = moreHistory.previousElementSibling;
    if (moreHistory && button) {
        moreHistory.classList.toggle('hidden');
        button.textContent = moreHistory.classList.contains('hidden') ? 'Show More' : 'Show Less';
    }
}

function updateStyles() {
    const root = document.documentElement;
    const isDarkMode = document.body.classList.contains('dark-mode');

    root.style.setProperty('--primary-color', isDarkMode ? '#2980b9' : '#3498db');
    root.style.setProperty('--secondary-color', isDarkMode ? '#27ae60' : '#2ecc71');
    root.style.setProperty('--background-color', isDarkMode ? '#2c3e50' : '#f4f4f4');
    root.style.setProperty('--text-color', isDarkMode ? '#ecf0f1' : '#333');
}

function initializeModules() {
    initializeAssessments();
    initializeStroopTask();
    initializePsychometricCalculator();
    initializeBackgroundAndHistory();
}

