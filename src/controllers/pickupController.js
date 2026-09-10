const pickupService = require("../services/pickupService");


// ==========================================
// Assign Pickup Agent
// ==========================================

const assignPickupAgent = async (req, res) => {

  try {

    const {

      shipment_id,

      pickup_agent_id

    } = req.body;


    const pickup =
      await pickupService.assignPickupAgent(
        shipment_id,
        pickup_agent_id
      );


    return res.status(201).json({

      success: true,

      message:
        "Pickup agent assigned successfully",

      data: pickup

    });


  } catch (error) {

    console.error(
      "Assign pickup agent error:",
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

    // Agent ID comes from JWT
    const agentId = req.user.id;


    // Optional filter from body
    const {
      status
    } = req.body;


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


// ==========================================
// Accept Pickup
// ==========================================

const acceptPickup = async (req, res) => {

  try {

    const pickup = await pickupService.acceptPickup(
      req.body.shipment_id,
      req.user.id
    );


    return res.status(200).json({

      success: true,

      message: "Pickup accepted successfully",

      data: pickup

    });


  } catch (error) {

    console.error(
      "Accept pickup error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// Complete Pickup
// ==========================================

const completePickup = async (req, res) => {

    try {

        const {
            shipment_id
        } = req.body;


        // Agent ID comes from JWT
        const agentId = req.user.id;


        const pickup =
            await pickupService.completePickup(
                shipment_id,
                agentId
            );


        return res.status(200).json({

            success: true,

            message:
                "Pickup completed successfully",

            data: pickup

        });


    } catch (error) {

        console.error(
            "Complete pickup error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

  assignPickupAgent,

  getMyPickups,

  acceptPickup,
  completePickup
};