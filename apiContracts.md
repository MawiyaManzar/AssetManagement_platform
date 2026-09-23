# AssetFlow — API Contracts Specification (Screens 1 to 6)

Version: `v1`  
Base URL: `http://localhost:3000/api/v1`  
Content-Type: `application/json`

---

## 1. Global Standards & Conventions

### 1.1 Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | `Bearer <JWT_ACCESS_TOKEN>` (Required for authenticated endpoints) |
| `Content-Type` | `string` | `application/json` |

### 1.2 Standard Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable confirmation",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 1.3 Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "DOUBLE_ALLOCATION_CONFLICT | RESOURCE_UNAVAILABLE | VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED",
    "message": "Human-readable description of error",
    "details": []
  }
}
```

---

## 2. Authentication Module (`/api/v1/auth`) — [Screen 1]

### 2.1 Register User
- **POST** `/api/v1/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "priya.shah@example.com",
  "password": "SecurePassword123!",
  "name": "Priya Shah",
  "departmentId": "uuid-optional",
  "role": "employee"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "priya.shah@example.com",
      "name": "Priya Shah",
      "role": "employee",
      "status": "active"
    },
    "tokens": {
      "accessToken": "jwt-token-string",
      "refreshToken": "refresh-token-string"
    }
  }
}
```

### 2.2 Login User
- **POST** `/api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "priya.shah@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**: Same structure as 2.1.

### 2.3 Get Current User (`/me`)
- **GET** `/api/v1/auth/me`
- **Access**: Authenticated
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "priya.shah@example.com",
    "name": "Priya Shah",
    "role": "employee",
    "department": { "id": "uuid", "name": "Engineering" }
  }
}
```

---

## 3. Dashboard Overview Module (`/api/v1/dashboard`) — [Screen 2]

### 3.1 Get Dashboard Overview & Metrics
- **GET** `/api/v1/dashboard/stats`
- **Access**: Authenticated
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "available": 128,
      "allocated": 76,
      "total": 213,
      "activeBookings": 9,
      "pendingTransfers": 3,
      "upcomingReturns": 12,
      "overdueCount": 5
    },
    "overdueAlerts": [
      {
        "assetId": "uuid",
        "assetTag": "AF-0012",
        "name": "Dell Latitude 5420",
        "custodian": "Priya Shah",
        "department": "Engineering",
        "expectedReturnDate": "2026-07-01T00:00:00.000Z",
        "daysOverdue": 7
      }
    ],
    "recentActivity": [
      {
        "id": "uuid",
        "action": "allocation",
        "title": "Laptop AF-0114 allocated to Priya Shah - IT dept",
        "timestamp": "2026-07-08T10:15:00.000Z"
      },
      {
        "id": "uuid",
        "action": "booking",
        "title": "Room R2 booking confirmed - 2:00 to 3:00 PM",
        "timestamp": "2026-07-08T09:30:00.000Z"
      },
      {
        "id": "uuid",
        "action": "maintenance",
        "title": "Projector AF-0062 maintenance resolved",
        "timestamp": "2026-07-07T16:00:00.000Z"
      }
    ]
  }
}
```

---

## 4. Organization Setup Module (`/api/v1/departments`, `/api/v1/categories`, `/api/v1/users`) — [Screen 3]

### 4.1 Departments API
- **GET** `/api/v1/departments`
  - **Query**: `status` (`active` | `inactive`)
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid",
          "name": "Engineering",
          "code": "ENG",
          "head": { "id": "uuid", "name": "Aditi Rao" },
          "parentDept": null,
          "status": "active",
          "memberCount": 42
        },
        {
          "id": "uuid",
          "name": "Field Ops (West)",
          "code": "FO-W",
          "head": { "id": "uuid", "name": "Zane Iqbal" },
          "parentDept": { "id": "uuid", "name": "Field Ops" },
          "status": "inactive",
          "memberCount": 8
        }
      ]
    }
    ```
- **POST** `/api/v1/departments`
  - **Body**: `{ "name": "Marketing", "code": "MKT", "headId": "uuid-optional", "parentDepartmentId": "uuid-optional", "status": "active" }`
- **PUT** `/api/v1/departments/:id`
- **DELETE** `/api/v1/departments/:id`

### 4.2 Asset Categories API
- **GET** `/api/v1/categories`
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid",
          "name": "Electronics",
          "code": "ELEC",
          "status": "active",
          "customFieldsSchema": []
        },
        {
          "id": "uuid",
          "name": "Furniture",
          "code": "FURN",
          "status": "active",
          "customFieldsSchema": []
        }
      ]
    }
    ```
- **POST** `/api/v1/categories`
- **PUT** `/api/v1/categories/:id`
- **DELETE** `/api/v1/categories/:id`

