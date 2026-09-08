const Joi = require("joi");


// ========================================
// CREATE CITY VALIDATION
// ========================================

const createCitySchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "City name is required",
            "string.min": "City name must be at least 2 characters",
            "string.max": "City name cannot exceed 100 characters",
            "any.required": "City name is required"
        }),

    state: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "State is required",
            "string.min": "State must be at least 2 characters",
            "string.max": "State cannot exceed 100 characters",
            "any.required": "State is required"
        }),

    country: Joi.string()
        .trim()
        .max(100)
        .default("India")

});


// ========================================
// UPDATE CITY VALIDATION
// ========================================

const updateCitySchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "City ID is required",
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        }),

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "City name is required",
            "any.required": "City name is required"
        }),

    state: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "State is required",
            "any.required": "State is required"
        }),

    country: Joi.string()
        .trim()
        .max(100)
        .default("India")

});


// ========================================
// GET CITY VALIDATION
// ========================================

const getCitySchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "City ID is required",
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        })

});


// ========================================
// SEARCH CITY VALIDATION
// ========================================

const searchCitySchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            "string.empty": "City name is required",
            "any.required": "City name is required"
        })

});


// ========================================
// FILTER CITY VALIDATION
// ========================================

const filterCitySchema = Joi.object({

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .required()
        .messages({
            "any.only": "Status must be ACTIVE or INACTIVE",
            "any.required": "Status is required"
        })

});


// ========================================
// CITY STATUS VALIDATION
// ========================================

const updateCityStatusSchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "City ID is required",
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        }),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .required()
        .messages({
            "any.only": "Status must be ACTIVE or INACTIVE",
            "any.required": "Status is required"
        })

});


module.exports = {
    createCitySchema,
    updateCitySchema,
    getCitySchema,
    searchCitySchema,
    filterCitySchema,
    updateCityStatusSchema
};