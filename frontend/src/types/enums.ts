export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum WorkshopTag {
  POTTERY = 'pottery',
  EMBROIDERY = 'embroidery',
  PAPER_CUTTING = 'paper_cutting',
  WOOD_CARVING = 'wood_carving',
  TIE_DYE = 'tie_dye',
  LACQUER = 'lacquer',
  CALLIGRAPHY = 'calligraphy',
  TEA_CEREMONY = 'tea_ceremony',
}

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export enum WorkshopStatus {
  OPEN = 'open',
  PAUSED = 'paused',
  CLOSED = 'closed',
}

export const bookingStatusText: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: '待确认',
  [BookingStatus.CONFIRMED]: '已确认',
  [BookingStatus.COMPLETED]: '已完成',
  [BookingStatus.CANCELLED]: '已取消',
  [BookingStatus.NO_SHOW]: '缺席',
};

export const workshopTagText: Record<WorkshopTag, string> = {
  [WorkshopTag.POTTERY]: '陶艺',
  [WorkshopTag.EMBROIDERY]: '刺绣',
  [WorkshopTag.PAPER_CUTTING]: '剪纸',
  [WorkshopTag.WOOD_CARVING]: '木雕',
  [WorkshopTag.TIE_DYE]: '扎染',
  [WorkshopTag.LACQUER]: '漆器',
  [WorkshopTag.CALLIGRAPHY]: '书法',
  [WorkshopTag.TEA_CEREMONY]: '茶艺',
};

export const workshopTagOptions = Object.entries(workshopTagText).map(([value, text]) => ({ value: value as WorkshopTag, text }));