### 4.3 Employees / Users Directory API
- **GET** `/api/v1/users`
  - **Query**: `departmentId`, `role`, `status`, `search`
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid",
          "name": "Priya Shah",
          "email": "priya.shah@example.com",
          "role": "employee",
          "department": { "id": "uuid", "name": "Engineering" },
          "status": "active"
        }
      ]
    }
    ```
- **POST** `/api/v1/users` (Admin/Manager invites employee)
- **PUT** `/api/v1/users/:id`

---

## 5. Asset Directory & Registrations Module (`/api/v1/assets`) — [Screen 4]

### 5.1 List Assets with Filtering & Search
- **GET** `/api/v1/assets`
- **Query Parameters**:
  - `search` (string) — matches `assetTag`, `name`, `serialNumber`, `location`
  - `categoryId` (uuid)
  - `status` (`available` | `allocated` | `reserved` | `under_maintenance` | `retired`)
  - `departmentId` (uuid)
  - `page` (number, default: 1)
  - `limit` (number, default: 50)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "assetTag": "AF-0012",
      "name": "Dell Laptop",
      "category": { "id": "uuid", "name": "Electronics" },
      "status": "allocated",
      "department": { "id": "uuid", "name": "Engineering" },
      "currentHolder": { "id": "uuid", "name": "Priya Shah" },
      "location": "Bangalore",
      "serialNumber": "DL-99281-ENG",
      "condition": "good",
      "isShared": false
    },
    {
      "id": "uuid-2",
      "assetTag": "AF-0062",
      "name": "Projector",
      "category": { "id": "uuid", "name": "Electronics" },
      "status": "under_maintenance",
      "department": { "id": "uuid", "name": "Facilities" },
      "currentHolder": null,
      "location": "HQ Floor 2",
      "serialNumber": "PJ-4412-FAC",
      "condition": "fair",
      "isShared": true
    },
    {
      "id": "uuid-3",
      "assetTag": "AF-0201",
      "name": "Office Chair",
      "category": { "id": "uuid", "name": "Furniture" },
      "status": "available",
      "department": { "id": "uuid", "name": "Operations" },
      "currentHolder": null,
      "location": "Warehouse",
      "serialNumber": "CH-8812-WRH",
      "condition": "new",
      "isShared": false
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 50
  }
}
```

### 5.2 Register New Asset
- **POST** `/api/v1/assets`
- **Request Body**:
```json
{
  "assetTag": "AF-0941",
  "name": "ThinkPad X1 Carbon Gen 11",
  "categoryId": "uuid",
  "departmentId": "uuid-optional",
  "serialNumber": "SN-88301",
  "location": "Bangalore - 4th Floor IT Desk",
  "condition": "new",
  "status": "available",
  "isShared": false
}
```
- **Response (201 Created)**: Returns created asset object.

### 5.3 Get Asset by ID / Tag
- **GET** `/api/v1/assets/:id` or **GET** `/api/v1/assets/tag/:assetTag`
- **Response (200 OK)**: Complete asset entity with category, department, custodian, documents, and active allocation details.

---

## 6. Asset Allocation & Custody Transfer Module (`/api/v1/allocations`, `/api/v1/transfers`) — [Screen 5]

### 6.1 Check Asset Custody & Allocation State
- **GET** `/api/v1/allocations/asset/:assetId`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "asset": {
      "id": "uuid-1",
      "assetTag": "AF-0114",
      "name": "Dell Laptop",
      "status": "allocated"
    },
    "currentAllocation": {
      "id": "uuid-alloc-1",
      "allocatedToUser": {
        "id": "uuid-user-priya",
        "name": "Priya Shah",
        "email": "priya.shah@example.com",
        "department": "Engineering"
      },
      "allocatedAt": "2026-03-12T10:00:00.000Z",
      "status": "active"
    },
    "isDoubleAllocationBlocked": true,
    "blockReason": "Already Allocated to Priya Shah (Engineering) - Direct re-allocation is blocked - submit a transfer request below"
  }
}
```

### 6.2 Direct Asset Allocation (Available Assets Only)
- **POST** `/api/v1/allocations`
- **Conflict Rule**: If asset status is not `available`, request fails with `409 Conflict (DOUBLE_ALLOCATION_CONFLICT)`.
- **Request Body**:
```json
{
  "assetId": "uuid-available-asset",
  "allocatedToUserId": "uuid-user-arjun",
  "allocatedToDepartmentId": "uuid-department-optional",
  "expectedReturnDate": "2026-12-31T00:00:00.000Z",
  "notes": "Initial setup workstation deployment"
}
```
- **Response (201 Created)**: Returns active allocation record.

### 6.3 Submit Custody Transfer Request (Double-Allocation Resolution)
- **POST** `/api/v1/transfers`
- **Request Body**:
```json
{
  "assetId": "uuid-asset-af0114",
  "toUserId": "uuid-user-arjun",
  "reason": "Reassigned to Q3 Cloud Migration team"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-transfer-1",
    "assetId": "uuid-asset-af0114",
    "fromUser": { "id": "uuid-user-priya", "name": "Priya Shah" },
    "toUser": { "id": "uuid-user-arjun", "name": "Arjun Nair" },
    "status": "pending",
    "reason": "Reassigned to Q3 Cloud Migration team",
    "requestedAt": "2026-07-08T10:00:00.000Z"
  }
}
```

### 6.4 Resolve / Approve Transfer Request
- **PATCH** `/api/v1/transfers/:id/resolve`
- **Request Body**:
```json
{
  "action": "approved", // "approved" | "rejected"
  "approvalNotes": "Approved by IT Department Head"
}
```
- **Response (200 OK)**: Updates custody, marks old allocation `transferred`, creates new active allocation, and logs audit trail.

### 6.5 Get Asset Allocation History & Audit Trail
- **GET** `/api/v1/allocations/asset/:assetId/history`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "date": "2026-03-12T10:00:00.000Z",
      "action": "Allocated to Priya Shah",
      "details": "Department: Engineering • Tag AF-0114",
      "type": "allocation"
    },
    {
      "id": "uuid",
      "date": "2026-01-04T14:30:00.000Z",
      "action": "Returned by Arjun Nair",
      "details": "Condition: Good • Cleared IT audit check",
      "type": "return"
    },
    {
      "id": "uuid",
      "date": "2025-11-15T09:00:00.000Z",
      "action": "Initial Procurement & Check-in",
      "details": "Added by IT Operations • Warranty active until 2028",
      "type": "system"
    }
  ]
}
```

