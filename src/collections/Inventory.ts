import type { CollectionConfig } from 'payload'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'niche',
    defaultColumns: ['niche', 'dr', 'traffic', 'price', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'niche',
      type: 'select',
      options: ['SaaS', 'Finance', 'Crypto', 'Health', 'Tech', 'General'],
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'dr', type: 'number', required: true, label: 'DR (Ahrefs)', index: true },
        { name: 'traffic', type: 'number', required: true, label: 'Organic Traffic' },
        { name: 'price', type: 'number', required: true, label: 'Price (USD)' },
      ],
    },
    {
      name: 'region',
      type: 'text',
      defaultValue: 'USA',
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Domain (Hidden from Public)',
      access: {
        read: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['Available', 'Sold'],
      defaultValue: 'Available',
    },
  ],
}
