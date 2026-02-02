/**
 * CME Reconciliation Demo - Animation Module
 * Handles all visual animations, data flow, and connection lines
 */

const Animations = {
    // Configuration
    config: {
        speedMultiplier: 1,
        particleCount: 5,
        animationEnabled: true
    },

    // DOM References (initialized later)
    elements: {},

    // Animation state
    state: {
        activeAnimations: [],
        connectionLines: [],
        dataPackets: []
    },

    /**
     * Initialize animation system
     */
    init() {
        this.cacheElements();
        this.setupConnectionLines();
        this.setupResizeHandler();
    },

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            orchestrator: document.getElementById('orchestrator'),
            svg: document.getElementById('connection-svg'),
            dataFlow: document.getElementById('data-flow'),
            agents: {
                invoice: document.getElementById('agent-invoice'),
                entity: document.getElementById('agent-entity'),
                citi: document.getElementById('agent-citi'),
                cvent: document.getElementById('agent-cvent')
            },
            sources: {
                s3: document.getElementById('source-s3'),
                citi: document.getElementById('source-citi'),
                concur: document.getElementById('source-concur'),
                cvent: document.getElementById('source-cvent')
            }
        };
    },

    /**
     * Set animation speed multiplier
     */
    setSpeed(multiplier) {
        this.config.speedMultiplier = multiplier;
    },

    /**
     * Setup SVG connection lines between orchestrator and agents
     */
    setupConnectionLines() {
        if (!this.elements.svg) return;

        // Clear existing lines
        const existingLines = this.elements.svg.querySelectorAll('.connection-line');
        existingLines.forEach(line => line.remove());

        // We'll draw lines when positions are calculated
        this.drawConnections();
    },

    /**
     * Draw connection lines from orchestrator to each agent
     */
    drawConnections() {
        if (!this.elements.svg || !this.elements.orchestrator) return;

        const svg = this.elements.svg;
        const svgRect = svg.getBoundingClientRect();
        const orchestratorRect = this.elements.orchestrator.getBoundingClientRect();

        // Calculate orchestrator center position relative to SVG
        const orchestratorCenter = {
            x: orchestratorRect.left + orchestratorRect.width / 2 - svgRect.left,
            y: orchestratorRect.bottom - svgRect.top
        };

        // Draw line to each agent
        Object.entries(this.elements.agents).forEach(([agentName, agentEl]) => {
            if (!agentEl) return;

            const agentRect = agentEl.getBoundingClientRect();
            const agentCenter = {
                x: agentRect.left + agentRect.width / 2 - svgRect.left,
                y: agentRect.top - svgRect.top
            };

            // Create path element
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', `connection-line connection-${agentName}`);
            path.setAttribute('id', `line-${agentName}`);

            // Create curved path
            const midY = (orchestratorCenter.y + agentCenter.y) / 2;
            const d = `M ${orchestratorCenter.x} ${orchestratorCenter.y}
                       Q ${orchestratorCenter.x} ${midY} ${(orchestratorCenter.x + agentCenter.x) / 2} ${midY}
                       Q ${agentCenter.x} ${midY} ${agentCenter.x} ${agentCenter.y}`;
            path.setAttribute('d', d);

            svg.appendChild(path);

            // Store line reference
            this.state.connectionLines.push({
                name: agentName,
                element: path,
                from: orchestratorCenter,
                to: agentCenter
            });
        });
    },

    /**
     * Handle window resize
     */
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.state.connectionLines = [];
                this.setupConnectionLines();
            }, 250);
        });
    },

    /**
     * Activate an agent card with animation
     */
    activateAgent(agentName, status = 'processing') {
        const agent = this.elements.agents[agentName];
        if (!agent) return;

        // Remove previous states
        agent.classList.remove('active', 'processing', 'completed');

        // Add new state
        agent.classList.add('active');
        if (status === 'processing') {
            agent.classList.add('processing');
        }

        // Update status indicator
        const statusEl = agent.querySelector('.agent-status');
        if (statusEl) {
            statusEl.className = `agent-status ${status}`;
            statusEl.innerHTML = `<i class="fas fa-circle"></i> ${this.capitalizeFirst(status)}`;
        }

        // Activate connection line
        this.activateConnectionLine(agentName);

        // Activate orchestrator
        this.elements.orchestrator?.classList.add('active');
        const orchStatus = document.getElementById('orchestrator-status');
        if (orchStatus) {
            orchStatus.textContent = `Coordinating ${this.capitalizeFirst(agentName)}`;
        }
    },

    /**
     * Complete an agent's processing
     */
    completeAgent(agentName) {
        const agent = this.elements.agents[agentName];
        if (!agent) return;

        agent.classList.remove('processing');
        agent.classList.add('completed');

        const statusEl = agent.querySelector('.agent-status');
        if (statusEl) {
            statusEl.className = 'agent-status completed';
            statusEl.innerHTML = '<i class="fas fa-circle"></i> Completed';
        }

        // Deactivate connection line
        this.deactivateConnectionLine(agentName);
    },

    /**
     * Reset an agent to standby
     */
    resetAgent(agentName) {
        const agent = this.elements.agents[agentName];
        if (!agent) return;

        agent.classList.remove('active', 'processing', 'completed');

        const statusEl = agent.querySelector('.agent-status');
        if (statusEl) {
            statusEl.className = 'agent-status standby';
            statusEl.innerHTML = '<i class="fas fa-circle"></i> Standby';
        }

        // Reset progress
        const progressFill = document.getElementById(`progress-${agentName}`);
        const progressText = document.getElementById(`progress-text-${agentName}`);
        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = 'Idle';

        this.deactivateConnectionLine(agentName);
    },

    /**
     * Reset all agents
     */
    resetAllAgents() {
        Object.keys(this.elements.agents).forEach(agent => this.resetAgent(agent));

        // Reset orchestrator
        this.elements.orchestrator?.classList.remove('active');
        const orchStatus = document.getElementById('orchestrator-status');
        if (orchStatus) orchStatus.textContent = 'Idle';
    },

    /**
     * Activate a connection line
     */
    activateConnectionLine(agentName) {
        const line = this.elements.svg?.querySelector(`#line-${agentName}`);
        if (line) {
            line.classList.add('active');
        }
    },

    /**
     * Deactivate a connection line
     */
    deactivateConnectionLine(agentName) {
        const line = this.elements.svg?.querySelector(`#line-${agentName}`);
        if (line) {
            line.classList.remove('active');
        }
    },

    /**
     * Update agent progress bar
     */
    updateProgress(agentName, percent, text = null) {
        const progressFill = document.getElementById(`progress-${agentName}`);
        const progressText = document.getElementById(`progress-text-${agentName}`);

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (progressText && text) {
            progressText.textContent = text;
        }
    },

    /**
     * Animate progress from start to end
     */
    animateProgress(agentName, duration, steps = []) {
        return new Promise((resolve) => {
            const adjustedDuration = duration / this.config.speedMultiplier;
            const interval = adjustedDuration / 100;
            let progress = 0;

            const animate = () => {
                if (progress >= 100) {
                    this.updateProgress(agentName, 100, steps[steps.length - 1] || 'Complete');
                    resolve();
                    return;
                }

                progress += 1;

                // Find appropriate step text
                const stepIndex = Math.floor((progress / 100) * steps.length);
                const stepText = steps[Math.min(stepIndex, steps.length - 1)] || `Processing ${progress}%`;

                this.updateProgress(agentName, progress, stepText);
                setTimeout(animate, interval);
            };

            animate();
        });
    },

    /**
     * Create and animate a data packet
     */
    createDataPacket(fromEl, toEl, type = 'default', duration = 1000) {
        return new Promise((resolve) => {
            if (!this.elements.dataFlow) {
                resolve();
                return;
            }

            const adjustedDuration = duration / this.config.speedMultiplier;
            const container = this.elements.dataFlow;
            const containerRect = container.getBoundingClientRect();

            // Get element positions
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
            const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
            const endX = toRect.left + toRect.width / 2 - containerRect.left;
            const endY = toRect.top + toRect.height / 2 - containerRect.top;

            // Create packet element
            const packet = document.createElement('div');
            packet.className = `data-packet ${type}`;
            packet.style.left = `${startX}px`;
            packet.style.top = `${startY}px`;
            container.appendChild(packet);

            // Animate packet
            const animation = packet.animate([
                { left: `${startX}px`, top: `${startY}px`, opacity: 1 },
                { left: `${endX}px`, top: `${endY}px`, opacity: 1 }
            ], {
                duration: adjustedDuration,
                easing: 'ease-in-out'
            });

            animation.onfinish = () => {
                packet.remove();
                resolve();
            };

            this.state.dataPackets.push(packet);
        });
    },

    /**
     * Animate data flow from source to agent
     */
    async animateDataFlow(sourceName, agentName, count = 3) {
        const sourceEl = this.elements.sources[sourceName];
        const agentEl = this.elements.agents[agentName];

        if (!sourceEl || !agentEl) return;

        // Highlight source
        sourceEl.classList.add('active');

        // Send multiple packets
        const promises = [];
        for (let i = 0; i < count; i++) {
            await this.delay(200 / this.config.speedMultiplier);
            promises.push(this.createDataPacket(sourceEl, agentEl, agentName, 800));
        }

        await Promise.all(promises);
        sourceEl.classList.remove('active');
    },

    /**
     * Animate agent to agent communication
     */
    async animateAgentToAgent(fromAgent, toAgent, count = 2) {
        const fromEl = this.elements.agents[fromAgent];
        const toEl = this.elements.agents[toAgent];

        if (!fromEl || !toEl) return;

        for (let i = 0; i < count; i++) {
            await this.delay(300 / this.config.speedMultiplier);
            await this.createDataPacket(fromEl, toEl, toAgent, 600);
        }
    },

    /**
     * Pulse animation on element
     */
    pulseElement(element, duration = 500) {
        if (!element) return;

        element.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0 rgba(99, 102, 241, 0)' },
            { transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
            { transform: 'scale(1)', boxShadow: '0 0 0 rgba(99, 102, 241, 0)' }
        ], {
            duration: duration / this.config.speedMultiplier,
            easing: 'ease-in-out'
        });
    },

    /**
     * Success flash animation
     */
    successFlash(element) {
        if (!element) return;

        element.animate([
            { backgroundColor: 'var(--bg-elevated)' },
            { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
            { backgroundColor: 'var(--bg-elevated)' }
        ], {
            duration: 600 / this.config.speedMultiplier,
            easing: 'ease-in-out'
        });
    },

    /**
     * Shake animation for errors
     */
    shakeElement(element) {
        if (!element) return;

        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    },

    /**
     * Utility: delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Utility: capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Stop all active animations
     */
    stopAllAnimations() {
        this.state.activeAnimations.forEach(anim => {
            if (anim && typeof anim.cancel === 'function') {
                anim.cancel();
            }
        });
        this.state.activeAnimations = [];

        // Remove all data packets
        this.state.dataPackets.forEach(packet => packet.remove());
        this.state.dataPackets = [];
    },

    /**
     * Create typing effect for log messages
     */
    typeMessage(element, message, speed = 30) {
        return new Promise((resolve) => {
            let index = 0;
            const adjustedSpeed = speed / this.config.speedMultiplier;

            const type = () => {
                if (index < message.length) {
                    element.textContent += message.charAt(index);
                    index++;
                    setTimeout(type, adjustedSpeed);
                } else {
                    resolve();
                }
            };

            type();
        });
    },

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300) {
        if (!element) return Promise.resolve();

        element.style.opacity = '0';
        element.style.display = 'block';

        return new Promise((resolve) => {
            const animation = element.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: duration / this.config.speedMultiplier,
                fill: 'forwards'
            });

            animation.onfinish = () => {
                element.style.opacity = '1';
                resolve();
            };
        });
    },

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300) {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const animation = element.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: duration / this.config.speedMultiplier,
                fill: 'forwards'
            });

            animation.onfinish = () => {
                element.style.opacity = '0';
                element.style.display = 'none';
                resolve();
            };
        });
    },

    /**
     * Counter animation for stats
     */
    animateCounter(element, start, end, duration = 1000) {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const adjustedDuration = duration / this.config.speedMultiplier;
            const range = end - start;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / adjustedDuration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + range * easeOut);

                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = end;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
}
