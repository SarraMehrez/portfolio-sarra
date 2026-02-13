/**
 * Incidents Module
 * Handles incident card rendering and modal display
 */

/**
 * Initialize incidents section
 */
function initializeIncidents() {
    if (!AppState.feedData || !AppState.feedData.incidents) {
        console.warn('No incidents data available');
        return;
    }

    renderIncidentCards(AppState.feedData.incidents);
    setupIncidentFilters();
    setupIncidentModal();
}

/**
 * Render incident cards
 */
function renderIncidentCards(incidents) {
    const grid = document.getElementById('incidentsGrid');
    if (!grid) return;

    grid.innerHTML = incidents.map(incident => createIncidentCard(incident)).join('');

    // Add click handlers
    grid.querySelectorAll('.incident-card').forEach((card, index) => {
        card.addEventListener('click', () => showIncidentModal(incidents[index]));
    });
}

/**
 * Create incident card HTML
 */
function createIncidentCard(incident) {
    const severityClass = incident.severity.toLowerCase().replace('-', '');
    const statusClass = incident.status === 'resolved' ? 'success' : 'warning';
    const statusIcon = incident.status === 'resolved' ? '✅' : '⚠️';

    return `
    <div class="incident-card" data-severity="${incident.severity}" data-status="${incident.status}">
      <div class="incident-card-header">
        <span class="incident-severity-badge ${severityClass}">${incident.severity}</span>
        <span class="incident-status ${statusClass}">${statusIcon} ${incident.status}</span>
      </div>
      
      <h3 class="incident-title">${incident.title}</h3>
      
      <div class="incident-meta">
        <div class="incident-meta-item">
          <span class="meta-label">Date:</span>
          <span class="meta-value">${formatDate(incident.date)}</span>
        </div>
        <div class="incident-meta-item">
          <span class="meta-label">Duration:</span>
          <span class="meta-value">${incident.duration_minutes} min</span>
        </div>
        <div class="incident-meta-item">
          <span class="meta-label">MTTR:</span>
          <span class="meta-value">${incident.metrics?.mttr_minutes || incident.duration_minutes} min</span>
        </div>
      </div>
      
      <p class="incident-summary">${truncateText(incident.what_happened, 150)}</p>
      
      <div class="incident-footer">
        <div class="incident-skills">
          ${(incident.skills_used || []).slice(0, 3).map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('')}
          ${incident.skills_used && incident.skills_used.length > 3 ?
            `<span class="skill-tag">+${incident.skills_used.length - 3}</span>` : ''}
        </div>
        <button class="btn-view-details">View Details →</button>
      </div>
    </div>
  `;
}

/**
 * Setup incident filters
 */
function setupIncidentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter incidents
            const filter = btn.dataset.filter;
            filterIncidents(filter);
        });
    });
}

/**
 * Filter incidents
 */
function filterIncidents(filter) {
    const cards = document.querySelectorAll('.incident-card');

    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'resolved') {
            card.style.display = card.dataset.status === 'resolved' ? 'block' : 'none';
        } else {
            card.style.display = card.dataset.severity === filter ? 'block' : 'none';
        }
    });
}

/**
 * Setup incident modal
 */
function setupIncidentModal() {
    const modal = document.getElementById('incidentModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    if (overlay) {
        overlay.addEventListener('click', closeIncidentModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeIncidentModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeIncidentModal();
        }
    });
}

/**
 * Show incident modal
 */
function showIncidentModal(incident) {
    const modal = document.getElementById('incidentModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = createIncidentModalContent(incident);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

/**
 * Close incident modal
 */
function closeIncidentModal() {
    const modal = document.getElementById('incidentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Create incident modal content
 */
function createIncidentModalContent(incident) {
    return `
    <div class="incident-modal-header">
      <h2 class="incident-modal-title">${incident.title}</h2>
      <div class="incident-modal-meta">
        <span class="incident-severity-badge ${incident.severity.toLowerCase().replace('-', '')}">${incident.severity}</span>
        <span class="incident-date">${formatDate(incident.date)}</span>
        <span class="incident-duration">${incident.duration_minutes} minutes</span>
      </div>
    </div>
    
    <div class="incident-modal-content">
      <section class="modal-section">
        <h3 class="modal-section-title">📋 Timeline</h3>
        <div class="incident-timeline">
          ${(incident.timeline || []).map(event => `
            <div class="timeline-event">
              <span class="timeline-time">${event.time}</span>
              <span class="timeline-event-text">${event.event}</span>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section class="modal-section">
        <h3 class="modal-section-title">❓ What Happened</h3>
        <div class="modal-text">${formatMultilineText(incident.what_happened)}</div>
      </section>
      
      <section class="modal-section">
        <h3 class="modal-section-title">🔍 Root Cause</h3>
        <div class="modal-text">${formatMultilineText(incident.root_cause)}</div>
      </section>
      
      <section class="modal-section">
        <h3 class="modal-section-title">✅ Resolution</h3>
        <div class="modal-text">${formatMultilineText(incident.resolution)}</div>
      </section>
      
      <section class="modal-section">
        <h3 class="modal-section-title">🛡️ Prevention Measures</h3>
        <div class="modal-text">${formatMultilineText(incident.prevention)}</div>
      </section>
      
      ${incident.artifacts && incident.artifacts.length > 0 ? `
        <section class="modal-section">
          <h3 class="modal-section-title">📦 Artifacts</h3>
          ${incident.artifacts.map(artifact => `
            <div class="artifact-item">
              <h4 class="artifact-title">${artifact.description}</h4>
              <pre class="artifact-content"><code>${escapeHtml(artifact.content)}</code></pre>
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${incident.before_after ? `
        <section class="modal-section">
          <h3 class="modal-section-title">🔄 Before / After</h3>
          <div class="before-after-grid">
            <div class="before-column">
              <h4>❌ Before</h4>
              <ul>
                ${incident.before_after.before.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
            <div class="after-column">
              <h4>✅ After</h4>
              <ul>
                ${incident.before_after.after.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
      ` : ''}
      
      <section class="modal-section">
        <h3 class="modal-section-title">🎯 Skills Used</h3>
        <div class="skills-used">
          ${(incident.skills_used || []).map(skill =>
        `<span class="skill-badge">${skill}</span>`
    ).join('')}
        </div>
      </section>
      
      <section class="modal-section">
        <h3 class="modal-section-title">📊 Metrics</h3>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">MTTR</span>
            <span class="metric-value">${incident.metrics?.mttr_minutes || incident.duration_minutes} min</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Users Affected</span>
            <span class="metric-value">${(incident.users_affected || 0).toLocaleString()}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Revenue Impact</span>
            <span class="metric-value">$${(incident.revenue_impact_usd || 0).toLocaleString()}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">SLA Breach</span>
            <span class="metric-value">${incident.metrics?.sla_breach ? '❌ Yes' : '✅ No'}</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Truncate text
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Format multiline text
 */
function formatMultilineText(text) {
    if (!text) return '';
    return text.split('\n').map(line => `<p>${line}</p>`).join('');
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when dashboard is ready
if (typeof AppState !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeIncidents, 500);
    });
}
