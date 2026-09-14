const { pool } = require("../config/db");


const {
    ACTIVE_SHIPMENT_STATUSES
} = require("../constants/shipmentStatus");


// ==========================================
// Dashboard Summary
// ==========================================

const getDashboardSummary = async (filters = {}) => {

    const {
        start_date,
        end_date
    } = filters;


    // ==========================================
    // Shipment Date Conditions
    // ==========================================

    const shipmentConditions = [];
    const shipmentValues = [];


    if (start_date) {

        shipmentValues.push(start_date);

        shipmentConditions.push(
            `s.created_at >= $${shipmentValues.length}`
        );

    }


    if (end_date) {

        shipmentValues.push(end_date);

        shipmentConditions.push(
            `s.created_at <= $${shipmentValues.length}`
        );

    }


    const shipmentWhere =
        shipmentConditions.length
            ? `WHERE ${shipmentConditions.join(" AND ")}`
            : "";


    // ==========================================
    // Shipment Statistics
    // ==========================================

    const shipmentResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_shipments,


      -- Delivered
      COUNT(*) FILTER (
        WHERE s.shipment_status::text = 'DELIVERED'
      ) AS delivered_shipments,


      -- Cancelled
      COUNT(*) FILTER (
        WHERE s.shipment_status::text = 'CANCELLED'
      ) AS cancelled_shipments,


      -- Returned
      COUNT(*) FILTER (
        WHERE s.shipment_status::text = 'RETURNED'
      ) AS returned_shipments,


      -- Active Shipments
      COUNT(*) FILTER (
        WHERE s.shipment_status::text IN (
          'BOOKED',
          'PICKUP_PENDING',
          'PICKUP_ACCEPTED',
          'PICKED_UP',
          'IN_TRANSIT',
          'OUT_FOR_DELIVERY'
        )
      ) AS active_shipments,


      -- Shipping Revenue
      COALESCE(
        SUM(s.shipping_charge),
        0
      ) AS shipping_revenue


    FROM shipments s

    ${shipmentWhere}
    `,
        shipmentValues
    );


    // ==========================================
    // Payment Date Conditions
    // ==========================================

    const paymentConditions = [];
    const paymentValues = [];


    if (start_date) {

        paymentValues.push(start_date);

        paymentConditions.push(
            `p.created_at >= $${paymentValues.length}`
        );

    }


    if (end_date) {

        paymentValues.push(end_date);

        paymentConditions.push(
            `p.created_at <= $${paymentValues.length}`
        );

    }


    const paymentWhere =
        paymentConditions.length
            ? `WHERE ${paymentConditions.join(" AND ")}`
            : "";


    // ==========================================
    // Payment Statistics
    // ==========================================

    const paymentResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_payments,


      COUNT(*) FILTER (
        WHERE p.status::text = 'SUCCESS'
      ) AS successful_payments,


      COUNT(*) FILTER (
        WHERE p.status::text = 'PENDING'
      ) AS pending_payments,


      COUNT(*) FILTER (
        WHERE p.status::text = 'FAILED'
      ) AS failed_payments,


      COALESCE(
        SUM(p.amount) FILTER (
          WHERE p.status::text = 'SUCCESS'
        ),
        0
      ) AS successful_payment_amount


    FROM payments p

    ${paymentWhere}
    `,
        paymentValues
    );


    // ==========================================
    // Complaint Date Conditions
    // ==========================================

    const complaintConditions = [];
    const complaintValues = [];


    if (start_date) {

        complaintValues.push(start_date);

        complaintConditions.push(
            `c.created_at >= $${complaintValues.length}`
        );

    }


    if (end_date) {

        complaintValues.push(end_date);

        complaintConditions.push(
            `c.created_at <= $${complaintValues.length}`
        );

    }


    const complaintWhere =
        complaintConditions.length
            ? `WHERE ${complaintConditions.join(" AND ")}`
            : "";


    // ==========================================
    // Complaint Statistics
    // ==========================================

    const complaintResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_complaints,


      COUNT(*) FILTER (
        WHERE c.status::text = 'OPEN'
      ) AS open_complaints,


      COUNT(*) FILTER (
        WHERE c.status::text = 'IN_PROGRESS'
      ) AS in_progress_complaints,


      COUNT(*) FILTER (
        WHERE c.status::text = 'RESOLVED'
      ) AS resolved_complaints,


      COUNT(*) FILTER (
        WHERE c.status::text = 'CLOSED'
      ) AS closed_complaints


    FROM complaints c

    ${complaintWhere}
    `,
        complaintValues
    );


    // ==========================================
    // COD Date Conditions
    // ==========================================

    const codConditions = [];
    const codValues = [];


    if (start_date) {

        codValues.push(start_date);

        codConditions.push(
            `c.created_at >= $${codValues.length}`
        );

    }


    if (end_date) {

        codValues.push(end_date);

        codConditions.push(
            `c.created_at <= $${codValues.length}`
        );

    }


    const codWhere =
        codConditions.length
            ? `WHERE ${codConditions.join(" AND ")}`
            : "";


    // ==========================================
    // COD Statistics
    // ==========================================

    const codResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_cod_orders,


      COALESCE(
        SUM(c.cod_amount),
        0
      ) AS total_cod_amount,


      COALESCE(
        SUM(c.company_fee),
        0
      ) AS total_company_fee,


      COALESCE(
        SUM(c.seller_amount),
        0
      ) AS total_seller_amount


    FROM cod_payments c

    ${codWhere}
    `,
        codValues
    );


    // ==========================================
    // Final Response
    // ==========================================

    return {

        shipments:
            shipmentResult.rows[0],

        payments:
            paymentResult.rows[0],

        complaints:
            complaintResult.rows[0],

        cod:
            codResult.rows[0]

    };

};


