import type { Event } from "react-big-calendar"

// Custom Object interface
type CustomObject = Record<string, string | number | boolean>

//////// Client stuff
export interface IClient {
  id: number
  created_at?: string
  updated_at?: string
  first_name: string
  last_name: string
  dob: string
  mobile: string
  email: string
  custom_fields?: Record<string, string | number | boolean | CustomObject>
}

export interface IClientForDropdown {
  id: number
  label: string
}

//////// Medical History stuff
export interface IMedicalHistory {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  custom_fields?: Record<string, string | number | boolean>
}

//////// TCM stuff
export interface ITcm {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  custom_fields?: Record<string, string | number | boolean>
}

//////// Treatments stuff
export interface ITreatment {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  date: string
  duration_minutes: number
  notes: string
  custom_fields?: Record<string, string | number | boolean>
}

//////// Appointments stuff
export interface IAppointment {
  id: number
  clientId: number
  created_at?: string
  updated_at?: string
  startTime: string
  endTime: string
  appointmentType: number
  notes: string
  customFields?: Record<string, string | number | boolean>
}

//////// Edit Form stuff
export interface IForm {
  id: string
  custom_fields?: Record<string, string | number | boolean>
}

/////// Calendar stuff
export interface ICategory {
  _id: number
  title: string
  color?: string
}
export interface ICategoryDraft {
  title: string
  color?: string
}

export interface IAppointmentInfo extends Event {
  clientId?: number
  startTime?: Date
  endTime?: Date
  notes?: string
  categoryId?: number
}

export interface AppointmentFormData {
  clientId?: number
  categoryId?: number
  startTime?: Date
  endTime?: Date
  notes?: string
}
