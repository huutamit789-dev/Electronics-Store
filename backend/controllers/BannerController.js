const BannerService = require('../services/BannerService')
const { asyncHandler } = require('../middleware/asyncHandler')

/**
 * @desc Get all banners (Public)
 */
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await BannerService.getAllBanners()
  res.success(banners, 'Banners returned successfully')
})

/**
 * @desc Get banner by ID (Public)
 */
const getBannerById = asyncHandler(async (req, res) => {
  const banner = await BannerService.getBannerById(req.params.id)
  res.success(banner, 'Banner returned successfully')
})

/**
 * @desc Get active banners by position (Public)
 */
const getActiveBannersByPosition = asyncHandler(async (req, res) => {
  const banners = await BannerService.getActiveBannersByPosition(req.params.position)
  res.success(banners, 'Banners returned successfully')
})

/**
 * @desc Create a new banner (Admin Only)
 */
const createBanner = asyncHandler(async (req, res) => {
  const newBanner = await BannerService.createBanner(req.user, req.body)
  res.success(newBanner, 'Banner created successfully', 201)
})

/**
 * @desc Update a banner (Admin Only)
 */
const updateBanner = asyncHandler(async (req, res) => {
  const updated = await BannerService.updateBanner(req.user, req.params.id, req.body)
  res.success(updated, 'Banner updated successfully')
})

/**
 * @desc Delete a banner (Admin Only)
 */
const deleteBanner = asyncHandler(async (req, res) => {
  await BannerService.deleteBanner(req.user, req.params.id)
  res.success(null, 'Banner deleted successfully')
})

module.exports = { getAllBanners, getBannerById, getActiveBannersByPosition, createBanner, updateBanner, deleteBanner }
