/**
 * Mock Metrics Generator
 * Generates simulated metrics for dashboard visualizations
 */

/**
 * Generate vulnerability trend data
 */
function generateVulnerabilityData() {
    const data = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 30; i >= 0; i--) {
        data.push({
            date: new Date(now - i * dayMs),
            critical: Math.max(0, Math.floor(Math.random() * 3) - i * 0.1),
            high: Math.max(0, Math.floor(Math.random() * 5) - i * 0.15),
            medium: Math.max(0, Math.floor(Math.random() * 8) - i * 0.2),
        });
    }

    return data;
}

/**
 * Generate build success/failure sparkline data
 */
function generateBuildSparklineData() {
    const data = [];

    for (let i = 0; i < 50; i++) {
        data.push({
            build: i + 1,
            success: Math.random() > 0.1, // 90% success rate
            duration: Math.floor(Math.random() * 300 + 300), // 5-10 minutes
        });
    }

    return data;
}

/**
 * Generate deploy/rollback donut data
 */
function generateDeployDonutData() {
    return {
        successful_deploys: 47,
        rollbacks: 3,
        total: 50,
    };
}

/**
 * Generate alert heatmap data
 */
function generateAlertHeatmapData() {
    const data = [];
    const hours = 24;
    const days = 7;

    for (let day = 0; day < days; day++) {
        for (let hour = 0; hour < hours; hour++) {
            data.push({
                day,
                hour,
                alerts: Math.floor(Math.random() * 10),
            });
        }
    }

    return data;
}

/**
 * Generate incident timeline data
 */
function generateIncidentTimelineData() {
    return [
        { date: '2024-11-15', title: 'SSL Apocalypse', severity: 'SEV-1' },
        { date: '2024-10-08', title: 'Kubernetes OOM', severity: 'SEV-1' },
        { date: '2024-09-22', title: 'Terraform Heist', severity: 'SEV-2' },
        { date: '2024-08-17', title: 'DB Failover', severity: 'SEV-1' },
        { date: '2024-07-12', title: 'Supply Chain', severity: 'SEV-2' },
    ];
}

/**
 * Render simple ASCII chart in terminal
 */
function renderAsciiChart(data, label) {
    const max = Math.max(...data);
    const height = 10;

    console.log(`\n${label}:`);

    for (let i = height; i >= 0; i--) {
        let line = '';
        data.forEach(value => {
            const normalized = (value / max) * height;
            line += normalized >= i ? '█' : ' ';
        });
        console.log(line);
    }
}

/**
 * Get current system metrics (simulated)
 */
function getCurrentMetrics() {
    return {
        cpu: Math.floor(Math.random() * 30 + 20),
        memory: Math.floor(Math.random() * 40 + 30),
        disk: Math.floor(Math.random() * 50 + 20),
        network: Math.floor(Math.random() * 100 + 50),
        uptime: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 1000),
    };
}

/**
 * Initialize mock metrics
 */
function initializeMockMetrics() {
    console.log('📊 Mock metrics initialized');

    // Log sample data for debugging
    if (window.location.search.includes('debug=true')) {
        console.log('Vulnerability Data:', generateVulnerabilityData());
        console.log('Build Sparkline:', generateBuildSparklineData());
        console.log('Deploy Donut:', generateDeployDonutData());
        console.log('Alert Heatmap:', generateAlertHeatmapData());
        console.log('Current Metrics:', getCurrentMetrics());
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MockMetrics = {
        generateVulnerabilityData,
        generateBuildSparklineData,
        generateDeployDonutData,
        generateAlertHeatmapData,
        generateIncidentTimelineData,
        getCurrentMetrics,
    };
}

// Initialize on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeMockMetrics);
}
