const {
    createHub,
    getAllHubs,
    getHubById,
    findHubByCode,
    findHubByNameAndCity,
    getHubsByCity,
    searchHubs,
    filterHubs,
    updateHub,
    updateHubStatus
} = require("../models/hubModel");

const {
    getCityById
} = require("../models/cityModel");


// ========================================
// CREATE HUB SERVICE
// ========================================

const createHubService = async (data) => {

    const {
        name,
        hub_code,
        city_id,
        address,
        phone
    } = data;


    // ====================================
    // 1. CHECK CITY EXISTS
    // ====================================

    const city =
        await getCityById(city_id);


    if (!city) {

        throw new Error(
            "Selected city does not exist"
        );

    }


    // ====================================
    // 2. CHECK CITY IS ACTIVE
    // ====================================

    if (city.status !== "ACTIVE") {

        throw new Error(
            "Cannot create hub in an inactive city"
        );

    }


    // ====================================
    // 3. CHECK HUB CODE
    // ====================================

    const existingCode =
        await findHubByCode(hub_code);


    if (existingCode) {

        throw new Error(
            "Hub code already exists"
        );

    }


    // ====================================
    // 4. CHECK SAME HUB NAME IN CITY
    // ====================================

    const existingHub =
        await findHubByNameAndCity(
            name,
            city_id
        );


    if (existingHub) {

        throw new Error(
            "Hub with this name already exists in this city"
        );

    }


    // ====================================
    // 5. CREATE HUB
    // ====================================

    const hub =
        await createHub({
            name,
            hub_code,
            city_id,
            address,
            phone
        });


    return hub;

};


// ========================================
// GET ALL HUBS
// ========================================

const getHubsService = async () => {

    return await getAllHubs();

};


// ========================================
// GET SINGLE HUB
// ========================================

const getHubService = async (id) => {

    const hub =
        await getHubById(id);


    if (!hub) {

        throw new Error(
            "Hub not found"
        );

    }


    return hub;

};


// ========================================
// GET HUBS BY CITY
// ========================================

const getHubsByCityService = async (
    city_id
) => {

    const city =
        await getCityById(city_id);


    if (!city) {

        throw new Error(
            "City not found"
        );

    }


    return await getHubsByCity(
        city_id
    );

};


// ========================================
// SEARCH HUB
// ========================================

const searchHubService = async (name) => {

    return await searchHubs(name);

};


// ========================================
// FILTER HUB
// ========================================

const filterHubService = async (status) => {

    return await filterHubs(status);

};


// ========================================
// UPDATE HUB
// ========================================

const updateHubService = async (
    id,
    data
) => {

    // ====================================
    // 1. CHECK HUB
    // ====================================

    const existingHub =
        await getHubById(id);


    if (!existingHub) {

        throw new Error(
            "Hub not found"
        );

    }


    // ====================================
    // 2. CHECK CITY
    // ====================================

    const city =
        await getCityById(
            data.city_id
        );


    if (!city) {

        throw new Error(
            "Selected city does not exist"
        );

    }


    if (city.status !== "ACTIVE") {

        throw new Error(
            "Cannot assign hub to an inactive city"
        );

    }


    // ====================================
    // 3. CHECK HUB CODE
    // ====================================

    const existingCode =
        await findHubByCode(
            data.hub_code
        );


    if (
        existingCode &&
        existingCode.id !== id
    ) {

        throw new Error(
            "Hub code already exists"
        );

    }


    // ====================================
    // 4. CHECK NAME IN CITY
    // ====================================

    const existingName =
        await findHubByNameAndCity(
            data.name,
            data.city_id
        );


    if (
        existingName &&
        existingName.id !== id
    ) {

        throw new Error(
            "Hub with this name already exists in this city"
        );

    }


    // ====================================
    // 5. UPDATE
    // ====================================

    return await updateHub(
        id,
        data
    );

};


// ========================================
// UPDATE HUB STATUS
// ========================================

const updateHubStatusService = async (
    id,
    status
) => {

    const existingHub =
        await getHubById(id);


    if (!existingHub) {

        throw new Error(
            "Hub not found"
        );

    }


    if (
        existingHub.status === status
    ) {

        throw new Error(
            `Hub is already ${status}`
        );

    }


    return await updateHubStatus(
        id,
        status
    );

};


module.exports = {

    createHubService,
    getHubsService,
    getHubService,
    getHubsByCityService,
    searchHubService,
    filterHubService,
    updateHubService,
    updateHubStatusService

};