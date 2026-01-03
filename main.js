// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateToggleIcon(currentTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

// Update toggle icon based on theme
function updateToggleIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load saved progress from localStorage
function loadProgress() {
    document.querySelectorAll('.goal-item').forEach(goalItem => {
        const goalId = goalItem.getAttribute('data-goal');
        const savedProgress = localStorage.getItem(`goal-progress-${goalId}`);
        if (savedProgress !== null) {
            const progress = parseInt(savedProgress);
            updateProgress(goalItem, progress, false);
        }
    });
}

// Save progress to localStorage
function saveProgress(goalId, progress) {
    localStorage.setItem(`goal-progress-${goalId}`, progress.toString());
}

// Update progress display
function updateProgress(goalItem, progress, animate = true) {
    const barFill = goalItem.querySelector('.bar-fill');
    const progressValue = goalItem.querySelector('.progress-value');
    const goalId = goalItem.getAttribute('data-goal');
    
    // Clamp progress between 0 and 100
    progress = Math.max(0, Math.min(100, progress));
    
    // Update bar fill
    if (animate) {
        barFill.style.width = progress + '%';
    } else {
        barFill.style.width = progress + '%';
    }
    
    barFill.setAttribute('data-progress', progress);
    progressValue.textContent = progress;
    
    // Save to localStorage
    saveProgress(goalId, progress);
    
    // Update button states
    const decreaseBtn = goalItem.querySelector('.decrease-btn');
    const increaseBtn = goalItem.querySelector('.increase-btn');
    decreaseBtn.disabled = progress <= 0;
    increaseBtn.disabled = progress >= 100;
}

// Spoiler button functionality for goal charts
document.querySelectorAll('.spoiler-button').forEach(button => {
    button.addEventListener('click', function() {
        const goalItem = this.closest('.goal-item');
        const chartContainer = goalItem.querySelector('.chart-container');
        const isHidden = chartContainer.style.display === 'none';
        
        if (isHidden) {
            chartContainer.style.display = 'block';
            this.classList.add('active');
            this.textContent = '▲';
            
            // Animate the bar chart
            const barFill = chartContainer.querySelector('.bar-fill');
            const progress = parseInt(barFill.getAttribute('data-progress'));
            barFill.style.width = '0%';
            setTimeout(() => {
                updateProgress(goalItem, progress, true);
            }, 50);
        } else {
            chartContainer.style.display = 'none';
            this.classList.remove('active');
            this.textContent = '▼';
        }
    });
});

// Progress button functionality
document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', function() {
        const goalItem = this.closest('.goal-item');
        const barFill = goalItem.querySelector('.bar-fill');
        const currentProgress = parseInt(barFill.getAttribute('data-progress'));
        updateProgress(goalItem, currentProgress + 5, true);
    });
});

document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', function() {
        const goalItem = this.closest('.goal-item');
        const barFill = goalItem.querySelector('.bar-fill');
        const currentProgress = parseInt(barFill.getAttribute('data-progress'));
        updateProgress(goalItem, currentProgress - 5, true);
    });
});

// Initialize progress buttons state and load saved progress
document.querySelectorAll('.goal-item').forEach(goalItem => {
    const barFill = goalItem.querySelector('.bar-fill');
    const progress = parseInt(barFill.getAttribute('data-progress'));
    updateProgress(goalItem, progress, false);
});

// Load saved progress on page load
loadProgress();