// ==========================================
// Shipment Report
// ==========================================

const getShipmentReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        status,
        customer_id,
        start_date,
        end_date,
        search
    } = filters;


    const values = [];
    const conditions = [];


    if (status) {

        values.push(status);

        conditions.push(
            `s.shipment_status::text = $${values.length}`
        );

    }


    if (customer_id) {

        values.push(customer_id);

        conditions.push(
            `s.customer_id = $${values.length}::uuid`
        );

    }


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `s.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `s.created_at <= $${values.length}`
        );

    }


    if (search) {

        values.push(`%${search}%`);

        conditions.push(`
      (
        s.tracking_number ILIKE $${values.length}
        OR
        customer.name ILIKE $${values.length}
      )
    `);

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      s.id,
      s.tracking_number,
      s.customer_id,

      customer.name AS customer_name,

      s.pickup_pincode,
      s.delivery_pincode,

      s.package_type,
      s.weight,

      s.shipping_charge,

      s.payment_status,
      s.shipment_status,

      s.created_at,
      s.updated_at

    FROM shipments s

    LEFT JOIN users customer
      ON s.customer_id = customer.id

    ${whereClause}

    ORDER BY s.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM shipments s

    LEFT JOIN users customer
      ON s.customer_id = customer.id

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Payment Report
// ==========================================

const getPaymentReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        status,
        payment_type,
        payment_method,
        start_date,
        end_date
    } = filters;


    const values = [];
    const conditions = [];


    if (status) {

        values.push(status);

        conditions.push(
            `p.status::text = $${values.length}`
        );

    }


    if (payment_type) {

        values.push(payment_type);

        conditions.push(
            `p.payment_type = $${values.length}`
        );

    }


    if (payment_method) {

        values.push(payment_method);

        conditions.push(
            `p.payment_method = $${values.length}`
        );

    }


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `p.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `p.created_at <= $${values.length}`
        );

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      p.id,
      p.customer_id,

      u.name AS customer_name,

      p.shipment_id,
      s.tracking_number,

      p.payment_type,
      p.payment_method,
      p.amount,
      p.status,

      p.gateway,
      p.gateway_order_id,
      p.gateway_payment_id,

      p.created_at,
      p.updated_at

    FROM payments p

    LEFT JOIN users u
      ON p.customer_id = u.id

    LEFT JOIN shipments s
      ON p.shipment_id = s.id

    ${whereClause}

    ORDER BY p.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM payments p

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    const summaryResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_transactions,

      COALESCE(
        SUM(amount),
        0
      ) AS total_amount,

      COALESCE(
        SUM(amount) FILTER (
          WHERE status = 'SUCCESS'
        ),
        0
      ) AS successful_amount,

      COALESCE(
        SUM(amount) FILTER (
          WHERE status = 'REFUNDED'
        ),
        0
      ) AS refunded_amount

    FROM payments p

    ${whereClause}
    `,
        values
    );


    return {

        data: result.rows,

        summary: summaryResult.rows[0],

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// COD Report
// ==========================================

const getCODReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        collection_status,
        settlement_status,
        start_date,
        end_date
    } = filters;


    const values = [];
    const conditions = [];


    if (collection_status) {

        values.push(collection_status);

        conditions.push(
            `c.collection_status = $${values.length}`
        );

    }


    if (settlement_status) {

        values.push(settlement_status);

        conditions.push(
            `c.settlement_status = $${values.length}`
        );

    }


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `c.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `c.created_at <= $${values.length}`
        );

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      c.id,

      c.shipment_id,

      s.tracking_number,

      c.seller_id,
      seller.name AS seller_name,

      c.delivery_agent_id,
      agent.name AS delivery_agent_name,

      c.cod_amount,
      c.company_fee,
      c.seller_amount,

      c.collection_status,
      c.reconciliation_status,
      c.settlement_status,

      c.collection_method,

      c.collected_at,
      c.reconciled_at,
      c.settlement_eligible_at,

      c.created_at

    FROM cod_payments c

    LEFT JOIN shipments s
      ON c.shipment_id = s.id

    LEFT JOIN users seller
      ON c.seller_id = seller.id

    LEFT JOIN users agent
      ON c.delivery_agent_id = agent.id

    ${whereClause}

    ORDER BY c.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM cod_payments c

    ${whereClause}
    `,
        values
    );


    const summaryResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_cod_orders,

      COALESCE(
        SUM(c.cod_amount),
        0
      ) AS total_cod_amount,

      COALESCE(
        SUM(c.company_fee),
        0
      ) AS total_company_fee,

      COALESCE(
        SUM(c.seller_amount),
        0
      ) AS total_seller_amount

    FROM cod_payments c

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        summary: summaryResult.rows[0],

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Wallet Report
// ==========================================

const getWalletReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        start_date,
        end_date
    } = filters;


    const values = [];
    const conditions = [];


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `wt.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `wt.created_at <= $${values.length}`
        );

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      wt.id,

      w.customer_id,

      u.name AS customer_name,

      wt.transaction_type,
      wt.amount,
      wt.reference,
      wt.remark,

      wt.created_at

    FROM wallet_transactions wt

    JOIN wallets w
      ON wt.wallet_id = w.id

    JOIN users u
      ON w.customer_id = u.id

    ${whereClause}

    ORDER BY wt.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM wallet_transactions wt

    ${whereClause}
    `,
        values
    );


    const summaryResult = await pool.query(
        `
    SELECT

      COALESCE(
        SUM(wt.amount),
        0
      ) AS total_transaction_amount,

      COUNT(*) AS total_transactions

    FROM wallet_transactions wt

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        summary: summaryResult.rows[0],

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Complaint Report
// ==========================================

const getComplaintReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        status,
        category,
        priority,
        start_date,
        end_date
    } = filters;


    const values = [];
    const conditions = [];


    if (status) {

        values.push(status);

        conditions.push(
            `c.status::text = $${values.length}`
        );

    }


    if (category) {

        values.push(category);

        conditions.push(
            `c.category = $${values.length}`
        );

    }


    if (priority) {

        values.push(priority);

        conditions.push(
            `c.priority = $${values.length}`
        );

    }


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `c.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `c.created_at <= $${values.length}`
        );

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      c.id,
      c.complaint_number,

      c.shipment_id,
      s.tracking_number,

      c.customer_id,
      u.name AS customer_name,

      c.category,
      c.priority,
      c.subject,
      c.status,

      c.assigned_to,
      assigned.name AS assigned_agent_name,

      c.created_at,
      c.resolved_at,
      c.closed_at,
      c.updated_at

    FROM complaints c

    LEFT JOIN shipments s
      ON c.shipment_id = s.id

    LEFT JOIN users u
      ON c.customer_id = u.id

    LEFT JOIN users assigned
      ON c.assigned_to = assigned.id

    ${whereClause}

    ORDER BY c.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM complaints c

    ${whereClause}
    `,
        values
    );


    const summaryResult = await pool.query(
        `
    SELECT

      COUNT(*) AS total_complaints,

      COUNT(*) FILTER (
        WHERE c.status::text = 'OPEN
      ) AS open_complaints,

      COUNT(*) FILTER (
           WHERE c.status::text = 'IN_PROGRESS'
         ) AS in_progress_complaints,

      COUNT(*) FILTER (
        WHERE c.status::text = 'RESOLVED'
      ) AS resolved_complaints,

      COUNT(*) FILTER (
        WHERE c.status::text = 'CLOSED'
      ) AS closed_complaints,

      COUNT(*) FILTER (
        WHERE priority = 'URGENT'
      ) AS urgent_complaints

    FROM complaints c

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        summary: summaryResult.rows[0],

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Hub Report
// ==========================================

const getHubReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10
    } = filters;


    const offset =
        (Number(page) - 1) * Number(limit);


    const result = await pool.query(
        `
    SELECT

      h.id,
      h.name AS hub_name,

      city.name AS city_name,

      (
        SELECT COUNT(*)
        FROM shipments s1
        WHERE s1.pickup_hub_id = h.id
      ) AS pickup_shipments,

      (
        SELECT COUNT(*)
        FROM shipments s2
        WHERE s2.delivery_hub_id = h.id
      ) AS delivery_shipments

    FROM hubs h

    LEFT JOIN cities city
      ON h.city_id = city.id

    ORDER BY h.name

    LIMIT $1
    OFFSET $2
    `,
        [
            Number(limit),
            offset
        ]
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total
    FROM hubs
    `
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Customer Report
// ==========================================

const getCustomerReport = async (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        status
    } = filters;


    const values = [];

    const conditions = [
        `u.role = 'CUSTOMER'`
    ];


    if (status) {

        values.push(status);

        conditions.push(
            `u.status = $${values.length}`
        );

    }


    const whereClause =
        `WHERE ${conditions.join(" AND ")}`;


    const offset =
        (Number(page) - 1) * Number(limit);


    const dataValues = [
        ...values,
        Number(limit),
        offset
    ];


    const result = await pool.query(
        `
    SELECT

      u.id,
      u.name,
      u.email,
      u.phone,
      u.status,
      u.created_at,

      COUNT(s.id) AS total_shipments,

      COUNT(s.id) FILTER (
        WHERE s.shipment_status::text = 'DELIVERED'
      ) AS delivered_shipments,

      COALESCE(
        SUM(s.shipping_charge),
        0
      ) AS total_shipping_spend

    FROM users u

    LEFT JOIN shipments s
      ON s.customer_id = u.id

    ${whereClause}

    GROUP BY
      u.id,
      u.name,
      u.email,
      u.phone,
      u.status,
      u.created_at

    ORDER BY u.created_at DESC

    LIMIT $${dataValues.length - 1}

    OFFSET $${dataValues.length}
    `,
        dataValues
    );


    const countResult = await pool.query(
        `
    SELECT COUNT(*) AS total

    FROM users u

    ${whereClause}
    `,
        values
    );


    const total =
        Number(countResult.rows[0].total);


    return {

        data: result.rows,

        pagination: {

            page: Number(page),

            limit: Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                )

        }

    };

};


// ==========================================
// Revenue Report
// ==========================================

const getRevenueReport = async (filters = {}) => {

    const {
        start_date,
        end_date
    } = filters;


    const values = [];
    const conditions = [];


    if (start_date) {

        values.push(start_date);

        conditions.push(
            `s.created_at >= $${values.length}`
        );

    }


    if (end_date) {

        values.push(end_date);

        conditions.push(
            `s.created_at <= $${values.length}`
        );

    }


    const whereClause =
        conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const result = await pool.query(
        `
    SELECT

      COUNT(s.id) AS total_shipments,

      COALESCE(
        SUM(s.shipping_charge),
        0
      ) AS shipping_revenue,

      COALESCE(
        SUM(sc.total_cost),
        0
      ) AS operational_cost,

      COALESCE(
        SUM(sc.company_margin),
        0
      ) AS company_margin

    FROM shipments s

    LEFT JOIN shipment_costs sc
      ON sc.shipment_id = s.id

    ${whereClause}
    `,
        values
    );


    return result.rows[0];

};


module.exports = {

    getDashboardSummary,
    getShipmentReport,
    getPaymentReport,
    getCODReport,
    getWalletReport,
    getComplaintReport,
    getHubReport,
    getCustomerReport,
    getRevenueReport

};