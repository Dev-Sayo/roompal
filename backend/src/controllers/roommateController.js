const RoommateProfile = require('../models/RoommateProfile');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');
const { calculateCompatibilityScore } = require('../services/matchingService');

/**
 * Create or update roommate profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      gender,
      preferredGender,
      budget,
      preferredLocation,
      lifestyle,
      cleanlinessLevel,
      smoking,
      pets,
      occupation,
      bio,
    } = req.body;

    const userId = req.user.userId;

    // Check if profile already exists
    let profile = await RoommateProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.gender = gender || profile.gender;
      profile.preferredGender = preferredGender || profile.preferredGender;
      profile.budget = budget !== undefined ? parseFloat(budget) : profile.budget;
      profile.preferredLocation = preferredLocation || profile.preferredLocation;
      profile.lifestyle = lifestyle || profile.lifestyle;
      profile.cleanlinessLevel =
        cleanlinessLevel !== undefined
          ? parseInt(cleanlinessLevel)
          : profile.cleanlinessLevel;
      profile.smoking = smoking !== undefined ? smoking : profile.smoking;
      profile.pets = pets !== undefined ? pets : profile.pets;
      profile.occupation = occupation !== undefined ? occupation : profile.occupation;
      profile.bio = bio !== undefined ? bio : profile.bio;
      profile.isActive = true; // Reactivate if updating

      await profile.save();
      await profile.populate('user', 'fullName email');

      return sendSuccessResponse(
        res,
        200,
        'Roommate profile updated successfully',
        { profile }
      );
    } else {
      // Create new profile
      const newProfile = await RoommateProfile.create({
        user: userId,
        gender,
        preferredGender: preferredGender || 'No Preference',
        budget: parseFloat(budget),
        preferredLocation,
        lifestyle: lifestyle || 'Flexible',
        cleanlinessLevel: cleanlinessLevel ? parseInt(cleanlinessLevel) : 3,
        smoking: smoking || false,
        pets: pets || false,
        occupation,
        bio,
        isActive: true,
      });

      await newProfile.populate('user', 'fullName email');

      return sendSuccessResponse(
        res,
        201,
        'Roommate profile created successfully',
        { profile: newProfile }
      );
    }
  } catch (error) {
    if (error.code === 11000) {
      return sendErrorResponse(
        res,
        409,
        'Profile already exists for this user'
      );
    }
    next(error);
  }
};

/**
 * Get current user's roommate profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const profile = await RoommateProfile.findOne({ user: userId }).populate(
      'user',
      'fullName email'
    );

    if (!profile) {
      return sendErrorResponse(res, 404, 'Roommate profile not found');
    }

    sendSuccessResponse(res, 200, 'Profile retrieved successfully', {
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active roommate profiles (excluding current user)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllActiveProfiles = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const { location, minBudget, maxBudget, lifestyle, gender } = req.query;

    // Build query
    const query = { isActive: true };

    // Exclude current user if authenticated
    if (userId) {
      query.user = { $ne: userId };
    }

    // Apply filters
    if (location) {
      query.preferredLocation = { $regex: location, $options: 'i' };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }

    if (lifestyle) {
      query.lifestyle = lifestyle;
    }

    if (gender) {
      query.gender = gender;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const profiles = await RoommateProfile.find(query)
      .populate('user', 'fullName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await RoommateProfile.countDocuments(query);

    sendSuccessResponse(res, 200, 'Profiles retrieved successfully', {
      profiles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProfiles: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get compatible roommate matches for current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getMatches = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    // Get current user's profile
    const userProfile = await RoommateProfile.findOne({ user: userId });

    if (!userProfile) {
      return sendErrorResponse(
        res,
        404,
        'Please create a roommate profile first to find matches'
      );
    }

    // Get all active profiles excluding current user
    const allProfiles = await RoommateProfile.find({
      isActive: true,
      user: { $ne: userId },
    })
      .populate('user', 'fullName email')
      .lean();

    // Calculate compatibility scores
    const matches = allProfiles
      .map((profile) => {
        const compatibilityScore = calculateCompatibilityScore(
          userProfile,
          profile
        );

        return {
          profile,
          compatibilityScore,
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore) // Sort descending
      .slice(0, limit); // Limit results

    sendSuccessResponse(res, 200, 'Matches retrieved successfully', {
      matches,
      userProfile: {
        gender: userProfile.gender,
        preferredGender: userProfile.preferredGender,
        budget: userProfile.budget,
        preferredLocation: userProfile.preferredLocation,
        lifestyle: userProfile.lifestyle,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllActiveProfiles,
  getMatches,
};
