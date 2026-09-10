/**
 * Add PICKUP_ACCEPTED to shipment_status enum
 */

exports.up = async function (knex) {

  await knex.raw(`
    ALTER TYPE "shipment_status"
    ADD VALUE IF NOT EXISTS 'PICKUP_ACCEPTED'
  `);

};


exports.down = async function (knex) {

  // PostgreSQL does not directly support removing
  // an individual value from an enum safely.

  // Therefore, rollback should be handled manually
  // if required.

  return Promise.resolve();

};