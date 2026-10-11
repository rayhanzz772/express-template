const { z } = require('zod')

const createRoleSchema = z.object({
  code: z
    .string({ required_error: 'Role code is required' })
    .trim()
    .min(1, 'Role code is required')
    .max(50, 'Role code must be at most 50 characters')
    .transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, 'Role name is required').max(100),
  description: z.string().trim().max(255).optional().or(z.literal('')),
  status: z.boolean().default(true)
})

const updateRoleSchema = z
  .object({
    name: z.string().trim().min(1, 'Role name is required').max(100).optional(),
    description: z.string().trim().max(255).optional().or(z.literal('')),
    status: z.boolean().optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided'
  })

const updateRolePermissionsSchema = z.object({
  permission_ids: z.array(z.string().trim().min(1)).default([])
})

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  updateRolePermissionsSchema
}
