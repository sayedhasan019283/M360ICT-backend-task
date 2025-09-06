export interface Attendance {
  id: number;
  employee_id: number;
  date: string;  // ISO formatted date
  check_in_time: string;  // ISO formatted timestamp
  created_at?: string;  // ISO formatted timestamp
  updated_at?: string;  // ISO formatted timestamp
}
