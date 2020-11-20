const createCsvql = require('csvql');

module.exports = async function () {
    const csvql = await createCsvql();

    return csvql;
}