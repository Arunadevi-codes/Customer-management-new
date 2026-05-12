const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };
};

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

const getPagination = (query) => {
  const offset = parseInt(query.offset) || 0;
  const limit = parseInt(query.limit) || 10;
  const skip = offset * limit;

  return { offset, limit, skip };
};

const getSortOptions = (
  query,
  defaultField = null,      // ← changed default from "createdAt" to null
  stringFields = []
) => {
  const sortField = query.sortField || defaultField || null;

  // No sort field → return nulls so the caller can skip .sort() entirely
  if (!sortField) {
    return { sortField: null, sortOrder: null, needsCollation: false };
  }

  const sortOrder      = query.sortOrder === "asc" ? 1 : -1;
  const needsCollation = stringFields.includes(sortField);

  return { sortField, sortOrder, needsCollation };
};

module.exports = {
  buildSearchQuery,
  buildDateQuery,
  getPagination,
  getSortOptions,
};