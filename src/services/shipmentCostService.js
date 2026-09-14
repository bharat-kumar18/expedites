const { pool } = require("../config/db");

const shipmentCostModel =
  require("../models/shipmentCostModel");


// ==========================================
// Calculate Shipment Cost
// ==========================================

const calculateShipmentCost = async (
  shipmentId,
  data
) => {

  const client = await pool.connect();


  try {

    await client.query("BEGIN");


    // ==========================================
    // 1. Find Shipment
    // ==========================================

    const shipment =
      await shipmentCostModel.findShipmentById(
        client,
        shipmentId
      );


    if (!shipment) {

      throw new Error(
        "Shipment not found"
      );

    }


    // ==========================================
    // 2. Check Existing Cost
    // ==========================================

    const existingCost =
      await shipmentCostModel
        .findShipmentCostByShipmentId(
          client,
          shipmentId
        );


    if (existingCost) {

      throw new Error(
        "Shipment cost has already been calculated"
      );

    }


    // ==========================================
    // 3. Input Values
    // ==========================================

    const distanceKm =
      Number(data.distance_km);

    const fuelCost =
      Number(data.fuel_cost);

    const labourCost =
      Number(data.labour_cost);

    const shippingRevenue =
      Number(
        data.shipping_revenue ??
        shipment.shipping_charge ??
        0
      );


    // ==========================================
    // 4. Calculate Transport Cost
    // ==========================================

    const transportCost =
      fuelCost + labourCost;


    // ==========================================
    // 5. Calculate Total Cost
    // ==========================================

    const totalCost =
      transportCost;


    // ==========================================
    // 6. Calculate Company Margin
    // ==========================================

    const companyMargin =
      shippingRevenue - totalCost;


    // ==========================================
    // 7. Create Cost
    // ==========================================

    const cost =
      await shipmentCostModel.createShipmentCost(
        client,
        {

          shipment_id: shipmentId,

          distance_km: distanceKm,

          fuel_cost: fuelCost,

          labour_cost: labourCost,

          transport_cost: transportCost,

          total_cost: totalCost,

          shipping_revenue: shippingRevenue,

          company_margin: companyMargin

        }
      );


    // ==========================================
    // 8. Commit
    // ==========================================

    await client.query("COMMIT");


    return cost;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Update Shipment Cost
// ==========================================

const updateShipmentCost =
  async (
    shipmentId,
    data
  ) => {

    const client = await pool.connect();


    try {

      await client.query("BEGIN");


      // ==========================================
      // 1. Find Shipment
      // ==========================================

      const shipment =
        await shipmentCostModel.findShipmentById(
          client,
          shipmentId
        );


      if (!shipment) {

        throw new Error(
          "Shipment not found"
        );

      }


      // ==========================================
      // 2. Find Existing Cost
      // ==========================================

      const existingCost =
        await shipmentCostModel
          .findShipmentCostByShipmentId(
            client,
            shipmentId
          );


      if (!existingCost) {

        throw new Error(
          "Shipment cost not found"
        );

      }


      // ==========================================
      // 3. Input Values
      // ==========================================

      const distanceKm =
        Number(data.distance_km);

      const fuelCost =
        Number(data.fuel_cost);

      const labourCost =
        Number(data.labour_cost);

      const shippingRevenue =
        Number(
          data.shipping_revenue ??
          shipment.shipping_charge ??
          0
        );


      // ==========================================
      // 4. Calculate Transport
      // ==========================================

      const transportCost =
        fuelCost + labourCost;


      // ==========================================
      // 5. Calculate Total
      // ==========================================

      const totalCost =
        transportCost;


      // ==========================================
      // 6. Calculate Margin
      // ==========================================

      const companyMargin =
        shippingRevenue - totalCost;


      // ==========================================
      // 7. Update
      // ==========================================

      const updatedCost =
        await shipmentCostModel.updateShipmentCost(
          client,
          shipmentId,
          {

            distance_km: distanceKm,

            fuel_cost: fuelCost,

            labour_cost: labourCost,

            transport_cost: transportCost,

            total_cost: totalCost,

            shipping_revenue: shippingRevenue,

            company_margin: companyMargin

          }
        );


      await client.query("COMMIT");


      return updatedCost;


    } catch (error) {

      await client.query("ROLLBACK");

      throw error;

    } finally {

      client.release();

    }

  };


// ==========================================
// Get Shipment Cost
// ==========================================

const getShipmentCost = async (
  shipmentId
) => {

  const cost =
    await shipmentCostModel.getShipmentCost(
      shipmentId
    );


  if (!cost) {

    throw new Error(
      "Shipment cost not found"
    );

  }


  return cost;

};


// ==========================================
// Get All Shipment Costs
// ==========================================

const getAllShipmentCosts = async (
  page,
  limit
) => {

  return await shipmentCostModel
    .getAllShipmentCosts(
      page,
      limit
    );

};


// ==========================================
// Export
// ==========================================

module.exports = {

  calculateShipmentCost,

  updateShipmentCost,

  getShipmentCost,

  getAllShipmentCosts

};