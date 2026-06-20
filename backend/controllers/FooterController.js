const FooterService = require('../services/FooterService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get active footer (Public)
 */
const getActiveFooter = asyncHandler(async (req, res) => {
  const footer = await FooterService.getActiveFooter()
  res.success(footer, 'Footer returned successfully')
})

/**
 * @desc Get footer by ID (Public)
 */
const getFooterById = asyncHandler(async (req, res) => {
  const footer = await FooterService.getFooterById(req.params.id)
  res.success(footer, 'Footer returned successfully')
})

/**
 * @desc Get all footers (Admin Only)
 */
const getAllFooters = asyncHandler(async (req, res) => {
  const footers = await FooterService.getAllFooters()
  res.success(footers, 'Footers returned successfully')
})

/**
 * @desc Create a new footer (Admin Only)
 */
const createFooter = asyncHandler(async (req, res) => {
  const newFooter = await FooterService.createFooter(req.user, req.body)
  res.success(newFooter, 'Footer created successfully', 201)
})

/**
 * @desc Update a footer (Admin Only)
 */
const updateFooter = asyncHandler(async (req, res) => {
  const updated = await FooterService.updateFooter(req.user, req.params.id, req.body)
  res.success(updated, 'Footer updated successfully')
})

/**
 * @desc Delete a footer (Admin Only)
 */
const deleteFooter = asyncHandler(async (req, res) => {
  await FooterService.deleteFooter(req.user, req.params.id)
  res.success(null, 'Footer deleted successfully')
})

module.exports = { getActiveFooter, getFooterById, getAllFooters, createFooter, updateFooter, deleteFooter }
