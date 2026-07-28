# DATABASE_SCHEMA.md — RestaurantOS Database Reference

> Database: PostgreSQL | ORM: Prisma v5.22 | Schema: `public`

---

## ENUMS

| Enum | Values |
|---|---|
| `RoleName` | ADMIN, MANAGER, CHEF, WAITER, STAFF, INVENTORY_MANAGER |
| `TableStatus` | AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE |
| `OrderStatus` | PENDING, PREPARING, READY, SERVED, COMPLETED, CANCELLED |
| `PurchaseOrderStatus` | PENDING, ORDERED, RECEIVED, CANCELLED |
| `StockTransactionType` | STOCK_IN, STOCK_OUT, ADJUSTMENT, WASTE |
| `ExpenseStatus` | PENDING, PROCESSED, PAID, REJECTED |
| `InvoiceStatus` | DRAFT, RECEIVED, VERIFIED, PAID, DISPUTED |
| `InvoiceProcessingStatus` | UPLOADED, PROCESSING, PROCESSED, FAILED |
| `PaymentMethod` | CASH, CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, DUE |
| `PaymentStatus` | UNPAID, PARTIALLY_PAID, PAID, REFUNDED |
| `UnitOfMeasure` | KG, GRAM, LITER, ML, PIECE, BOX, PACKET, PORTION |
| `WasteReason` | EXPIRED, SPOILED, COOKING_ERROR, CUSTOMER_RETURN, DAMAGE |
| `NotificationType` | INFO, WARNING, CRITICAL, ORDER_STATUS, LOW_STOCK |
| `AIPredictionType` | STOCK_DEMAND, INGREDIENT_SHORTAGE, FOOD_WASTE, PREP_TIME, MENU_PRICING |

---

## MODELS (24 Total)

### Authentication & RBAC

#### `Role`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| name | RoleName | UNIQUE |
| description | String? | |
| users | User[] | Relation |
| rolePermissions | RolePermission[] | Relation |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `Permission`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| name | String | UNIQUE |
| action | String | CREATE/READ/UPDATE/DELETE/MANAGE |
| resource | String | ORDERS/INVENTORY/EXPENSES/USERS |
| description | String? | |
| Index | (action, resource) | |

#### `RolePermission`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| roleId | String | FK → Role |
| permissionId | String | FK → Permission |
| UNIQUE | (roleId, permissionId) | |

#### `User`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| fullName | String | |
| email | String | UNIQUE |
| password | String | bcrypt hashed |
| phone | String? | |
| isActive | Boolean | default true |
| isDeleted | Boolean | Soft delete |
| deletedAt | DateTime? | |
| roleId | String | FK → Role |
| Index | (email), (roleId, isActive) | |

#### `Staff`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| userId | String | UNIQUE FK → User |
| employeeCode | String | UNIQUE |
| department | String | |
| designation | String | |
| shift | String? | MORNING/EVENING/NIGHT |
| hireDate | DateTime | |
| salary | Float? | |

#### `RefreshToken`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| userId | String | FK → User |
| token | String | UNIQUE |
| isRevoked | Boolean | default false |
| expiresAt | DateTime | |
| ipAddress / userAgent | String? | |

#### `UserSession`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| userId | String | FK → User |
| refreshTokenId | String? | FK → RefreshToken |
| ipAddress / userAgent / device / browser | String? | |
| isExpired | Boolean | default false |
| expiresAt | DateTime | |

---

### Dining & Customer Management

#### `Customer`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| fullName | String | |
| email | String? | UNIQUE |
| phone | String? | UNIQUE |
| loyaltyPoints | Int | default 0 |
| isDeleted | Boolean | Soft delete |

#### `RestaurantTable`
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | PK |
| tableNumber | String | UNIQUE |
| capacity | Int | |
| status | TableStatus | default AVAILABLE |
| isDeleted | Boolean | Soft delete |

#### `MenuCategory` / `MenuItem`
| MenuItem Fields | Type |
|---|---|
| id | String (UUID) PK |
| name | String |
| description | String? |
| price | Float |
| isAvailable | Boolean |
| categoryId | FK → MenuCategory |

#### `Order`
| Field | Type |
|---|---|
| orderNumber | String UNIQUE |
| tableId | FK → RestaurantTable |
| waiterId | FK → User (optional) |
| customerId | FK → Customer (optional) |
| status | OrderStatus (default PENDING) |
| totalAmount / taxAmount / discount / finalAmount | Float |
| isDeleted | Boolean |
| Index | (tableId, status), (status, createdAt) |

#### `OrderItem`
| Field | Type |
|---|---|
| orderId | FK → Order |
| menuItemId | FK → MenuItem |
| quantity | Int |
| price / subtotal | Float |
| notes | String? |
| UNIQUE | (orderId, menuItemId) |

#### `Payment`
| Field | Type |
|---|---|
| orderId | FK → Order |
| processedById | FK → User |
| paymentMethod | PaymentMethod |
| paymentStatus | PaymentStatus |
| amountPaid / changeGiven | Float |
| transactionId | String? UNIQUE |

---

### Recipe & Ingredient

