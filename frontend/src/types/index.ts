// ══════════════════════════════════════════════════════════════════
// AssetFlow Shared TypeScript Types & API Contracts
// ══════════════════════════════════════════════════════════════════

/* ── 1. User & Role Enums ─────────────────────────────────────── */
export type UserRole = 'admin' | 'asset_manager' | 'department_head' | 'employee';
export type UserStatus = 'active' | 'inactive';

/* ── 2. Master Setup Enums ────────────────────────────────────── */
export type DepartmentStatus = 'active' | 'inactive';
export type CategoryStatus = 'active' | 'inactive';

/* ── 3. Asset Lifecycle & Condition Enums ─────────────────────── */
export type AssetStatus =
  | 'available'
  | 'allocated'
  | 'reserved'
  | 'under_maintenance'
  | 'lost'
  | 'retired'
  | 'disposed';

export type AssetCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged';

/* ── 4. Allocation & Transfer Enums ───────────────────────────── */
export type AllocationStatus = 'active' | 'returned' | 'transferred';
export type TransferStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

/* ── 5. Booking & Maintenance Enums ──────────────────────────── */
export type BookingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'technician_assigned'
  | 'in_progress'
  | 'resolved'
  | 'cancelled';

/* ── 6. Audit & Discrepancy Enums ────────────────────────────── */
export type AuditCycleStatus = 'draft' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type VerificationStatus = 'pending' | 'verified' | 'missing' | 'damaged';
export type DiscrepancyType =
  | 'missing_asset'
  | 'damaged_asset'
  | 'location_mismatch'
  | 'unauthorized_holder';
export type DiscrepancyResolutionStatus =
  | 'unresolved'
  | 'investigating'
  | 'asset_found'
  | 'marked_lost'
  | 'repaired'
  | 'written_off';

/* ── 7. Notification Enums ────────────────────────────────────── */
export type NotificationType =
  | 'asset_assigned'
  | 'maintenance_approved'
  | 'maintenance_rejected'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'transfer_approved'
  | 'transfer_requested'
  | 'overdue_return_alert'
  | 'audit_discrepancy_flagged'
  | 'general_system';

// ══════════════════════════════════════════════════════════════════
// Entities & Data Models
// ══════════════════════════════════════════════════════════════════

/* ── User & Auth ──────────────────────────────────────────────── */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string | null;
  department?: Department | null;
  jobTitle?: string | null;
  phone?: string | null;
  status: UserStatus;
  photoUrl?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthUser = User;

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/* ── Departments (Organization Setup - Tab A) ─────────────────── */
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  headId?: string | null;
  head?: User | null;
  parentDepartmentId?: string | null;
  parentDepartment?: Department | null;
  subDepartments?: Department[];
  status: DepartmentStatus;
  employeeCount?: number;
  assetCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  headId?: string;
  parentDepartmentId?: string;
  status?: DepartmentStatus;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

/* ── Asset Categories (Organization Setup - Tab B) ────────────── */
export interface CustomFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required?: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  customFieldsSchema: CustomFieldDefinition[];
  status: CategoryStatus;
  assetCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetCategoryDto {
  name: string;
  code: string;
  description?: string;
  customFieldsSchema?: CustomFieldDefinition[];
  status?: CategoryStatus;
}

export type UpdateAssetCategoryDto = Partial<CreateAssetCategoryDto>;

/* ── Assets (Asset Directory & Registration) ──────────────────── */
export interface AssetDocument {
  name: string;
  url: string;
  size?: number;
  uploadedAt?: string;
}

