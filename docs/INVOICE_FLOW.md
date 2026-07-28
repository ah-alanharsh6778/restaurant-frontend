# INVOICE_FLOW.md — RestaurantOS Invoice & OCR AI Pipeline

## Overview

RestaurantOS has two invoice-related modules:
1. **`/api/invoices`** — AI OCR pipeline for PDF/image vendor invoices
2. **`/api/expenses/upload`** — Batch OCR upload (up to 20 files) that creates Expenses automatically

---

## Module 1: AI OCR Invoice Pipeline (`/api/invoices`)

### Upload & Process (Single File)

```
Client (ADMIN or MANAGER):
  POST /api/invoices/upload
  Content-Type: multipart/form-data
  Body: { file: PDF/PNG/JPEG }

↓

Multer saves file to:
  E:/restaurant-backend/uploads/invoices/inv-<timestamp>-<random>.<ext>

↓

invoiceController.uploadInvoice()
  → invoiceService.uploadInvoice(file, req.user)

↓

InvoiceService:
  1. Save Invoice record { status: UPLOADED, filePath }
  2. Start async OCR processing:
     a. OCR Engine → rawText extraction
        - pdf-parse for PDFs
        - Fallback text extractor for images
     b. AI Parser → parse rawText to structured DTO
        - Try AI microservice call (timeout)
        - Fallback: regex/rule-based extraction
     c. Parse result: { invoiceNumber, supplierName, supplierTaxId, clientName,
                        clientTaxId, invoiceDate, subtotal, taxAmount, totalAmount,
                        currency, items[] }
  3. Duplicate check:
     UNIQUE(invoiceNumber, supplierName) → if exists, log WARNING, skip
  4. Update Invoice record:
     { status: PROCESSED, rawText, invoiceNumber, supplierName, totalAmount, ... }
  5. Create Expense record (linked):
     { amount, tax, total, invoiceNumber, invoiceDate, supplierId?, categoryId?, filePath }

↓

Response:
  { success: true, data: { invoice: { id, status, invoiceNumber, ... }, expense: { id } } }
```

### Re-process Failed Invoice

```
POST /api/invoices/:id/process    — Process uploaded (not yet processed)
POST /api/invoices/:id/reprocess  — Re-run OCR on already processed invoice
```

### Invoice CRUD

```
GET  /api/invoices          — List with pagination
GET  /api/invoices/:id      — Get single invoice with items[]
DELETE /api/invoices/:id    — Delete invoice
```

---

## Module 2: Expense Upload (Batch OCR) (`/api/expenses/upload`)

```
Client:
  POST /api/expenses/upload
  Content-Type: multipart/form-data
  Body: { invoices: [file1, file2, ..., file20] }

↓

Multer processes up to 20 files simultaneously

↓

expenseController.uploadInvoices()
  → For each file:
     1. Run same OCR + AI pipeline as Module 1
     2. Duplicate detection per file
     3. Create Invoice record
     4. Create Expense record

↓

Response:
  {
    success: true,
    processed: N,
    duplicates: M,
    failed: K,
    results: [ { filename, invoiceId, expenseId, status } ]
  }
```

---

## OCR Engine Architecture

```
src/modules/invoice/
├── invoice.controller.js     # Route handlers
├── invoice.service.js        # Orchestration + duplicate detection
├── invoice.repository.js     # Prisma queries
├── invoice.routes.js         # Routes + auth
└── invoice.validation.js     # Multer config + file type validation

src/modules/expense/
└── (also contains OCR upload logic for batch processing)
```

### OCR Providers (by priority)
1. AI Microservice (`/ai-service/`) — optional external service
2. pdf-parse — for PDF text extraction
3. Fallback rule-based extractor — regex patterns for common invoice formats

### AI Parser Output (InvoiceDTO)
```json
{
  "invoiceNumber": "INV-001",
  "supplierName": "Acme Corp",
  "supplierTaxId": "GST123",
  "clientName": "Restaurant XYZ",
  "clientTaxId": null,
  "invoiceDate": "2024-01-15T00:00:00Z",
  "subtotal": 1000.00,
  "taxAmount": 180.00,
  "discount": 0,
  "totalAmount": 1180.00,
  "currency": "USD",
  "items": [
    { "description": "Fresh Tomatoes", "quantity": 10, "unitPrice": 50, "amount": 500 },
    { "description": "Olive Oil", "quantity": 5, "unitPrice": 100, "amount": 500 }
  ]
}
```

---

## Database Models Involved

```
Invoice (AI processed)
  ├── InvoiceItem[] (extracted line items)
  └── Expense (auto-created)
       └── Supplier? (linked if matched)

UploadedFile
  └── OCRResult (raw text + extracted JSON + confidence score)
```

---

## Duplicate Detection Logic

```javascript
// Invoice uniqueness: UNIQUE(invoiceNumber, supplierName)
const existing = await prisma.invoice.findFirst({
  where: { invoiceNumber, supplierName }
});

if (existing) {
  log.warn('Duplicate invoice detected! Blocking.');
  // Returns reference to existing invoice instead of creating new
}
```

---

## Frontend Invoice Module

### File: `src/pages/invoices/InvoicesPage.jsx`
- Upload interface for single invoice
- List processed invoices with status badges
- View extracted data (line items, amounts)
- Delete invoice option

### File: `src/services/invoice.service.js`
```javascript
uploadInvoice(formData)         // POST /invoices/upload
processInvoice(id)              // POST /invoices/:id/process
reprocessInvoice(id)           // POST /invoices/:id/reprocess
getAllInvoices()                // GET /invoices
getInvoiceById(id)             // GET /invoices/:id
deleteInvoice(id)              // DELETE /invoices/:id
exportRegister()               // GET /expenses/export (Excel download)
```

### File: `src/pages/expenses/ExpensesDashboard.jsx`
- Batch upload interface (up to 20 files)
- Manual expense creation form
- Expense list with status/category filters
- Export to Excel button

---

## Status Lifecycle

### Invoice Processing Status
```
UPLOADED → PROCESSING → PROCESSED
                      ↘ FAILED (can reprocess)
```

### Expense Status
```
PENDING → PROCESSED → PAID → REJECTED
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Unsupported file type | 400 Bad Request from Multer validation |
| File too large | 400 Bad Request |
| AI service timeout | Fallback to regex extractor, log WARN |
| Duplicate invoice | Log WARN, return existing invoice reference |
| OCR extraction failure | Invoice status → FAILED, errorMessage set |
| Missing required fields after OCR | Invoice still created with available data |
