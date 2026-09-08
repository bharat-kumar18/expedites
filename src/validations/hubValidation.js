const Joi = require("joi");


// ========================================
// CREATE HUB VALIDATION
// ========================================

const createHubSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({
            "string.empty": "Hub name is required",
            "string.min": "Hub name must be at least 2 characters",
            "string.max": "Hub name cannot exceed 150 characters",
            "any.required": "Hub name is required"
        }),


    hub_code: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Hub code is required",
            "string.min": "Hub code must be at least 3 characters",
            "string.max": "Hub code cannot exceed 50 characters",
            "any.required": "Hub code is required"
        }),


    city_id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "City ID is required",
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        }),


    address: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.empty": "Hub address is required",
            "string.min": "Hub address must be at least 5 characters",
            "any.required": "Hub address is required"
        }),


    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.empty": "Hub phone number is required",
            "string.pattern.base":
                "Enter a valid Indian mobile number",
            "any.required":
                "Hub phone number is required"
        })

});


// ========================================
// GET HUB BY ID
// ========================================

const getHubSchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "Hub ID is required",
            "string.guid": "Invalid Hub ID",
            "any.required": "Hub ID is required"
        })

});


// ========================================
// SEARCH HUB
// ========================================

const searchHubSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(1)
        .max(150)
        .required()
        .messages({
            "string.empty": "Hub name is required",
            "any.required": "Hub name is required"
        })

});


// ========================================
// FILTER HUB BY STATUS
// ========================================

const filterHubSchema = Joi.object({

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .required()
        .messages({
            "any.only":
                "Status must be ACTIVE or INACTIVE",
            "any.required":
                "Status is required"
        })

});


// ========================================
// GET HUBS BY CITY
// city_id FROM BODY
// ========================================

const getHubsByCitySchema = Joi.object({

    city_id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "City ID is required",
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        })

});


// ========================================
// UPDATE HUB
// ========================================

const updateHubSchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "Hub ID is required",
            "string.guid": "Invalid Hub ID",
            "any.required": "Hub ID is required"
        }),


    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),


    hub_code: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),


    city_id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "Invalid City ID",
            "any.required": "City ID is required"
        }),


    address: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required(),


    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Enter a valid Indian mobile number"
        })

});


// ========================================
// UPDATE HUB STATUS
// ========================================

const updateHubStatusSchema = Joi.object({

    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "Hub ID is required",
            "string.guid": "Invalid Hub ID",
            "any.required": "Hub ID is required"
        }),


    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .required()
        .messages({
            "any.only":
                "Status must be ACTIVE or INACTIVE",
            "any.required":
                "Status is required"
        })

});


module.exports = {

    createHubSchema,
    getHubSchema,
    searchHubSchema,
    filterHubSchema,
    getHubsByCitySchema,
    updateHubSchema,
    updateHubStatusSchema

};