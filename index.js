const vision = require('@google-cloud/vision')({
    projectId: process.env.GCP_PROJECT
});

const storage = require('@google-cloud/storage')({
    projectId: process.env.GCP_PROJECT
});

/**
 * Triggered from a message on a Cloud Storage bucket.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.processFile = function(event, callback) {
    const eventData = event.data;
    const file = storage.bucket(eventData.bucket).file(eventData.name);
    if (eventData.resourceState === 'not_exists') {
        console.log(`File ${eventData.name} deleted.`);
    } else if (eventData.metageneration === '1') {
        vision.detectText(file, function(err, text, apiResponse) {
            console.log('err:' + JSON.stringify(err));
            console.log('text:' + text);
        });
    } else {
        console.log(`File ${eventData.name} metadata updated.`);
    }
    
    callback();
};