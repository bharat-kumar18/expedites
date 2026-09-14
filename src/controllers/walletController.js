const walletService =
  require("../services/walletService");


// ==========================================
// Get Wallet
// ==========================================

const getWallet = async (
  req,
  res
) => {

  try {

    const customerId =
      req.user.id;

    let wallet =
      await walletService.getWallet(
        customerId
      );


    if (!wallet) {

      wallet =
        await walletService.getOrCreateWallet(
          customerId
        );

    }


    res.status(200).json({

      success: true,

      data: wallet

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get Wallet Transactions
// ==========================================

const getTransactions = async (
  req,
  res
) => {

  try {

    const customerId =
      req.user.id;

    const transactions =
      await walletService.getTransactions(
        customerId
      );


    res.status(200).json({

      success: true,

      data: transactions

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  getWallet,
  getTransactions

};