/**
 * CME Reconciliation Demo - Sample Data
 * This file contains mock data for demonstrating the reconciliation workflow
 */

const DemoData = {
    // Sample Cvent Invoices (documents to process)
    invoices: [
        {
            id: 'INV-001',
            filename: 'catering_invoice_hilton.pdf',
            type: 'pdf',
            vendor: 'Hilton Conference Center',
            category: 'Catering',
            rawAmount: null, // To be extracted
            extractedData: {
                vendor: 'Hilton Conference Center',
                date: '2024-01-15',
                amount: 12500.00,
                description: 'CME Event Catering - Day 1 & 2',
                attendees: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez']
            }
        },
        {
            id: 'INV-002',
            filename: 'av_equipment_rental.png',
            type: 'image',
            vendor: 'TechPro AV Solutions',
            category: 'Equipment',
            rawAmount: null,
            extractedData: {
                vendor: 'TechPro AV Solutions',
                date: '2024-01-14',
                amount: 3750.00,
                description: 'AV Equipment Rental - Projectors & Mics',
                attendees: []
            }
        },
        {
            id: 'INV-003',
            filename: 'hotel_accommodation_batch.pdf',
            type: 'pdf',
            vendor: 'Marriott Hotels',
            category: 'Accommodation',
            rawAmount: null,
            extractedData: {
                vendor: 'Marriott Hotels',
                date: '2024-01-14',
                amount: 28400.00,
                description: 'Hotel rooms - 40 attendees x 2 nights',
                attendees: ['Dr. James Wilson', 'Dr. Lisa Park', 'Dr. Robert Kim', 'Dr. Amanda Foster']
            }
        },
        {
            id: 'INV-004',
            filename: 'transportation_shuttle.jpeg',
            type: 'image',
            vendor: 'City Express Transport',
            category: 'Transportation',
            rawAmount: null,
            extractedData: {
                vendor: 'City Express Transport',
                date: '2024-01-15',
                amount: 2200.00,
                description: 'Airport shuttle service - Group transfer',
                attendees: ['Dr. Sarah Johnson', 'Dr. Michael Chen']
            }
        },
        {
            id: 'INV-005',
            filename: 'venue_rental_main_hall.pdf',
            type: 'pdf',
            vendor: 'Convention Center LLC',
            category: 'Venue',
            rawAmount: null,
            extractedData: {
                vendor: 'Convention Center LLC',
                date: '2024-01-13',
                amount: 8500.00,
                description: 'Main Conference Hall Rental - 2 days',
                attendees: []
            }
        }
    ],

    // Sample Citi Bank Transactions
    citiTransactions: [
        {
            id: 'CITI-TXN-001',
            date: '2024-01-15',
            amount: 12500.00,
            merchantName: 'HILTON CONF CTR',
            cardLast4: '4521',
            status: 'posted',
            mcc: '5812', // Restaurants
            matchedExpenseId: null
        },
        {
            id: 'CITI-TXN-002',
            date: '2024-01-14',
            amount: 3750.00,
            merchantName: 'TECHPRO AV SOLS',
            cardLast4: '4521',
            status: 'posted',
            mcc: '7394', // Equipment Rental
            matchedExpenseId: null
        },
        {
            id: 'CITI-TXN-003',
            date: '2024-01-14',
            amount: 28400.00,
            merchantName: 'MARRIOTT HTLS',
            cardLast4: '4521',
            status: 'posted',
            mcc: '7011', // Hotels
            matchedExpenseId: null
        },
        {
            id: 'CITI-TXN-004',
            date: '2024-01-15',
            amount: 2200.00,
            merchantName: 'CITY EXPR TRANS',
            cardLast4: '4521',
            status: 'posted',
            mcc: '4121', // Transportation
            matchedExpenseId: null
        },
        {
            id: 'CITI-TXN-005',
            date: '2024-01-13',
            amount: 8500.00,
            merchantName: 'CONV CTR LLC',
            cardLast4: '4521',
            status: 'posted',
            mcc: '7941', // Venues
            matchedExpenseId: null
        }
    ],

    // Sample Concur Expenses
    concurExpenses: [
        {
            id: 'EXP-001',
            reportId: 'RPT-2024-001',
            date: '2024-01-15',
            amount: 12500.00,
            category: 'Meals & Entertainment',
            vendor: 'Hilton Conference Center',
            status: 'pending_allocation',
            allocatedTo: [],
            supportingDocs: [],
            matchedTxnId: null
        },
        {
            id: 'EXP-002',
            reportId: 'RPT-2024-001',
            date: '2024-01-14',
            amount: 3750.00,
            category: 'Equipment Rental',
            vendor: 'TechPro AV',
            status: 'pending_allocation',
            allocatedTo: [],
            supportingDocs: [],
            matchedTxnId: null
        },
        {
            id: 'EXP-003',
            reportId: 'RPT-2024-001',
            date: '2024-01-14',
            amount: 28400.00,
            category: 'Lodging',
            vendor: 'Marriott',
            status: 'pending_allocation',
            allocatedTo: [],
            supportingDocs: [],
            matchedTxnId: null
        },
        {
            id: 'EXP-004',
            reportId: 'RPT-2024-001',
            date: '2024-01-15',
            amount: 2200.00,
            category: 'Transportation',
            vendor: 'City Express',
            status: 'pending_allocation',
            allocatedTo: [],
            supportingDocs: [],
            matchedTxnId: null
        },
        {
            id: 'EXP-005',
            reportId: 'RPT-2024-001',
            date: '2024-01-13',
            amount: 8500.00,
            category: 'Venue Rental',
            vendor: 'Convention Center',
            status: 'pending_allocation',
            allocatedTo: [],
            supportingDocs: [],
            matchedTxnId: null
        }
    ],

    // Cvent Event Attendees
    attendees: [
        { id: 'ATT-001', name: 'Dr. Sarah Johnson', email: 'sjohnson@hospital.com', role: 'Speaker' },
        { id: 'ATT-002', name: 'Dr. Michael Chen', email: 'mchen@medical.edu', role: 'Attendee' },
        { id: 'ATT-003', name: 'Dr. Emily Rodriguez', email: 'erodriguez@clinic.org', role: 'Attendee' },
        { id: 'ATT-004', name: 'Dr. James Wilson', email: 'jwilson@hospital.com', role: 'Moderator' },
        { id: 'ATT-005', name: 'Dr. Lisa Park', email: 'lpark@research.edu', role: 'Attendee' },
        { id: 'ATT-006', name: 'Dr. Robert Kim', email: 'rkim@medical.org', role: 'Speaker' },
        { id: 'ATT-007', name: 'Dr. Amanda Foster', email: 'afoster@hospital.com', role: 'Attendee' }
    ],

    // Demo workflow steps
    workflowSteps: [
        {
            id: 1,
            name: 'phase1',
            title: 'Phase 1 Reconciliation',
            description: 'Citi-Concur Agent matches bank transactions to Concur expenses',
            agent: 'citi',
            duration: 4000
        },
        {
            id: 2,
            name: 'extract',
            title: 'Document Processing',
            description: 'InvoiceProcessor extracts content and classifies documents',
            agent: 'invoice',
            duration: 4000
        },
        {
            id: 3,
            name: 'entities',
            title: 'Entity Extraction',
            description: 'EntityExtractor pulls dates, amounts, vendors, and attendees',
            agent: 'entity',
            duration: 3500
        },
        {
            id: 4,
            name: 'phase2',
            title: 'Phase 2 Reconciliation',
            description: 'Cvent-Concur Agent links expenses to entities and prepares reports',
            agent: 'cvent',
            duration: 4500
        }
    ],

    // Agent messages for activity log
    agentMessages: {
        invoice: [
            'Scanning document: {filename}',
            'Running OCR extraction...',
            'Classifying document type: {category}',
            'Document processed successfully',
            'Multimodal LLM analysis complete'
        ],
        entity: [
            'Parsing extracted text...',
            'Identifying vendor: {vendor}',
            'Extracting transaction date: {date}',
            'Extracting amount: ${amount}',
            'Matching attendee names...',
            'Entities stored in database'
        ],
        citi: [
            'Fetching Citi transactions...',
            'Matching transaction: {txnId}',
            'Amount match confirmed: ${amount}',
            'Date proximity validated',
            'Vendor name fuzzy match: {confidence}%',
            'Phase 1 match recorded'
        ],
        cvent: [
            'Loading Phase 1 reconciliation data...',
            'Linking to Cvent entity: {invoiceId}',
            'Attaching supporting document...',
            'Allocating to attendees...',
            'Generating expense report entry',
            'Phase 2 reconciliation complete'
        ]
    },

    // Reconciliation rules (displayed in modal)
    reconciliationRules: {
        phase1: [
            { name: 'Amount Match', description: 'Transaction amount must match within $0.01', weight: 40 },
            { name: 'Date Proximity', description: 'Transaction date within 3 business days', weight: 25 },
            { name: 'Vendor Match', description: 'Vendor name similarity > 70%', weight: 25 },
            { name: 'Category Alignment', description: 'MCC code matches expense category', weight: 10 }
        ],
        phase2: [
            { name: 'Invoice Match', description: 'Extracted invoice data matches expense', weight: 35 },
            { name: 'Attendee Allocation', description: 'Named attendees exist in Cvent roster', weight: 30 },
            { name: 'Document Quality', description: 'Supporting doc legibility > 80%', weight: 20 },
            { name: 'Policy Compliance', description: 'Expense meets corporate policy limits', weight: 15 }
        ]
    },

    // Final reconciliation report structure
    reportTemplate: {
        title: 'CME Expense Reconciliation Report',
        event: 'Annual Medical Conference 2024',
        generatedAt: null,
        summary: {
            totalExpenses: 0,
            totalAmount: 0,
            autoReconciled: 0,
            manualReviewRequired: 0,
            fullyAllocated: 0
        },
        lineItems: []
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoData;
}
