const {
    createCityService,
    getCitiesService,
    getCityService,
    searchCityService,
    filterCityService,
    updateCityService,
    updateCityStatusService
} = require("../services/cityService");


const {
    createCitySchema,
    updateCitySchema,
    getCitySchema,
    searchCitySchema,
    filterCitySchema,
    updateCityStatusSchema
} = require("../validations/cityValidation");


// ========================================
// CREATE CITY
// ========================================

const createCity = async (req, res) => {

    try {

        const {
            error,
            value
        } = createCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const city =
            await createCityService(value);


        return res.status(201).json({

            success: true,

            message:
                "City created successfully",

            data: city

        });

    } catch (error) {

        console.error(
            "Create city error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// GET ALL CITIES
// ========================================

const getCities = async (req, res) => {

    try {

        const cities =
            await getCitiesService();


        return res.status(200).json({

            success: true,

            message:
                "Cities fetched successfully",

            count: cities.length,

            data: cities

        });

    } catch (error) {

        console.error(
            "Get cities error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// GET ONE CITY
// ID FROM BODY
// ========================================

const getCity = async (req, res) => {

    try {

        const {
            error,
            value
        } = getCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const city =
            await getCityService(
                value.id
            );


        return res.status(200).json({

            success: true,

            message:
                "City fetched successfully",

            data: city

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// SEARCH CITY
// NAME FROM BODY
// ========================================

const searchCity = async (req, res) => {

    try {

        const {
            error,
            value
        } = searchCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const cities =
            await searchCityService(
                value.name
            );


        return res.status(200).json({

            success: true,

            message:
                "City search completed",

            count: cities.length,

            data: cities

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// FILTER CITIES
// STATUS FROM BODY
// ========================================

const filterCity = async (req, res) => {

    try {

        const {
            error,
            value
        } = filterCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const cities =
            await filterCityService(
                value.status
            );


        return res.status(200).json({

            success: true,

            message:
                "Cities filtered successfully",

            count: cities.length,

            data: cities

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// UPDATE CITY
// ID FROM BODY
// ========================================

const updateCity = async (req, res) => {

    try {

        const {
            error,
            value
        } = updateCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const {
            id,
            name,
            state,
            country
        } = value;


        const city =
            await updateCityService(
                id,
                {
                    name,
                    state,
                    country: country || "India"
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "City updated successfully",

            data: city

        });

    } catch (error) {

        console.error(
            "Update city error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// UPDATE CITY STATUS
// ID + STATUS FROM BODY
// ========================================

const updateCityStatus = async (req, res) => {

    try {

        const {
            error,
            value
        } = updateCityStatusSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const updatedCity =
            await updateCityStatusService(
                value.id,
                value.status
            );


        return res.status(200).json({

            success: true,

            message:
                `City status changed to ${value.status}`,

            data: updatedCity

        });

    } catch (error) {

        console.error(
            "Update city status error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


module.exports = {
    createCity,
    getCities,
    getCity,
    searchCity,
    filterCity,
    updateCity,
    updateCityStatus
};