module.exports = {
  Footer: {
    type: 'object',
    required: ['company_name'],
    properties: {
      company_name: { type: 'string', example: 'Electronics Store' },
      company_description: { type: 'string', example: 'Your trusted electronics retailer' },
      policy_title: { type: 'string', example: 'Policies' },
      policies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Privacy Policy' },
            link: { type: 'string', example: '/privacy' }
          }
        }
      },
      contact_title: { type: 'string', example: 'Contact Us' },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            icon: { type: 'string', example: 'phone' },
            text: { type: 'string', example: '+1 234 567 890' }
          }
        }
      },
      is_active: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  }
};
