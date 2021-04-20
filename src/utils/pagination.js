function pagination(page, limit, data) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let results = {};

  if (endIndex < data.length) {
    results.next = {
      page: page + 1,
      limit: limit,
      total: data.length,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
      total: data.length,
    };
  }

  results.total = data.length;
  results.result = data.slice(startIndex, endIndex);
  return results;
}

module.exports = pagination;
