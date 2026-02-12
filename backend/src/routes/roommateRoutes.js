const express = require('express');
const { body } = require('express-validator');
const roommateController = require('../controllers/roommateController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules for roommate profile
const roommateProfileValidation = [
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Invalid gender value'),
  body('preferredGender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'No Preference'])
    .withMessage('Invalid preferred gender value'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('preferredLocation')
    .notEmpty()
    .withMessage('Preferred location is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('lifestyle')
    .optional()
    .isIn(['Quiet', 'Moderate', 'Social', 'Party', 'Flexible'])
    .withMessage('Invalid lifestyle value'),
  body('cleanlinessLevel')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Cleanliness level must be between 1 and 5'),
  body('smoking').optional().isBoolean().withMessage('Smoking must be a boolean'),
  body('pets').optional().isBoolean().withMessage('Pets must be a boolean'),
  body('occupation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Occupation cannot exceed 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
];

// Protected routes (require authentication)
router.use(authMiddleware.protectRoute);

// Create or update roommate profile
router.post(
  '/profile',
  roommateProfileValidation,
  validate,
  roommateController.createOrUpdateProfile
);

// Get current user's profile
router.get('/me', roommateController.getMyProfile);

// Get compatible matches for current user
router.get('/matches', roommateController.getMatches);

// Get all active profiles (public but can filter by authenticated user)
router.get('/', roommateController.getAllActiveProfiles);

module.exports = router;
