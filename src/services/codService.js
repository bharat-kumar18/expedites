const { pool } = require("../config/db");

const codModel =
  require("../models/codModel");


// ==========================================
// Create COD
// ==========================================

const createCOD = async (
  shipmentId,
  sellerId,
  data
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const existing =
      await codModel.findCODByShipmentId(
        client,
        shipmentId
      );


    if (existing) {

      throw new Error(
        "COD already exists for this shipment"
      );

    }


    const codAmount =
      Number(data.cod_amount);


    const companyFee =
      Number(data.company_fee || 0);


    const sellerAmount =
      codAmount - companyFee;


    if (sellerAmount < 0) {

      throw new Error(
        "Company fee cannot be greater than COD amount"
      );

    }


    const cod =
      await codModel.createCOD(
        client,
        {
          shipment_id: shipmentId,

          seller_id: sellerId,

          cod_amount: codAmount,

          seller_amount: sellerAmount,

          company_fee: companyFee
        }
      );


    await client.query("COMMIT");

    return cod;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Collect COD
// ==========================================

const collectCOD = async (
  shipmentId,
  agentId,
  collectionMethod
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const cod =
      await codModel.collectCOD(
        client,
        shipmentId,
        agentId,
        collectionMethod
      );


    if (!cod) {

      throw new Error(
        "COD not found or already collected"
      );

    }


    await client.query("COMMIT");

    return cod;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Reconcile COD
// ==========================================

const reconcileCOD = async (
  shipmentId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const cod =
      await codModel.reconcileCOD(
        client,
        shipmentId
      );


    if (!cod) {

      throw new Error(
        "COD cannot be reconciled"
      );

    }


    await client.query("COMMIT");

    return cod;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

const settleCOD = async (
  shipmentId,
  settlementReference
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const cod =
      await codModel.findCODByShipmentId(
        client,
        shipmentId
      );

    if (!cod) {

      throw new Error(
        "COD not found"
      );

    }

    if (
      cod.settlement_status ===
      "SETTLED"
    ) {

      throw new Error(
        "COD already settled"
      );

    }

    if (
      cod.collection_status !==
      "RECONCILED"
    ) {

      throw new Error(
        "COD must be reconciled before settlement"
      );

    }

    if (
      cod.reconciliation_status !==
      "VERIFIED"
    ) {

      throw new Error(
        "COD reconciliation is not verified"
      );

    }

    if (
      cod.settlement_eligible_at &&
      new Date(
        cod.settlement_eligible_at
      ) > new Date()
    ) {

      throw new Error(
        "COD settlement is not yet eligible"
      );

    }

    const settled =
      await codModel.settleCOD(
        client,
        shipmentId,
        settlementReference ||
          `MOCK_SETTLEMENT_${shipmentId}`
      );

    if (!settled) {

      throw new Error(
        "COD settlement failed"
      );

    }

    await client.query("COMMIT");

    return settled;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

// ==========================================
// Get COD
// ==========================================

const getCOD =
  async (shipmentId) => {

    return await codModel
      .getCODByShipmentId(
        shipmentId
      );

  };


module.exports = {

  createCOD,
  collectCOD,
  reconcileCOD,
  settleCOD,
  getCOD

};