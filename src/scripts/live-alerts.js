// Live Alert System for DevOps Portfolio - ENHANCED!
(function () {
    'use strict';

    console.log('🚀 Alert system loading...');

    // Create alerts container if it doesn't exist
    let alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) {
        alertsContainer = document.createElement('div');
        alertsContainer.id = 'alertsContainer';
        alertsContainer.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            width: 380px; 
            z-index: 99999; 
            pointer-events: none;
        `;
        document.body.appendChild(alertsContainer);
        console.log('✅ Alert container created!');
    }

    const alertTemplates = [
        { type: 'error', icon: '🚨', title: 'SSL CERTIFICATE ALERT', body: 'SSL cert expires in 14 days - prod.sarra.dev', color: '#ef4444' },
        { type: 'info', icon: '📡', title: 'AUTO-SCALING EVENT', body: 'K8s HPA scaled api-gateway from 3→5 pods', color: '#005b96' },
        { type: 'warning', icon: '⚠️', title: 'MEMORY THRESHOLD', body: 'prometheus container using 78% memory', color: '#f59e0b' },
        { type: 'error', icon: '🔥', title: 'HIGH TRAFFIC ALERT', body: 'Request rate: 2.4K/min (↑120%)', color: '#ef4444' },
        { type: 'info', icon: '✅', title: 'BACKUP COMPLETE', body: 'Velero snapshot completed - RTO: 15min', color: '#10b981' },
        { type: 'warning', icon: '⏰', title: 'SCHEDULED MAINTENANCE', body: 'Rolling update scheduled in 2hr', color: '#f59e0b' },
        { type: 'info', icon: '🔒', title: 'SECURITY SCAN', body: 'Trivy found 0 vulnerabilities in latest build', color: '#10b981' },
        { type: 'warning', icon: '💾', title: 'DISK SPACE WARNING', body: 'Volume /var/lib/docker at 82% capacity', color: '#f59e0b' }
    ];

    let alertQueue = 0;
    const showAlert = () => {
        if (alertQueue >= 3) return; // Max 3 alerts at once

        const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
        const alert = document.createElement('div');

        alert.style.cssText = `
            background: #ffffff;
            border-left: 6px solid ${template.color};
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 15px 40px rgba(1, 31, 75, 0.25);
            pointer-events: auto;
            animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        alert.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">${template.icon}</span>
                    <span style="font-weight: 800; font-size: 0.9rem; color: #011f4b; letter-spacing: 0.03em;">${template.title}</span>
                </div>
                <span style="font-size: 0.7rem; color: ${template.color}; font-weight: 700;">● LIVE</span>
            </div>
            <div style="font-size: 0.8rem; color: #03396c; font-family: 'JetBrains Mono', monospace; line-height: 1.5;">
                ${template.body}
            </div>
        `;

        // Click to dismiss
        alert.addEventListener('click', () => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(450px)';
            setTimeout(() => {
                alert.remove();
                alertQueue--;
            }, 300);
        });

        // Hover effect
        alert.addEventListener('mouseenter', () => {
            alert.style.transform = 'translateX(-10px) scale(1.02)';
            alert.style.boxShadow = `0 20px 50px rgba(1, 31, 75, 0.35)`;
        });

        alert.addEventListener('mouseleave', () => {
            alert.style.transform = 'translateX(0) scale(1)';
            alert.style.boxShadow = `0 15px 40px rgba(1, 31, 75, 0.25)`;
        });

        alertsContainer.appendChild(alert);
        alertQueue++;
        console.log(`📬 Alert shown: ${template.title}`);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(450px)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                    alertQueue--;
                }
            }, 400);
        }, 8000);
    };

    // Trigger first alert immediately
    setTimeout(() => {
        showAlert();
        console.log('🎉 First alert triggered!');
    }, 2000);

    // Regular alert intervals
    setInterval(() => {
        if (Math.random() > 0.5) showAlert();
    }, 7000);

    // Live Metrics Updates
    const updateMetrics = () => {
        const liveRequests = document.getElementById('liveRequests');
        const liveCpu = document.getElementById('liveCpu');
        const liveMemory = document.getElementById('liveMemory');

        if (liveRequests) {
            const requests = (Math.random() * 2 + 0.8).toFixed(1);
            liveRequests.textContent = `${requests}K`;
        }

        if (liveCpu) {
            const cpu = Math.floor(Math.random() * 30 + 15);
            liveCpu.textContent = `${cpu}%`;
        }

        if (liveMemory) {
            const mem = Math.floor(Math.random() * 20 + 60);
            liveMemory.textContent = `${mem}%`;
        }
    };

    // Initial update
    setTimeout(updateMetrics, 1000);
    setInterval(updateMetrics, 3000);

    console.log('✨ Alert system fully loaded and active!');
})();
