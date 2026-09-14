const validateAmount = (amount) => {

  if (
    amount === undefined ||
    amount === null ||
    Number(amount) <= 0
  ) {

    throw new Error(
      "Amount must be greater than 0"
    );

  }

};


module.exports = {
  validateAmount
};