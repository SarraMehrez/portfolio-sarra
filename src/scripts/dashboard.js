/**
 * Dashboard Controller
 * Main application logic for the Incident Command Portfolio
 */

// Global state
const AppState = {
    feedData: null,
    chaosMode: false,
    activeIncident: null,
    commandPaletteActive: false,
};

/**
 * Initialize the application
 */
async function init() {
    console.log('🚀 Initializing Incident Command Portfolio...');

    try {
        // Load feed data
        await loadFeedData();

        // Initialize components
        initializeHeader();
        initializeHeroStats();
        initializeDashboard();
        initializeCommandPalette();
        initializeTerminalFeed();

        // Check for active incident
        checkActiveIncident();

        // Start live updates
        startLiveUpdates();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showError('Failed to load portfolio data. Please refresh the page.');
    }
}

/**
 * Load feed data from JSON
 */
async function loadFeedData() {
    try {
        const response = await fetch('./data/feed.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        AppState.feedData = await response.json();
        console.log('📊 Feed data loaded:', AppState.feedData);
    } catch (error) {
        console.error('Failed to load feed data:', error);
        // Use mock data for development
        AppState.feedData = generateMockData();
    }
}

/**
 * Initialize header components
 */
function initializeHeader() {
    // Uptime counter
    updateUptimeCounter();
    setInterval(updateUptimeCounter, 1000);

    // Chaos toggle
    const chaosToggle = document.getElementById('chaosToggle');
    if (chaosToggle) {
        chaosToggle.addEventListener('click', toggleChaosMode);
    }

    // Incident banner dismiss
    const dismissBtn = document.getElementById('dismissIncident');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            document.getElementById('incidentBanner').style.display = 'none';
        });
    }
}

/**
 * Update uptime counter
 */
function updateUptimeCounter() {
    const startDate = new Date('2024-01-01T00:00:00Z');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const uptimeEl = document.getElementById('uptimeCounter');
    if (uptimeEl) {
        uptimeEl.textContent = `${days}d ${hours}h ${minutes}m`;
    }
}

/**
 * Toggle Chaos Monkey mode
 */
function toggleChaosMode() {
    AppState.chaosMode = !AppState.chaosMode;
    const toggle = document.getElementById('chaosToggle');

    if (AppState.chaosMode) {
        toggle.classList.add('active');
        activateChaosMode();
        addTerminalMessage('🐵 CHAOS MONKEY MODE ACTIVATED', 'warning');
    } else {
        toggle.classList.remove('active');
        deactivateChaosMode();
        addTerminalMessage('✅ Chaos mode deactivated', 'success');
    }
}

/**
 * Activate chaos mode effects
 */
function activateChaosMode() {
    // Randomly hide badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (Math.random() > 0.7) {
            badge.style.opacity = '0.3';
            badge.style.textDecoration = 'line-through';
        }
    });

    // Change some status indicators to red
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        statusDot.classList.remove('status-operational');
        statusDot.classList.add('status-degraded');
    }

    const statusText = document.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = 'CHAOS MODE ACTIVE';
        statusText.style.color = 'var(--color-warning)';
    }

    // Increment alert count
    const alertCount = document.getElementById('alertCount');
    if (alertCount) {
        alertCount.textContent = Math.floor(Math.random() * 10) + 5;
    }
}

/**
 * Deactivate chaos mode effects
 */
function deactivateChaosMode() {
    // Restore badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.style.opacity = '1';
        badge.style.textDecoration = 'none';
    });

    // Restore status
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        statusDot.classList.remove('status-degraded');
        statusDot.classList.add('status-operational');
    }

    const statusText = document.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = 'ALL SYSTEMS NOMINAL';
        statusText.style.color = 'var(--color-success)';
    }

    // Reset alert count
    const alertCount = document.getElementById('alertCount');
    if (alertCount) {
        alertCount.textContent = '0';
    }
}

/**
 * Initialize hero stats
 */
function initializeHeroStats() {
    if (!AppState.feedData) return;

    const { metrics, skill_stats } = AppState.feedData;

    setElementText('incidentsResolved', metrics.resolved_incidents);
    setElementText('mttrMinutes', `~${metrics.avg_mttr_minutes}`);
    setElementText('skillsProven', skill_stats.total_skills);
}