---

## 7. Resource Booking Module (`/api/v1/bookings`) — [Screen 6]

### 7.1 List Shared / Bookable Resources
- **GET** `/api/v1/bookings/resources`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-r2",
      "assetTag": "RES-CONF-R2",
      "name": "Conference room R2 - HQ Floor 2",
      "capacity": "12 people",
      "location": "HQ Floor 2",
      "isShared": true
    },
    {
      "id": "uuid-r1",
      "assetTag": "RES-CONF-R1",
      "name": "Conference room R1 - HQ Floor 1",
      "capacity": "8 people",
      "location": "HQ Floor 1",
      "isShared": true
    },
    {
      "id": "uuid-proj-a",
      "assetTag": "RES-PROJ-A",
      "name": "Portable Projector Hub A",
      "capacity": "Equipment",
      "location": "HQ Floor 2 Storage",
      "isShared": true
    }
  ]
}
```

### 7.2 Get Bookings for Resource by Date
- **GET** `/api/v1/bookings`
- **Query Parameters**:
  - `resourceId` (uuid, required)
  - `date` (ISO date string `YYYY-MM-DD`, required)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-b1",
      "resourceId": "uuid-r2",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "Booked - Procurement Team - 9 to 10",
      "bookedBy": { "id": "uuid", "name": "Sarah Jenkins" },
      "department": "Procurement",
      "status": "confirmed"
    },
    {
      "id": "uuid-b2",
      "resourceId": "uuid-r2",
      "startTime": "10:00",
      "endTime": "11:00",
      "title": "Requested 9:30 to 10:30 : conflict - slot 2 unavailable",
      "bookedBy": { "id": "uuid", "name": "Aditi Rao" },
      "department": "Engineering",
      "status": "conflict",
      "conflictReason": "Overlaps with 09:00–10:00 Procurement Team booking."
    },
    {
      "id": "uuid-b3",
      "resourceId": "uuid-r2",
      "startTime": "13:00",
      "endTime": "14:00",
      "title": "Booked - Engineering Sprint Review - 1 to 2",
      "bookedBy": { "id": "uuid", "name": "Arjun Nair" },
      "department": "Engineering",
      "status": "confirmed"
    }
  ]
}
```

### 7.3 Create Resource Booking (with Conflict Validation)
- **POST** `/api/v1/bookings`
- **Request Body**:
```json
{
  "resourceId": "uuid-r2",
  "date": "2026-07-08",
  "startTime": "11:00",
  "endTime": "12:00",
  "title": "Design Review with UX Team",
  "department": "Engineering"
}
```
- **Conflict Handling**:
  - If no time overlap exists with existing confirmed bookings:
    - **Status (201 Created)**: Returns booking with `status: "confirmed"`.
  - If a time overlap exists:
    - Returns **409 Conflict** with:
    ```json
    {
      "success": false,
      "error": {
        "code": "RESOURCE_SLOT_CONFLICT",
        "message": "Time conflict detected: Slot overlaps with an existing confirmed reservation (09:00 - 10:00 Procurement Team)."
      }
    }
    ```

### 7.4 Cancel Resource Booking
- **DELETE** `/api/v1/bookings/:id` or **PATCH** `/api/v1/bookings/:id/cancel`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```
