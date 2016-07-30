'use strict';


const gt = require('./../../../../modules/gettext');
const gcal = require('google-calendar');
const gcalResponse = require('./../../../../modules/gcalResponse');


function isWritable(calendar) {
    if ('owner' === calendar.accessRole) {
        return true;
    }

    return false;
}









/**
 * Create the service
 * @param   {Object} services
 * @param   {Object} app
 * @returns {listItemsService}
 */
exports = module.exports = function(services, app) {

    let service = new services.list(app);


    function getUserResponse(user) {

        let googleResponse = gcalResponse(service, getUserResponse, user, function(data) {
            service.outcome.success = true;
            service.deferred.resolve(data.items.filter(isWritable));
        });


        let google_calendar = new gcal.GoogleCalendar(user.google.accessToken);
        google_calendar.calendarList.list(googleResponse);
    }





    /**
     * Call the googlecalendars list service
     * Get the list of writable calendars, using the connected google account
     *
     *
     *
     * @param {Object} params
     *
     *
     * @return {Promise}
     */
    service.getResultPromise = function(params) {


        if (!params.user.google || !params.user.google.accessToken) {
            service.forbidden(gt.gettext('Not connected to a google calendar'));
            return service.deferred.promise;
        }

        getUserResponse(params.user);

        return service.deferred.promise;
    };


    return service;
};




