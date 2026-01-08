exports.logAttempt = (id, result) => {
    // be defensive about the parameter name to avoid ReferenceError
    console.log({
        chipId: id || null,
        result,
        timestamp: new Date().toISOString()
    });
}

