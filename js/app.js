/**
 * CME Reconciliation Demo - Main Application
 * Controls the demo flow, user interactions, and coordinates all modules
 */

const App = {
    // Application state
    state: {
        isRunning: false,
        isPaused: false,
        currentStep: 0,
        processedInvoices: 0,
        extractedEntities: 0,
        phase1Matches: 0,
        phase2Complete: 0,
        speed: 3, // 1-5 scale
        mode: 'auto' // 'auto' or 'step'
    },

    // DOM element references
    elements: {},

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeComponents();
        this.log('System initialized. Ready to start demo.', 'system');
    },

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            // Buttons
            btnStart: document.getElementById('btn-start'),
            btnReset: document.getElementById('btn-reset'),
            btnStep: document.getElementById('btn-step'),

            // Speed control
            speedSlider: document.getElementById('speed-slider'),
            speedLabel: document.getElementById('speed-label'),

            // Activity log
            activityLog: document.getElementById('activity-log'),

            // Stats
            statInvoices: document.getElementById('stat-invoices'),
            statEntities: document.getElementById('stat-entities'),
            statPhase1: document.getElementById('stat-phase1'),
            statPhase2: document.getElementById('stat-phase2'),

            // Document preview
            documentPreview: document.getElementById('document-preview'),

            // Orchestrator
            orchestratorStatus: document.getElementById('orchestrator-status'),

            // Modal
            modal: document.getElementById('detail-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            modalClose: document.getElementById('modal-close')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Control buttons
        this.elements.btnStart?.addEventListener('click', () => this.startDemo());
        this.elements.btnReset?.addEventListener('click', () => this.resetDemo());
        this.elements.btnStep?.addEventListener('click', () => this.stepDemo());

        // Speed slider
        this.elements.speedSlider?.addEventListener('input', (e) => this.updateSpeed(e.target.value));

        // Modal close
        this.elements.modalClose?.addEventListener('click', () => this.closeModal());
        this.elements.modal?.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });

        // Agent card clicks
        document.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('click', () => this.showAgentDetails(card.dataset.agent));
        });

        // Orchestrator click
        document.getElementById('orchestrator')?.addEventListener('click', () => this.showOrchestratorDetails());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !this.state.isRunning) {
                e.preventDefault();
                this.startDemo();
            } else if (e.key === 'r' && !this.state.isRunning) {
                this.resetDemo();
            } else if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    /**
     * Initialize animation and other components
     */
    initializeComponents() {
        // Initialize animations
        if (typeof Animations !== 'undefined') {
            Animations.init();
        }

        // Set initial speed
        this.updateSpeed(this.state.speed);
    },

    /**
     * Update animation speed
     */
    updateSpeed(value) {
        this.state.speed = parseInt(value);

        const speedLabels = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
        const speedMultipliers = [0.5, 0.75, 1, 1.5, 2];

        if (this.elements.speedLabel) {
            this.elements.speedLabel.textContent = speedLabels[this.state.speed - 1];
        }

        if (typeof Animations !== 'undefined') {
            Animations.setSpeed(speedMultipliers[this.state.speed - 1]);
        }
    },

    /**
     * Start the demo
     */
    async startDemo() {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.state.currentStep = 0;
        this.updateControls();

        this.log('Demo started - Multi-Agent Reconciliation System', 'system');
        this.log('Orchestrator coordinating agent workflow...', 'system');

        // Run through all workflow steps
        for (const step of DemoData.workflowSteps) {
            if (!this.state.isRunning) break;

            await this.executeStep(step);
            this.state.currentStep++;
        }

        if (this.state.isRunning) {
            await this.showFinalReport();
            this.log('Demo complete! All documents reconciled successfully.', 'success');
        }

        this.state.isRunning = false;
        this.updateControls();
    },

    /**
     * Execute a single workflow step
     */
    async executeStep(step) {
        this.log(`Starting: ${step.title}`, 'system');

        switch (step.name) {
            case 'phase1':
                await this.runPhase1Reconciliation(step);
                break;
            case 'extract':
                await this.runInvoiceProcessing(step);
                break;
            case 'entities':
                await this.runEntityExtraction(step);
                break;
            case 'phase2':
                await this.runPhase2Reconciliation(step);
                break;
        }
    },

    /**
     * Step 1: Phase 1 Reconciliation (Citi-Concur)
     */
    async runPhase1Reconciliation(step) {
        Animations?.activateAgent('citi', 'processing');

        // Animate data from Citi and Concur sources
        await Promise.all([
            Animations?.animateDataFlow('citi', 'citi', 2),
            Animations?.animateDataFlow('concur', 'citi', 2)
        ]);

        const progressSteps = [
            'Fetching Citi transactions...',
            'Loading Concur expenses...',
            'Matching by amount...',
            'Validating dates...',
            'Applying fuzzy matching...',
            'Recording matches...'
        ];

        const citiPromise = Animations?.animateProgress('citi', step.duration, progressSteps);

        this.log('Fetching Citi bank transactions...', 'citi');
        this.log(`Found ${DemoData.citiTransactions.length} transactions`, 'citi');

        // Match each transaction
        for (let i = 0; i < DemoData.citiTransactions.length; i++) {
            const txn = DemoData.citiTransactions[i];
            const expense = DemoData.concurExpenses[i];
            await Animations?.delay(step.duration / (DemoData.citiTransactions.length + 1));

            this.log(`Matching: ${txn.merchantName} ($${txn.amount.toLocaleString()})`, 'citi');

            // Simulate matching
            const confidence = Math.floor(Math.random() * 10) + 90; // 90-99%
            this.log(`Match found: ${expense.vendor} - Confidence: ${confidence}%`, 'citi');

            this.state.phase1Matches++;
            this.updateStats();
        }

        await citiPromise;

        Animations?.completeAgent('citi');
        this.log(`Phase 1 Complete: ${this.state.phase1Matches} matches recorded`, 'citi');
    },

    /**
     * Step 2: Invoice Processing
     */
    async runInvoiceProcessing(step) {
        Animations?.activateAgent('invoice', 'processing');

        // Animate data flow from S3 to invoice agent
        await Animations?.animateDataFlow('s3', 'invoice', 3);

        const progressSteps = [
            'Loading documents...',
            'Analyzing with multimodal LLM...',
            'Classifying document types...',
            'Extracting content...',
            'Processing complete'
        ];

        // Process each invoice with progress animation
        const invoicePromise = Animations?.animateProgress('invoice', step.duration, progressSteps);

        // Log invoice processing
        for (let i = 0; i < DemoData.invoices.length; i++) {
            const invoice = DemoData.invoices[i];
            await Animations?.delay(step.duration / (DemoData.invoices.length + 1));

            this.log(`Processing: ${invoice.filename}`, 'invoice');
            this.showDocumentPreview(invoice, 'processing');

            this.state.processedInvoices++;
            this.updateStats();

            this.log(`Classified as: ${invoice.category}`, 'invoice');
        }

        await invoicePromise;

        Animations?.completeAgent('invoice');
        this.log('All documents processed and classified', 'invoice');
    },

    /**
     * Step 3: Entity Extraction
     */
    async runEntityExtraction(step) {
        Animations?.activateAgent('entity', 'processing');

        // Animate agent to agent flow
        await Animations?.animateAgentToAgent('invoice', 'entity', 2);

        const progressSteps = [
            'Parsing document content...',
            'Identifying vendors...',
            'Extracting dates & amounts...',
            'Matching attendee names...',
            'Storing to database...'
        ];

        const entityPromise = Animations?.animateProgress('entity', step.duration, progressSteps);

        // Extract entities from each invoice
        for (let i = 0; i < DemoData.invoices.length; i++) {
            const invoice = DemoData.invoices[i];
            await Animations?.delay(step.duration / (DemoData.invoices.length + 1));

            this.log(`Extracting from: ${invoice.filename}`, 'entity');
            this.showDocumentPreview(invoice, 'extracting');

            const data = invoice.extractedData;
            this.log(`Vendor: ${data.vendor}`, 'entity');
            this.log(`Amount: $${data.amount.toLocaleString()}`, 'entity');
            this.log(`Date: ${data.date}`, 'entity');

            if (data.attendees.length > 0) {
                this.log(`Attendees: ${data.attendees.slice(0, 2).join(', ')}...`, 'entity');
            }

            this.state.extractedEntities++;
            this.updateStats();
        }

        await entityPromise;

        Animations?.completeAgent('entity');
        this.log(`${this.state.extractedEntities} entities extracted and stored`, 'entity');
    },

    /**
     * Step 4: Phase 2 Reconciliation (Cvent-Concur)
     */
    async runPhase2Reconciliation(step) {
        Animations?.activateAgent('cvent', 'processing');

        // Animate data from entity extractor and Cvent
        await Promise.all([
            Animations?.animateAgentToAgent('entity', 'cvent', 2),
            Animations?.animateDataFlow('cvent', 'cvent', 2)
        ]);

        const progressSteps = [
            'Loading Phase 1 results...',
            'Linking to Cvent entities...',
            'Allocating to attendees...',
            'Attaching supporting docs...',
            'Generating reports...',
            'Finalizing reconciliation...'
        ];

        const cventPromise = Animations?.animateProgress('cvent', step.duration, progressSteps);

        this.log('Loading Phase 1 reconciliation data...', 'cvent');

        // Process each matched expense
        for (let i = 0; i < DemoData.invoices.length; i++) {
            const invoice = DemoData.invoices[i];
            const expense = DemoData.concurExpenses[i];
            await Animations?.delay(step.duration / (DemoData.invoices.length + 1));

            this.log(`Linking: ${expense.vendor} to invoice ${invoice.id}`, 'cvent');
            this.showDocumentPreview(invoice, 'complete');

            if (invoice.extractedData.attendees.length > 0) {
                this.log(`Allocating to ${invoice.extractedData.attendees.length} attendees`, 'cvent');
            }

            this.log('Supporting document attached', 'cvent');

            this.state.phase2Complete++;
            this.updateStats();
        }

        await cventPromise;

        Animations?.completeAgent('cvent');
        this.log(`Phase 2 Complete: ${this.state.phase2Complete} expenses fully reconciled`, 'cvent');
    },

    /**
     * Show final report
     */
    async showFinalReport() {
        await Animations?.delay(500);

        const totalAmount = DemoData.invoices.reduce((sum, inv) => sum + inv.extractedData.amount, 0);

        this.log('Generating final reconciliation report...', 'success');
        await Animations?.delay(300);

        // Show summary in document preview
        const summaryHtml = `
            <div class="document-content">
                <div class="doc-header">
                    <div class="doc-icon"><i class="fas fa-file-check"></i></div>
                    <div class="doc-info">
                        <h4>Reconciliation Report</h4>
                        <span>CME Event - ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="doc-fields">
                    <div class="doc-field">
                        <span class="label">Total Invoices</span>
                        <span class="value extracted">${this.state.processedInvoices}</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Total Amount</span>
                        <span class="value extracted">$${totalAmount.toLocaleString()}</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Auto-Reconciled</span>
                        <span class="value extracted">${this.state.phase2Complete} (100%)</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Manual Review</span>
                        <span class="value extracted">0</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Status</span>
                        <span class="value extracted" style="color: var(--success);">Ready for Submission</span>
                    </div>
                </div>
            </div>
        `;

        this.elements.documentPreview.innerHTML = summaryHtml;

        // Flash all completed agents
        Object.values(Animations?.elements.agents || {}).forEach(agent => {
            Animations?.successFlash(agent);
        });

        // Update orchestrator status
        if (this.elements.orchestratorStatus) {
            this.elements.orchestratorStatus.textContent = 'Reconciliation Complete';
        }
    },

    /**
     * Reset the demo
     */
    resetDemo() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        this.state.currentStep = 0;
        this.state.processedInvoices = 0;
        this.state.extractedEntities = 0;
        this.state.phase1Matches = 0;
        this.state.phase2Complete = 0;

        // Reset animations
        Animations?.resetAllAgents();
        Animations?.stopAllAnimations();

        // Clear activity log
        if (this.elements.activityLog) {
            this.elements.activityLog.innerHTML = '';
        }

        // Reset stats
        this.updateStats();

        // Reset document preview
        if (this.elements.documentPreview) {
            this.elements.documentPreview.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-invoice"></i>
                    <span>No document being processed</span>
                </div>
            `;
        }

        // Reset orchestrator
        if (this.elements.orchestratorStatus) {
            this.elements.orchestratorStatus.textContent = 'Idle';
        }

        this.updateControls();
        this.log('System reset. Ready to start demo.', 'system');
    },

    /**
     * Step through demo one step at a time
     */
    async stepDemo() {
        if (this.state.currentStep >= DemoData.workflowSteps.length) {
            this.log('Demo complete. Reset to run again.', 'system');
            return;
        }

        this.state.mode = 'step';
        const step = DemoData.workflowSteps[this.state.currentStep];
        await this.executeStep(step);
        this.state.currentStep++;

        if (this.state.currentStep >= DemoData.workflowSteps.length) {
            await this.showFinalReport();
            this.log('Demo complete!', 'success');
        }
    },

    /**
     * Update control button states
     */
    updateControls() {
        if (this.elements.btnStart) {
            this.elements.btnStart.disabled = this.state.isRunning;
            this.elements.btnStart.innerHTML = this.state.isRunning
                ? '<i class="fas fa-spinner fa-spin"></i> Running...'
                : '<i class="fas fa-play"></i> Start Demo';
        }

        if (this.elements.btnReset) {
            this.elements.btnReset.disabled = this.state.isRunning;
        }

        if (this.elements.btnStep) {
            this.elements.btnStep.disabled = this.state.isRunning;
        }
    },

    /**
     * Update statistics display
     */
    updateStats() {
        if (this.elements.statInvoices) {
            this.elements.statInvoices.textContent = this.state.processedInvoices;
        }
        if (this.elements.statEntities) {
            this.elements.statEntities.textContent = this.state.extractedEntities;
        }
        if (this.elements.statPhase1) {
            this.elements.statPhase1.textContent = this.state.phase1Matches;
        }
        if (this.elements.statPhase2) {
            this.elements.statPhase2.textContent = this.state.phase2Complete;
        }
    },

    /**
     * Add entry to activity log
     */
    log(message, type = 'system') {
        if (!this.elements.activityLog) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;

        const time = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-message">${message}</span>
        `;

        this.elements.activityLog.appendChild(entry);
        this.elements.activityLog.scrollTop = this.elements.activityLog.scrollHeight;

        // Animate entry
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-10px)';
        requestAnimationFrame(() => {
            entry.style.transition = 'all 0.3s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        });
    },

    /**
     * Show document preview
     */
    showDocumentPreview(invoice, status = 'processing') {
        if (!this.elements.documentPreview) return;

        const data = invoice.extractedData;
        const statusColors = {
            processing: 'var(--warning)',
            extracting: 'var(--info)',
            complete: 'var(--success)'
        };

        const html = `
            <div class="document-content">
                <div class="doc-header">
                    <div class="doc-icon" style="background: ${invoice.type === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}; color: ${invoice.type === 'pdf' ? 'var(--error)' : 'var(--info)'};">
                        <i class="fas fa-${invoice.type === 'pdf' ? 'file-pdf' : 'file-image'}"></i>
                    </div>
                    <div class="doc-info">
                        <h4>${invoice.filename}</h4>
                        <span style="color: ${statusColors[status]}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </div>
                </div>
                <div class="doc-fields">
                    <div class="doc-field">
                        <span class="label">Vendor</span>
                        <span class="value ${status !== 'processing' ? 'extracted' : 'pending'}">${status !== 'processing' ? data.vendor : 'Extracting...'}</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Date</span>
                        <span class="value ${status !== 'processing' ? 'extracted' : 'pending'}">${status !== 'processing' ? data.date : 'Extracting...'}</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Amount</span>
                        <span class="value ${status !== 'processing' ? 'extracted' : 'pending'}">${status !== 'processing' ? '$' + data.amount.toLocaleString() : 'Extracting...'}</span>
                    </div>
                    <div class="doc-field">
                        <span class="label">Category</span>
                        <span class="value ${status !== 'processing' ? 'extracted' : 'pending'}">${invoice.category}</span>
                    </div>
                    ${data.attendees.length > 0 ? `
                    <div class="doc-field">
                        <span class="label">Attendees</span>
                        <span class="value ${status === 'complete' ? 'extracted' : 'pending'}">${status === 'complete' ? data.attendees.length + ' matched' : 'Pending...'}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.elements.documentPreview.innerHTML = html;

        // Animate the preview
        Animations?.pulseElement(this.elements.documentPreview, 300);
    },

    /**
     * Show agent details modal
     */
    showAgentDetails(agentName) {
        const agentInfo = {
            invoice: {
                title: 'CventInvoiceProcessorAgent',
                description: 'Reads invoices (PDF/images), extracts text and classifies documents using multimodal LLM capabilities.',
                plugins: ['Multimodal LLM Plugin'],
                capabilities: [
                    'PDF text extraction',
                    'Image processing',
                    'Document type classification',
                    'Mislabeled file detection',
                    'Content quality assessment'
                ]
            },
            entity: {
                title: 'CventEntityExtractorAgent',
                description: 'Pulls structured data including transaction dates, amounts, vendor names, and attendee information from processed documents.',
                plugins: ['Database Plugin'],
                capabilities: [
                    'Date/amount extraction',
                    'Vendor identification',
                    'Attendee name matching',
                    'Data normalization'
                ]
            },
            citi: {
                title: 'CitiConcurReconciliationAgent',
                description: 'Matches Citi bank transactions to Concur expenses using configurable matching rules (Phase 1 reconciliation).',
                plugins: ['Citi API Connector', 'Concur API Connector', 'Rule Engine'],
                capabilities: [
                    'Amount matching (within tolerance)',
                    'Date proximity validation',
                    'Vendor name fuzzy matching',
                    'MCC code alignment',
                    'Confidence scoring'
                ],
                rules: DemoData.reconciliationRules.phase1
            },
            cvent: {
                title: 'CventConcurReconciliationAgent',
                description: 'Links Concur expenses to Cvent entities, attaches supporting docs and prepares Concur-ready reports (Phase 2 reconciliation).',
                plugins: [],
                capabilities: [
                    'Phase 1 data linking',
                    'Attendee allocation',
                    'Supporting doc attachment',
                    'Policy compliance check',
                    'Report generation'
                ],
                rules: DemoData.reconciliationRules.phase2
            }
        };

        const info = agentInfo[agentName];
        if (!info) return;

        this.elements.modalTitle.textContent = info.title;

        let rulesHtml = '';
        if (info.rules) {
            rulesHtml = `
                <h4 style="margin-top: var(--spacing-md); color: var(--text-primary);">Matching Rules</h4>
                <div style="margin-top: var(--spacing-sm);">
                    ${info.rules.map(rule => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-xs) 0; border-bottom: 1px dashed var(--border-color);">
                            <div>
                                <strong style="color: var(--text-primary); font-size: 0.85rem;">${rule.name}</strong>
                                <p style="color: var(--text-muted); font-size: 0.75rem; margin: 0;">${rule.description}</p>
                            </div>
                            <span style="background: var(--primary); color: white; padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.7rem;">${rule.weight}%</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.elements.modalBody.innerHTML = `
            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-md);">${info.description}</p>

            <h4 style="color: var(--text-primary);">Plugins</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-xs); margin-top: var(--spacing-sm);">
                ${info.plugins.map(p => `<span class="plugin-tag"><i class="fas fa-plug"></i> ${p}</span>`).join('')}
            </div>

            <h4 style="margin-top: var(--spacing-md); color: var(--text-primary);">Capabilities</h4>
            <ul style="margin-top: var(--spacing-sm); padding-left: var(--spacing-lg);">
                ${info.capabilities.map(c => `<li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">${c}</li>`).join('')}
            </ul>

            ${rulesHtml}
        `;

        this.openModal();
    },

    /**
     * Show orchestrator details modal
     */
    showOrchestratorDetails() {
        this.elements.modalTitle.textContent = 'Semantic Kernel Orchestrator';

        this.elements.modalBody.innerHTML = `
            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-md);">
                The orchestrator coordinates all agent activities, ensuring sequential execution,
                managing data flow between agents, and handling retries and error recovery.
            </p>

            <h4 style="color: var(--text-primary);">Orchestration Features</h4>
            <ul style="margin-top: var(--spacing-sm); padding-left: var(--spacing-lg);">
                <li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">Multi-agent coordination with Semantic Kernel</li>
                <li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">Sequential workflow execution</li>
                <li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">Airflow integration for batch processing</li>
                <li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">Configurable retry policies</li>
                <li style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--spacing-xs);">AWS CloudWatch logging & observability</li>
            </ul>

            <h4 style="margin-top: var(--spacing-md); color: var(--text-primary);">Workflow Stages</h4>
            <div style="margin-top: var(--spacing-sm);">
                ${DemoData.workflowSteps.map((step, i) => `
                    <div style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm) 0; border-bottom: 1px dashed var(--border-color);">
                        <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; border-radius: 50%; font-size: 0.75rem; font-weight: bold;">${i + 1}</span>
                        <div>
                            <strong style="color: var(--text-primary); font-size: 0.85rem;">${step.title}</strong>
                            <p style="color: var(--text-muted); font-size: 0.75rem; margin: 0;">${step.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h4 style="margin-top: var(--spacing-md); color: var(--text-primary);">Infrastructure</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-top: var(--spacing-sm);">
                <span class="tech-badge"><i class="fab fa-aws"></i> AWS</span>
                <span class="tech-badge"><i class="fas fa-database"></i> PostgreSQL</span>
                <span class="tech-badge"><i class="fas fa-wind"></i> Airflow</span>
                <span class="tech-badge"><i class="fas fa-shield-alt"></i> Audit Trail</span>
            </div>
        `;

        this.openModal();
    },

    /**
     * Open modal
     */
    openModal() {
        this.elements.modal?.classList.add('active');
    },

    /**
     * Close modal
     */
    closeModal() {
        this.elements.modal?.classList.remove('active');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
