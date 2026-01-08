
exports.logAttempt = (id, result, manufacturer) => {
    const log = {
        chipId: id || null,
        result,
        timestamp: new Date().toISOString()
    };
    if (result === 'authentic' && manufacturer) {
        log.manufacturer = manufacturer;
    }
    console.log(log);
}

