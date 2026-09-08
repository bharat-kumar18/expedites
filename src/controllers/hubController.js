const {
    createHubService,
    getHubsService,
    getHubService,
    getHubsByCityService,
    searchHubService,
    filterHubService,
    updateHubService,
    updateHubStatusService
} = require("../services/hubService");


const {
    createHubSchema,
    getHubSchema,
    searchHubSchema,
    filterHubSchema,
    getHubsByCitySchema,
    updateHubSchema,
    updateHubStatusSchema
} = require("../validations/hubValidation");


// ========================================
// CREATE HUB
// ========================================

const createHub = async (req, res) => {

    try {

        const {
            error,
            value
        } = createHubSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const hub =
            await createHubService(value);


        return res.status(201).json({

            success: true,

            message:
                "Hub created successfully",

            data: hub

        });

    } catch (error) {

        console.error(
            "Create hub error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// GET ALL HUBS
// ========================================

const getHubs = async (req, res) => {

    try {

        const hubs =
            await getHubsService();


        return res.status(200).json({

            success: true,

            message:
                "Hubs fetched successfully",

            count: hubs.length,

            data: hubs

        });

    } catch (error) {

        console.error(
            "Get hubs error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// GET ONE HUB
// ID FROM BODY
// ========================================

const getHub = async (req, res) => {

    try {

        const {
            error,
            value
        } = getHubSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const hub =
            await getHubService(
                value.id
            );


        return res.status(200).json({

            success: true,

            message:
                "Hub fetched successfully",

            data: hub

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// GET HUBS BY CITY
// city_id FROM BODY
// ========================================

const getHubsByCity = async (
    req,
    res
) => {

    try {

        const {
            error,
            value
        } = getHubsByCitySchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const hubs =
            await getHubsByCityService(
                value.city_id
            );


        return res.status(200).json({

            success: true,

            message:
                "Hubs fetched successfully for selected city",

            count: hubs.length,

            data: hubs

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// SEARCH HUB
// ========================================

const searchHub = async (req, res) => {

    try {

        const {
            error,
            value
        } = searchHubSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const hubs =
            await searchHubService(
                value.name
            );


        return res.status(200).json({

            success: true,

            message:
                "Hub search completed",

            count: hubs.length,

            data: hubs

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// FILTER HUB
// ========================================

const filterHub = async (req, res) => {

    try {

        const {
            error,
            value
        } = filterHubSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const hubs =
            await filterHubService(
                value.status
            );


        return res.status(200).json({

            success: true,

            message:
                "Hubs filtered successfully",

            count: hubs.length,

            data: hubs

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// UPDATE HUB
// ========================================

const updateHub = async (req, res) => {

    try {

        const {
            error,
            value
        } = updateHubSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const updatedHub =
            await updateHubService(
                value.id,
                {
                    name: value.name,
                    hub_code: value.hub_code,
                    city_id: value.city_id,
                    address: value.address,
                    phone: value.phone
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "Hub updated successfully",

            data: updatedHub

        });

    } catch (error) {

        console.error(
            "Update hub error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// UPDATE HUB STATUS
// ========================================

const updateHubStatus = async (
    req,
    res
) => {

    try {

        const {
            error,
            value
        } = updateHubStatusSchema.validate(
            req.body
        );


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.details[0].message

            });

        }


        const updatedHub =
            await updateHubStatusService(
                value.id,
                value.status
            );


        return res.status(200).json({

            success: true,

            message:
                `Hub status changed to ${value.status}`,

            data: updatedHub

        });

    } catch (error) {

        console.error(
            "Update hub status error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    createHub,
    getHubs,
    getHub,
    getHubsByCity,
    searchHub,
    filterHub,
    updateHub,
    updateHubStatus

};