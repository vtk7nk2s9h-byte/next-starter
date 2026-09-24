import {
  Boxes,
  Briefcase,
  Building2,
  Code2,
  Gauge,
  LineChart,
  ShieldCheck,
  UserRound,
  Zap,
} from 'lucide-react';

import CardSection, { type CardItem } from '@/components/ui/glass-card';

// Placeholder copy throughout — the shape is right, the words are yours.

const features: CardItem[] = [
  {
    icon: Gauge,
    title: 'Live dashboards',
    description:
      'Revenue, invoices and customers update as the data lands — no refresh, no nightly batch, no stale numbers in a meeting.',
  },
  {
    icon: Zap,
    title: 'Invoice automation',
    description:
      'Draft, send and reconcile in one pass. Overdue accounts chase themselves and settle back into the ledger on payment.',
  },
  {
    icon: ShieldCheck,
    title: 'Access you control',
    description:
      'Session-backed auth with per-role permissions, so finance sees the ledger and everyone else sees only their own work.',
  },
];

const useCases: CardItem[] = [
  {
    icon: Briefcase,
    title: 'Agencies & studios',
    description:
      'Retainers, milestones and project budgets in one ledger, with per-client views you can hand over without redacting a thing.',
  },
  {
    icon: Building2,
    title: 'Finance teams',
    description:
      'Month-end close without the spreadsheet relay: one source of truth, an audit trail on every edit, exports that reconcile.',
  },
  {
    icon: UserRound,
    title: 'Independents',
    description:
      'Send a professional invoice in under a minute and know exactly what is owed, by whom, and how late it has become.',
  },
];

const services: CardItem[] = [
  {
    icon: Code2,
    title: 'Web development',
    description:
      'Production Next.js builds with the routing, auth and data layers wired up — not a template you have to finish yourself.',
    href: '#',
  },
  {
    icon: Boxes,
    title: 'Cloud infrastructure',
    description:
      'Deploys, databases and edge caching set up to scale quietly, with the monitoring already in place when traffic arrives.',
    href: '#',
  },
  {
    icon: LineChart,
    title: 'Data & analytics',
    description:
      'Dashboards that answer the questions you actually ask, built on your own data rather than a vendor’s idea of a metric.',
    href: '#',
  },
];

export function FeaturesSection() {
  return (
    <CardSection
      id="features"
      eyebrow="The product"
      title="Features"
      description="Everything the dashboard does out of the box, before you write a line of your own."
      items={features}
    />
  );
}

export function UseCasesSection() {
  return (
    <CardSection
      id="use-cases"
      eyebrow="Who it is for"
      title="Use cases"
      description="The same ledger, shaped around how different teams actually bill."
      items={useCases}
    />
  );
}

export function ServicesSection() {
  return (
    <CardSection
      id="services"
      eyebrow="What we do"
      title="Services"
      description="Where the product stops and we pick it up — built, deployed and handed over."
      items={services}
    />
  );
}