#### `Ingredient`
| Field | Type |
|---|---|
| name | String UNIQUE |
| unit | UnitOfMeasure |
| quantity | Float (current stock) |
| minimumStock | Float |
| costPerUnit | Float |
| isActive | Boolean |

#### `Recipe` / `RecipeIngredient`
| RecipeIngredient Fields | Type |
|---|---|
| recipeId | FK → Recipe |
| ingredientId | FK → Ingredient |
| quantity | Float |
| unit | UnitOfMeasure |
| UNIQUE | (recipeId, ingredientId) |

---

### Supplier & Procurement

#### `Supplier`
| Field | Type |
|---|---|
| name | String UNIQUE |
| contactPerson | String |
| phone / email | String UNIQUE |
| address | String |
| gstNumber | String? UNIQUE |
| isActive | Boolean |

#### `PurchaseOrder`
| Field | Type |
|---|---|
| poNumber | String UNIQUE |
| supplierId | FK → Supplier |
| status | PurchaseOrderStatus |
| totalAmount | Float |
| expectedDelivery | DateTime? |
| Index | (supplierId, status) |

#### `SupplierInvoice` / `SupplierInvoiceItem`
| SupplierInvoice Fields | Type |
|---|---|
| invoiceNumber | String UNIQUE |
| supplierId | FK → Supplier |
| purchaseOrderId | FK → PurchaseOrder (optional) |
| invoiceDate | DateTime |
| subtotal / taxAmount / totalAmount | Float |
| status | InvoiceStatus |
| filePath | String? |

---

### Inventory & Stock

#### `ProductCategory` / `Product`
| Product Fields | Type |
|---|---|
| sku | String UNIQUE |
| categoryId | FK → ProductCategory |
| unit | UnitOfMeasure |
| currentStock | Float |
| minimumStock / maximumStock | Float |
| costPrice / sellingPrice | Float |

#### `Warehouse`
| Field | Type |
|---|---|
| name | String UNIQUE |
| location | String |
| manager | String? |

#### `Stock`
| Field | Type |
|---|---|
| productId | FK → Product (optional) |
| ingredientId | FK → Ingredient (optional) |
| warehouseId | FK → Warehouse |
| quantity | Float |
| UNIQUE | (productId, warehouseId), (ingredientId, warehouseId) |

#### `StockTransaction`
| Field | Type |
|---|---|
| productId / ingredientId | Optional FKs |
| warehouseId | FK → Warehouse |
| purchaseOrderId | FK → PurchaseOrder (optional) |
| type | StockTransactionType |
| quantity | Float |

#### `FoodWasteLog`
| Field | Type |
|---|---|
| ingredientId | FK → Ingredient |
| reportedById | FK → User (optional) |
| quantity | Float |
| unit | UnitOfMeasure |
| costLost | Float |
| reason | WasteReason |
| remarks | String? |

---

### Financial

#### `ExpenseCategory` / `Expense`
| Expense Fields | Type |
|---|---|
| supplierId | FK → Supplier (optional) |
| categoryId | FK → ExpenseCategory (optional) |
| purchaseOrderId | FK → PurchaseOrder (optional) |
| supplierInvoiceId | FK → SupplierInvoice (optional) |
| invoiceNumber | String? |
| invoiceDate | DateTime? |
| amount / tax / total | Float |
| status | ExpenseStatus |
| filePath / remarks | String? |
| isDeleted | Boolean |

#### `Invoice` (AI OCR)
| Field | Type |
|---|---|
| invoiceNumber | String? |
| supplierName / supplierTaxId | String? |
| clientName / clientTaxId | String? |
| invoiceDate | DateTime? |
| subtotal / taxAmount / discount / totalAmount | Float? |
| currency | String (default "USD") |
| status | InvoiceProcessingStatus |
| rawText | String? |
| errorMessage | String? |
| filePath | String |
| expenseId | FK → Expense (optional) |
| UNIQUE | (invoiceNumber, supplierName) |

#### `InvoiceItem`
| Field | Type |
|---|---|
| invoiceId | FK → Invoice |
| description | String |
| quantity / unitPrice / amount | Float |

---

### System & AI

#### `UploadedFile` / `OCRResult`
| OCRResult Fields | Type |
|---|---|
| uploadedFileId | FK → UploadedFile UNIQUE |
| rawText | String |
| extractedJSON | Json |
| confidenceScore | Float |
| status | String (default "PROCESSED") |

#### `AIPrediction`
| Field | Type |
|---|---|
| predictionType | AIPredictionType |
| inputParameters | Json |
| predictionResult | Json |
| accuracyScore | Float? |

#### `Notification`
| Field | Type |
|---|---|
| userId | FK → User |
| title / message | String |
| type | NotificationType |
| isRead | Boolean |

#### `ActivityLog`
| Field | Type |
|---|---|
| userId | FK → User (optional) |
| action | String (LOGIN/LOGOUT/CREATE/UPDATE/DELETE) |
| module | String (ORDERS/INVENTORY/AUTH) |
| description | String |
| ipAddress / userAgent | String? |

#### `AuditLog`
| Field | Type |
|---|---|
| userId | FK → User (optional) |
| action | String |
| entityName | String (Order/Product/User) |
| entityId | String |
| oldValues / newValues | Json? |
