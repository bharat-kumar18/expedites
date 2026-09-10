const shipmentService = require("../services/shipmentService");


const createShipment = async (req, res) => {

  try {

    // JWT se customer ID milegi
    const customerId = req.user.id;


    const shipment =
      await shipmentService.createShipment(
        customerId,
        req.body
      );


    return res.status(201).json({

      success: true,

      message: "Shipment booked successfully",

      data: shipment

    });


  } catch (error) {

    console.error(
      "Create shipment error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// Get My Pickups
// ==========================================

const getMyPickups = async (req, res) => {

    try {

        // ==========================================
        // Agent ID comes from JWT
        // ==========================================

        const agentId = req.user.id;


        // ==========================================
        // Body can be empty
        // ==========================================

        const body = req.body || {};

        const {
            status
        } = body;


        // ==========================================
        // Get Pickups
        // ==========================================

        const pickups =
            await pickupService.getMyPickups(
                agentId,
                status
            );


        return res.status(200).json({

            success: true,

            message:
                "Pickups fetched successfully",

            count: pickups.length,

            data: pickups

        });

    } catch (error) {

        console.error(
            "Get my pickups error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {
  createShipment,
  getMyPickups
};