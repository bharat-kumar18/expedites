const {
    createCity,
    getAllCities,
    getCityById,
    searchCities,
    filterCities,
    findCityByNameAndState,
    updateCity,
    updateCityStatus
} = require("../models/cityModel");


// ========================================
// CREATE CITY SERVICE
// ========================================

const createCityService = async (data) => {

    const {
        name,
        state,
        country
    } = data;


    // Check duplicate
    const existingCity =
        await findCityByNameAndState(
            name,
            state
        );


    if (existingCity) {

        throw new Error(
            "City already exists in this state"
        );

    }


    const city = await createCity({

        name,
        state,
        country: country || "India"

    });


    return city;
};


// ========================================
// GET ALL CITIES SERVICE
// ========================================

const getCitiesService = async () => {

    const cities =
        await getAllCities();

    return cities;
};


// ========================================
// GET SINGLE CITY SERVICE
// ========================================

const getCityService = async (id) => {

    const city =
        await getCityById(id);


    if (!city) {

        throw new Error(
            "City not found"
        );

    }


    return city;
};


// ========================================
// SEARCH CITY SERVICE
// ========================================

const searchCityService = async (name) => {

    const cities =
        await searchCities(name);

    return cities;
};


// ========================================
// FILTER CITY SERVICE
// ========================================

const filterCityService = async (status) => {

    const cities =
        await filterCities(status);

    return cities;
};


// ========================================
// UPDATE CITY SERVICE
// ========================================

const updateCityService = async (
    id,
    data
) => {

    const existingCity =
        await getCityById(id);


    if (!existingCity) {

        throw new Error(
            "City not found"
        );

    }


    // Check if another city
    // already has same name + state

    const duplicateCity =
        await findCityByNameAndState(
            data.name,
            data.state
        );


    if (
        duplicateCity &&
        duplicateCity.id !== id
    ) {

        throw new Error(
            "Another city with this name already exists in this state"
        );

    }


    const updatedCity =
        await updateCity(
            id,
            data
        );


    return updatedCity;
};


// ========================================
// UPDATE CITY STATUS SERVICE
// ========================================

const updateCityStatusService = async (
    id,
    status
) => {

    const existingCity =
        await getCityById(id);


    if (!existingCity) {

        throw new Error(
            "City not found"
        );

    }


    if (
        existingCity.status === status
    ) {

        throw new Error(
            `City is already ${status}`
        );

    }


    const updatedCity =
        await updateCityStatus(
            id,
            status
        );


    return updatedCity;
};


module.exports = {
    createCityService,
    getCitiesService,
    getCityService,
    searchCityService,
    filterCityService,
    updateCityService,
    updateCityStatusService
};