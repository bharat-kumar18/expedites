const codService =
  require("../services/codService");

const {
  validateCreateCOD,
  validateCollectCOD
} = require("../validations/codValidation");


// ==========================================
// Create COD
// ==========================================

const createCOD = async (
  req,
  res
) => {

  try {

    validateCreateCOD(
      req.body
    );


    const cod =
      await codService.createCOD(
        req.body.shipment_id,
        req.user.id,
        req.body
      );


    res.status(201).json({

      success: true,

      message:
        "COD created successfully",

      data: cod

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Collect COD
// ==========================================

const collectCOD = async (
  req,
  res
) => {

  try {

    validateCollectCOD(
      req.body
    );


    const cod =
      await codService.collectCOD(
        req.body.shipment_id,
        req.user.id,
        req.body.collection_method
      );


    res.status(200).json({

      success: true,

      message:
        "COD collected successfully",

      data: cod

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Reconcile COD
// ==========================================

const reconcileCOD = async (
  req,
  res
) => {

  try {

    if (!req.body.shipment_id) {

      throw new Error(
        "shipment_id is required"
      );

    }


    const cod =
      await codService.reconcileCOD(
        req.body.shipment_id
      );


    res.status(200).json({

      success: true,

      message:
        "COD reconciled successfully",

      data: cod

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Settle COD
// ==========================================

const settleCOD = async (
  req,
  res
) => {

  try {

    if (!req.body.shipment_id) {

      throw new Error(
        "shipment_id is required"
      );

    }

    const cod =
      await codService.settleCOD(
        req.body.shipment_id,
        req.body.settlement_reference
      );

    return res.status(200).json({

      success: true,

      message:
        "COD settled successfully",

      data: cod

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get COD
// ==========================================

const getCOD = async (
  req,
  res
) => {

  try {

    if (!req.body.shipment_id) {

      throw new Error(
        "shipment_id is required"
      );

    }


    const cod =
      await codService.getCOD(
        req.body.shipment_id
      );


    if (!cod) {

      return res.status(404).json({

        success: false,

        message:
          "COD record not found"

      });

    }


    res.status(200).json({

      success: true,

      data: cod

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  createCOD,
  collectCOD,
  reconcileCOD,
  settleCOD,
  getCOD

};