/**
 * Initialize dashboard cards
 */
function initializeDashboard() {
    if (!AppState.feedData) return;

    // Update metrics in dashboard cards
    setElementText('vulnsFixed', '47');
    setElementText('buildsFixed', '23');
    setElementText('chaosDays', '127');
    setElementText('rollbacks', '3');
    setElementText('alertsSilenced', '12');
    setElementText('postMortems', AppState.feedData.incidents.length);

    // Add click handler for "View All Incidents" button
    const viewAllBtn = document.getElementById('viewAllIncidents');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            document.getElementById('incidentsSection').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/**
 * Initialize command palette
 */
function initializeCommandPalette() {
    // Listen for ':' key to open command palette
    document.addEventListener('keydown', (e) => {
        if (e.key === ':' && !AppState.commandPaletteActive) {
            e.preventDefault();
            openCommandPalette();
        } else if (e.key === 'Escape' && AppState.commandPaletteActive) {
            closeCommandPalette();
        }
    });

    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(commandInput.value);
                commandInput.value = '';
            }
        });
    }
}

/**
 * Open command palette
 */
function openCommandPalette() {
    AppState.commandPaletteActive = true;
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');

    if (palette && input) {
        palette.style.display = 'block';
        input.focus();

        // Show suggestions
        showCommandSuggestions();
    }
}

/**
 * Close command palette
 */
function closeCommandPalette() {
    AppState.commandPaletteActive = false;
    const palette = document.getElementById('commandPalette');

    if (palette) {
        palette.style.display = 'none';
    }
}

/**
 * Show command suggestions
 */
function showCommandSuggestions() {
    const suggestions = document.getElementById('commandSuggestions');
    if (!suggestions) return;

    const commands = [
        { cmd: 'skills', desc: 'List all skills with timestamps' },
        { cmd: 'incidents', desc: 'Show incident summary' },
        { cmd: 'metrics', desc: 'Display current system metrics' },
        { cmd: 'chaos', desc: 'Toggle Chaos Monkey mode' },
        { cmd: 'help', desc: 'Show all commands' },
    ];

    suggestions.innerHTML = commands.map(c =>
        `<div class="command-suggestion">
      <span class="cmd-name">${c.cmd}</span>
      <span class="cmd-desc">${c.desc}</span>
    </div>`
    ).join('');
}

/**
 * Execute command
 */
function executeCommand(cmd) {
    const command = cmd.trim().toLowerCase();

    switch (command) {
        case 'skills':
            showSkillsList();
            break;
        case 'incidents':
            showIncidentsSummary();
            break;
        case 'metrics':
            showMetrics();
            break;
        case 'chaos':
            toggleChaosMode();
            break;
        case 'help':
            showHelp();
            break;
        default:
            addTerminalMessage(`❌ Unknown command: ${cmd}`, 'danger');
    }

    closeCommandPalette();
}

/**
 * Show skills list in terminal
 */
function showSkillsList() {
    if (!AppState.feedData) return;

    addTerminalMessage('📋 SKILLS LIST', 'info');
    AppState.feedData.skills.forEach(skill => {
        const lastProven = skill.last_proven
            ? new Date(skill.last_proven).toLocaleString()
            : 'Never';
        addTerminalMessage(`${skill.icon} ${skill.name} - Last proven: ${lastProven}`, 'success');
    });
}

/**
 * Show incidents summary in terminal
 */
function showIncidentsSummary() {
    if (!AppState.feedData) return;

    addTerminalMessage('🚨 INCIDENTS SUMMARY', 'info');
    addTerminalMessage(`Total: ${AppState.feedData.metrics.total_incidents}`, 'info');
    addTerminalMessage(`Resolved: ${AppState.feedData.metrics.resolved_incidents}`, 'success');
    addTerminalMessage(`Avg MTTR: ${AppState.feedData.metrics.avg_mttr_minutes} minutes`, 'info');
}

/**
 * Show metrics in terminal
 */
