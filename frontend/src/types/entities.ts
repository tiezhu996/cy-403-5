import { BookingStatus, UserRole, WorkshopStatus, WorkshopTag } from './enums';

export interface User {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
}

export interface Workshop {
  id: number;
  name: string;
  description: string;
  address: string;
  coverImage: string;
  tags: WorkshopTag[];
  instructorId: number;
  instructor?: User;
  status: WorkshopStatus;
  rating: number;
  courses?: Course[];
}

export interface CourseScheduleRule {
  weekdays: number[];
  slots: string[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  price: number;
  maxParticipants: number;
  workshopId: number;
  workshop?: Workshop;
  instructorId: number;
  instructor?: User;
  scheduleRule: CourseScheduleRule;
  coverImage: string;
  reviews?: Review[];
}

export interface Booking {
  id: number;
  bookingNo: string;
  courseId: number;
  course?: Course;
  studentId: number;
  student?: User;
  bookingDate: string;
  timeSlot: string;
  peopleCount: number;
  status: BookingStatus;
  remark?: string;
  review?: Review;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  images?: string[];
  bookingId: number;
  studentId: number;
  student?: User;
  courseId: number;
  course?: Course;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

