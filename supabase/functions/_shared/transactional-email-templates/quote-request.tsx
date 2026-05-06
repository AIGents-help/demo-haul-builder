/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface QuoteRequestProps {
  name?: string
  phone?: string
  service?: string
  zip?: string
  message?: string
  source?: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}
const container = {
  margin: '0 auto',
  padding: '24px',
  maxWidth: '560px',
}
const h1 = { color: '#0D0D0D', fontSize: '24px', margin: '0 0 16px' }
const label = {
  color: '#E85D0A',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '12px 0 4px',
}
const value = { color: '#0D0D0D', fontSize: '16px', margin: '0' }
const hr = { borderColor: '#e5e5e5', margin: '20px 0' }

export const QuoteRequestEmail: React.FC<QuoteRequestProps> = ({
  name = '—',
  phone = '—',
  service = '—',
  zip = '—',
  message = '—',
  source = 'website',
}) => (
  <Html>
    <Head />
    <Preview>New quote request from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔥 New Quote Request</Heading>
        <Text style={{ color: '#55575d', fontSize: '14px', margin: 0 }}>
          Respond within 15 minutes for the best conversion.
        </Text>
        <Hr style={hr} />
        <Text style={label}>Name</Text>
        <Text style={value}>{name}</Text>
        <Text style={label}>Phone</Text>
        <Text style={value}>{phone}</Text>
        <Text style={label}>Service</Text>
        <Text style={value}>{service}</Text>
        <Text style={label}>ZIP</Text>
        <Text style={value}>{zip}</Text>
        <Text style={label}>Message</Text>
        <Text style={value}>{message}</Text>
        <Hr style={hr} />
        <Section>
          <Text style={{ color: '#888', fontSize: '12px' }}>
            Source: {source}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteRequestEmail,
  subject: (data: QuoteRequestProps) =>
    `New quote request from ${data?.name ?? 'website visitor'}`,
  displayName: 'Quote Request Notification',
  previewData: {
    name: 'John Smith',
    phone: '(484) 555-1234',
    service: 'Demolition',
    zip: '19401',
    message: 'Need a small shed torn down in the backyard.',
    source: 'website',
  },
} satisfies TemplateEntry