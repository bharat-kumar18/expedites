const validateShipment = (req, res, next) => {

  const {
    pickup_name,
    pickup_phone,
    pickup_address,
    pickup_pincode,

    receiver_name,
    receiver_phone,
    receiver_address,
    delivery_pincode,

    package_type,
    package_weight
  } = req.body;


  // ==========================================
  // Required Fields
  // ==========================================

  if (
    !pickup_name ||
    !pickup_phone ||
    !pickup_address ||
    !pickup_pincode ||

    !receiver_name ||
    !receiver_phone ||
    !receiver_address ||
    !delivery_pincode ||

    !package_type ||
    !package_weight
  ) {

    return res.status(400).json({

      success: false,

      message:
        "All required shipment fields are required"

    });

  }


  // ==========================================
  // Pickup Pincode Validation
  // ==========================================

  if (!/^[0-9]{6}$/.test(pickup_pincode)) {

    return res.status(400).json({

      success: false,

      message:
        "Pickup pincode must be a valid 6 digit pincode"

    });

  }


  // ==========================================
  // Delivery Pincode Validation
  // ==========================================

  if (!/^[0-9]{6}$/.test(delivery_pincode)) {

    return res.status(400).json({

      success: false,

      message:
        "Delivery pincode must be a valid 6 digit pincode"

    });

  }


  // ==========================================
  // Phone Validation
  // ==========================================

  if (!/^[0-9]{10}$/.test(pickup_phone)) {

    return res.status(400).json({

      success: false,

      message:
        "Pickup phone must be a valid 10 digit number"

    });

  }


  if (!/^[0-9]{10}$/.test(receiver_phone)) {

    return res.status(400).json({

      success: false,

      message:
        "Receiver phone must be a valid 10 digit number"

    });

  }


  next();

};


module.exports = {
  validateShipment
};