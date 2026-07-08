const ComponentService = require('../services/ComponentService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all components (Public)
 */
const getAllComponents = asyncHandler(async (req, res) => {
  const components = await ComponentService.getAllComponents()
  res.success(components, 'Components returned successfully')
})

/**
 * @desc Get component by ID (Public)
 */
const getComponentById = asyncHandler(async (req, res) => {
  const component = await ComponentService.getComponentById(req.params.id)
  res.success(component, 'Component returned successfully')
})

/**
 * @desc Get components by type (Public)
 */
const getComponentsByType = asyncHandler(async (req, res) => {
  const components = await ComponentService.getComponentsByType(req.params.type)
  res.success(components, 'Components returned successfully')
})

/**
 * @desc Get components by position (Public)
 */
const getComponentsByPosition = asyncHandler(async (req, res) => {
  const components = await ComponentService.getComponentsByPosition(req.params.position)
  res.success(components, 'Components returned successfully')
})

/**
 * @desc Get active components (Public)
 */
const getActiveComponents = asyncHandler(async (req, res) => {
  const components = await ComponentService.getActiveComponents()
  res.success(components, 'Components returned successfully')
})

/**
 * @desc Create a new component (Admin Only)
 */
const createComponent = asyncHandler(async (req, res) => {
  const newComponent = await ComponentService.createComponent(req.user, req.body)
  res.success(newComponent, 'Component created successfully', 201)
})

/**
 * @desc Update a component (Admin Only)
 */
const updateComponent = asyncHandler(async (req, res) => {
  const updated = await ComponentService.updateComponent(req.user, req.params.id, req.body)
  res.success(updated, 'Component updated successfully')
})

/**
 * @desc Delete a component (Admin Only)
 */
const deleteComponent = asyncHandler(async (req, res) => {
  await ComponentService.deleteComponent(req.user, req.params.id)
  res.success(null, 'Component deleted successfully')
})

module.exports = { 
  getAllComponents, 
  getComponentById, 
  getComponentsByType, 
  getComponentsByPosition, 
  getActiveComponents,
  createComponent, 
  updateComponent, 
  deleteComponent 
}
