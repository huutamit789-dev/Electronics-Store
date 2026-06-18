const UserRoleService = require('../services/UserRoleService');

/**
 * Controller handling HTTP requests related to user role and status management.
 */
const userRoleController = {
  
  /**
   * Updates the status of a specific user (e.g., 'attempt', 'approved', 'banned').
   * @param {Object} req - Express request object containing userId and status in the body.
   * @param {Object} res - Express response object.
   */
  updateUserStatus: async (req, res) => {
    try {
      const { userId, status } = req.body; 
      
      // Delegate business logic to the service layer
      const updatedUserRole = await UserRoleService.updateStatus(userId, status);
      
      // If no document is returned, the user's role record does not exist
      if (!updatedUserRole) {
        return res.status(404).json({ message: 'User role information not found' });
      }
      
      res.status(200).json({ 
        message: 'Status updated successfully', 
        data: updatedUserRole 
      });
    } catch (error) {
      // Handle server-side errors
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Retrieves the current role and status of a user by their ID.
   * @param {Object} req - Express request object containing userId in params.
   * @param {Object} res - Express response object.
   */
  getStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Fetch role details via service
      const userRole = await UserRoleService.getUserRole(userId);
      
      // Return the retrieved data
      res.status(200).json(userRole);
    } catch (error) {
      // Handle server-side errors
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userRoleController;