export interface Asset {
  id: string;
  assetTag: string; // e.g. AF-0001
  name: string;
  categoryId: string;
  category?: AssetCategory;
  serialNumber?: string | null;
  model?: string | null;
  brand?: string | null;
  acquisitionDate?: string | null;
  acquisitionCost?: string | number | null;
  status: AssetStatus;
  condition: AssetCondition;
  location: string;
  departmentId?: string | null;
  department?: Department | null;
  currentHolderId?: string | null;
  currentHolder?: User | null;
  isShared: boolean;
  qrCode?: string | null;
  imageUrl?: string | null;
  documents: AssetDocument[];
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AssetWithRelations extends Asset {
  allocations?: AssetAllocation[];
  transfers?: AssetTransfer[];
  maintenanceRequests?: MaintenanceRequest[];
  bookings?: ResourceBooking[];
}

export interface CreateAssetDto {
  name: string;
  categoryId: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  acquisitionDate?: string;
  acquisitionCost?: number;
  condition?: AssetCondition;
  location: string;
  departmentId?: string;
  currentHolderId?: string;
  isShared?: boolean;
  imageUrl?: string;
  documents?: AssetDocument[];
  customFields?: Record<string, unknown>;
}

export type UpdateAssetDto = Partial<CreateAssetDto> & {
  status?: AssetStatus;
};

export interface AssetFilterParams {
  search?: string;
  categoryId?: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  departmentId?: string;
  location?: string;
  isShared?: boolean;
  holderId?: string;
  page?: number;
  limit?: number;
}

/* ── Asset Allocations & Transfer Requests ────────────────────── */
export interface AssetAllocation {
  id: string;
  assetId: string;
  asset?: Asset;
  allocatedToUserId?: string | null;
  allocatedToUser?: User | null;
  allocatedToDepartmentId?: string | null;
  allocatedToDepartment?: Department | null;
  allocatedByUserId?: string | null;
  allocatedByUser?: User | null;
  allocatedAt: string;
  expectedReturnDate?: string | null;
  actualReturnDate?: string | null;
  status: AllocationStatus;
  notes?: string | null;
  returnCondition?: AssetCondition | null;
  returnNotes?: string | null;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllocationDto {
  assetId: string;
  allocatedToUserId?: string;
  allocatedToDepartmentId?: string;
  expectedReturnDate?: string;
  notes?: string;
}

export interface ReturnAssetDto {
  returnCondition: AssetCondition;
  returnNotes?: string;
}

export interface AssetTransfer {
  id: string;
  assetId: string;
  asset?: Asset;
  fromUserId?: string | null;
  fromUser?: User | null;
  toUserId?: string | null;
  toUser?: User | null;
  fromDepartmentId?: string | null;
  fromDepartment?: Department | null;
  toDepartmentId?: string | null;
  toDepartment?: Department | null;
  requestedByUserId: string;
  requestedByUser?: User;
  approvedByUserId?: string | null;
  approvedByUser?: User | null;
  status: TransferStatus;
  reason: string;
  approvalNotes?: string | null;
  requestedAt: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferRequestDto {
  assetId: string;
  toUserId?: string;
  toDepartmentId?: string;
  reason: string;
}

export interface ReviewTransferDto {
  status: 'approved' | 'rejected';
  approvalNotes?: string;
}

/* ── Resource Bookings ────────────────────────────────────────── */
export interface ResourceBooking {
  id: string;
  assetId: string;
  asset?: Asset;
  userId: string;
  user?: User;
  departmentId?: string | null;
  department?: Department | null;
  title: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  status: BookingStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  assetId: string;
  title: string;
  startTime: string;
  endTime: string;
  departmentId?: string;
  purpose?: string;
}

export interface BookingOverlapCheckDto {
  assetId: string;
  startTime: string;
  endTime: string;
  excludeBookingId?: string;
}

/* ── Maintenance Requests ─────────────────────────────────────── */
export interface MaintenanceRequest {
  id: string;
  assetId: string;
  asset?: Asset;
  requestedByUserId: string;
  requestedByUser?: User;
  approvedByUserId?: string | null;
  approvedByUser?: User | null;
  technicianId?: string | null;
  technician?: User | null;
  technicianName?: string | null;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  issueDescription: string;
  photoUrls: string[];
  estimatedCost?: string | number | null;
  actualCost?: string | number | null;
  repairNotes?: string | null;
  rejectionReason?: string | null;
  scheduledDate?: string | null;
  completedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestDto {
  assetId: string;
  priority: MaintenancePriority;
  issueDescription: string;
  photoUrls?: string[];
}

export interface ReviewMaintenanceDto {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  estimatedCost?: number;
  scheduledDate?: string;
}

export interface UpdateMaintenanceStatusDto {
  status: MaintenanceStatus;
  technicianId?: string;
  technicianName?: string;
  actualCost?: number;
  repairNotes?: string;
}

/* ── Audit Cycles & Discrepancies ─────────────────────────────── */
export interface AuditCycle {
  id: string;
  name: string;
  scopeDepartmentId?: string | null;
  scopeDepartment?: Department | null;
  scopeLocation?: string | null;
  startDate: string;
  endDate: string;
  status: AuditCycleStatus;
  createdByUserId: string;
  createdByUser?: User;
  notes?: string | null;
  completedAt?: string | null;
  auditors?: User[];
  itemCount?: number;
  verifiedCount?: number;
  missingCount?: number;
  damagedCount?: number;
  discrepancyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuditCycleDto {
  name: string;
  scopeDepartmentId?: string;
  scopeLocation?: string;
  startDate: string;
  endDate: string;
  auditorIds: string[];
  notes?: string;
}

export interface AuditItem {
  id: string;
  auditCycleId: string;
  assetId: string;
  asset?: Asset;
  expectedLocation?: string | null;
  actualLocation?: string | null;
  expectedHolderId?: string | null;
  expectedHolder?: User | null;
  actualHolderId?: string | null;
  actualHolder?: User | null;
  verificationStatus: VerificationStatus;
  verifiedByUserId?: string | null;
  verifiedByUser?: User | null;
  verifiedAt?: string | null;
  notes?: string | null;
  condition?: AssetCondition | null;
  discrepancies?: AuditDiscrepancy[];
  createdAt: string;
  updatedAt: string;
}

export interface VerifyAuditItemDto {
  verificationStatus: VerificationStatus;
  actualLocation?: string;
  actualHolderId?: string;
  condition?: AssetCondition;
  notes?: string;
}

export interface AuditDiscrepancy {
  id: string;
  auditCycleId: string;
  auditItemId: string;
  auditItem?: AuditItem;
  assetId: string;
  asset?: Asset;
  discrepancyType: DiscrepancyType;
  description: string;
  resolutionStatus: DiscrepancyResolutionStatus;
  resolutionNotes?: string | null;
  resolvedByUserId?: string | null;
  resolvedByUser?: User | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResolveDiscrepancyDto {
  resolutionStatus: DiscrepancyResolutionStatus;
  resolutionNotes: string;
}

/* ── Activity Logs & Audit Trail ──────────────────────────────── */
export interface ActivityLog {
  id: string;
  userId?: string | null;
  user?: User | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

/* ── Notifications ────────────────────────────────────────────── */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  readAt?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

/* ── Dashboard & Analytics Models ─────────────────────────────── */
export interface DashboardKpis {
  assetsAvailable: number;
  assetsAllocated: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: number;
}

export interface AssetUtilizationStat {
  categoryId: string;
  categoryName: string;
  totalAssets: number;
  allocatedAssets: number;
  availableAssets: number;
  utilizationRate: number; // percentage 0-100
}

export interface MaintenanceTrendStat {
  month: string;
  requestCount: number;
  totalCost: number;
  avgResolutionDays: number;
}

export interface DepartmentAllocationSummary {
  departmentId: string;
  departmentName: string;
  assetCount: number;
  activeAllocations: number;
  overdueAllocations: number;
}

export interface BookingHeatmapSlot {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  hour: number;      // 0 - 23
  bookingCount: number;
}

/* ── API Response Wrappers ────────────────────────────────────── */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | Array<{ field: string; message: string }>;
}

/* ── Generic UI helpers ───────────────────────────────────────── */
export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  colorVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  timestamp?: string;
}