function showMetrics() {
    addTerminalMessage('📊 SYSTEM METRICS', 'info');
    addTerminalMessage(`CPU: ${Math.floor(Math.random() * 30 + 20)}%`, 'success');
    addTerminalMessage(`Memory: ${Math.floor(Math.random() * 40 + 30)}%`, 'success');
    addTerminalMessage(`Disk: ${Math.floor(Math.random() * 50 + 20)}%`, 'success');
    addTerminalMessage(`Network: ${Math.floor(Math.random() * 100 + 50)} Mbps`, 'success');
}

/**
 * Show help in terminal
 */
function showHelp() {
    addTerminalMessage('📖 AVAILABLE COMMANDS', 'info');
    addTerminalMessage('skills     - List all skills', 'info');
    addTerminalMessage('incidents  - Show incidents summary', 'info');
    addTerminalMessage('metrics    - Display system metrics', 'info');
    addTerminalMessage('chaos      - Toggle Chaos Monkey mode', 'info');
    addTerminalMessage('help       - Show this help', 'info');
}

/**
 * Initialize terminal feed
 */
function initializeTerminalFeed() {
    addTerminalMessage('✅ System initialized', 'success');
    addTerminalMessage('📡 Monitoring active', 'info');
    addTerminalMessage('🔒 Security: All checks passed', 'success');

    // Minimize button
    const minimizeBtn = document.getElementById('minimizeTerminal');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            const feed = document.getElementById('terminalFeed');
            feed.classList.toggle('minimized');
        });
    }
}

/**
 * Add message to terminal feed
 */
function addTerminalMessage(message, type = 'info') {
    const terminal = document.getElementById('terminalContent');
    if (!terminal) return;

    const timestamp = new Date().toLocaleTimeString();
    const colorClass = `text-${type}`;

    const messageEl = document.createElement('div');
    messageEl.className = 'terminal-line';
    messageEl.innerHTML = `<span class="terminal-timestamp">[${timestamp}]</span> <span class="${colorClass}">${message}</span>`;

    terminal.appendChild(messageEl);
    terminal.scrollTop = terminal.scrollHeight;

    // Keep only last 50 messages
    while (terminal.children.length > 50) {
        terminal.removeChild(terminal.firstChild);
    }
}

/**
 * Check for active incident
 */
async function checkActiveIncident() {
    try {
        const response = await fetch('./data/active-incident.json');
        if (response.ok) {
            const data = await response.json();
            if (data.active) {
                showActiveIncidentBanner(data);
            }
        }
    } catch (error) {
        // No active incident file, that's okay
    }
}

/**
 * Show active incident banner
 */
function showActiveIncidentBanner(incident) {
    const banner = document.getElementById('incidentBanner');
    const text = document.getElementById('incidentText');
    const severity = document.getElementById('incidentSeverity');

    if (banner && text && severity) {
        text.textContent = incident.title || 'LEARNING INCIDENT IN PROGRESS';
        severity.textContent = incident.severity || 'SEV-1';
        banner.style.display = 'block';

        addTerminalMessage(`🚨 Active incident: ${incident.title}`, 'danger');
    }
}

/**
 * Start live updates
 */
function startLiveUpdates() {
    // Simulate live feed updates
    setInterval(() => {
        if (Math.random() > 0.7) {
            const messages = [
                'INFO: Certificate renewed successfully',
                'INFO: Backup completed',
                'INFO: Health check passed',
                'INFO: Deployment successful',
                'INFO: Cache cleared',
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            addTerminalMessage(randomMessage, 'success');
        }
    }, 10000);

    // Update last deploy timestamp
    const lastDeploy = document.getElementById('lastDeploy');
    if (lastDeploy) {
        lastDeploy.textContent = new Date().toLocaleString();
    }
}

/**
 * Utility: Set element text content
 */
function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}

/**
 * Show error message
 */
function showError(message) {
    addTerminalMessage(`❌ ERROR: ${message}`, 'danger');
}

/**
 * Generate mock data for development
 */
function generateMockData() {
    return {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        incidents: [],
        skills: [],
        metrics: {
            total_incidents: 5,
            resolved_incidents: 5,
            avg_mttr_minutes: 89,
            total_users_affected: 0,
            total_revenue_impact_usd: 0,
        },
        skill_stats: {
            total_skills: 5,
            expert_skills: 5,
            recently_proven: 5,
        },
    };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
