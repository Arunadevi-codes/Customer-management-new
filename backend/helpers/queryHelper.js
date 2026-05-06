// ─────────────────────────────────────────────
//  queryHelper.js  –  Shared query utilities
//  Used by: customerController, staffReadController
// ─────────────────────────────────────────────

/**
 * Build a MongoDB search condition using $or on the given fields.
 *
 * @param {string}   searchTerm  - Value from req.query.search
 * @param {string[]} fields      - Schema field names to search across
 * @returns {object}             - Partial Mongoose query object
 *
 * @example
 *   buildSearchQuery("john", ["name", "email", "phone"])
 *   // → { $or: [ { name: /john/i }, { email: /john/i }, { phone: /john/i } ] }
 */
const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };
};

// ─────────────────────────────────────────────

/**
 * Build a MongoDB date-range condition on the `createdAt` field.
 *
 * @param {string} fromDate - ISO date string for range start (inclusive)
 * @param {string} toDate   - ISO date string for range end   (inclusive, end of day)
 * @returns {object}        - Partial Mongoose query object
 *
 * @example
 *   buildDateQuery("2024-01-01", "2024-06-30")
 *   // → { createdAt: { $gte: Date("2024-01-01"), $lte: Date("2024-06-30T23:59:59.999Z") } }
 */
const buildDateQuery = (fromDate, toDate) => {
  if (!fromDate && !toDate) return {};

  const dateFilter = {};

  if (fromDate) {
    dateFilter.$gte = new Date(fromDate);
  }

  if (toDate) {
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);
    dateFilter.$lte = endOfDay;
  }

  return { createdAt: dateFilter };
};

// ─────────────────────────────────────────────

/**
 * Parse and return safe pagination values from query params.
 *
 * @param {object} query - req.query
 * @returns {{ offset: number, limit: number, skip: number }}
 *
 * @example
 *   getPagination({ offset: "2", limit: "5" })
 *   // → { offset: 2, limit: 5, skip: 10 }
 */
const getPagination = (query) => {
  const offset = parseInt(query.offset) || 0;
  const limit  = parseInt(query.limit)  || 10;
  const skip   = offset * limit;
  return { offset, limit, skip };
};

// ─────────────────────────────────────────────

/**
 * Parse and return sort options from query params.
 *
 * @param {object}   query          - req.query
 * @param {string}   defaultField   - Fallback sort field  (default: "createdAt")
 * @param {string[]} stringFields   - Fields that need locale-aware collation
 * @returns {{ sortField: string, sortOrder: 1|-1, needsCollation: boolean }}
 *
 * @example
 *   getSortOptions({ sortField: "name", sortOrder: "asc" }, "createdAt", ["name"])
 *   // → { sortField: "name", sortOrder: 1, needsCollation: true }
 */
const getSortOptions = (query, defaultField = "createdAt", stringFields = []) => {
  const sortField      = query.sortField || defaultField;
  const sortOrder      = query.sortOrder === "asc" ? 1 : -1;
  const needsCollation = stringFields.includes(sortField);

  return { sortField, sortOrder, needsCollation };
};

// ─────────────────────────────────────────────

module.exports = {
  buildSearchQuery,
  buildDateQuery,
  getPagination,
  getSortOptions,
};