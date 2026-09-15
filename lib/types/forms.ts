/**
 * Types for form data and lead management
 */

export type LeadType = 'demo_request' | 'contact' | 'newsletter'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type ServiceType = 'formation-cyber' | 'formation-ia' | 'consulting' | 'other'
export type Locale = 'fr' | 'en'

export interface LeadSource {
  pageUrl: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

export interface LeadData {
  type: LeadType
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  company?: string
  service?: ServiceType
  message?: string
  source: LeadSource
  locale: Locale
  createdAt: Date
  status: LeadStatus
}

export interface NewsletterSubscriber {
  email: string
  locale: Locale
  subscribedAt: Date
  source: string
  active: boolean
}

export interface FormSubmissionResponse {
  success: boolean
  message: string
  leadId?: string
}

export interface DemoRequestFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  service: ServiceType
  message?: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  service: ServiceType
  message: string
}

export interface NewsletterFormData {
  email: string
}
