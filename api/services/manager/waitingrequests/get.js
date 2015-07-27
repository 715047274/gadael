'use strict';


exports = module.exports = function(services, app) {


    var Gettext = require('node-gettext');
    var gt = new Gettext();


    var service = new services.get(app);

    /**
     * Call the request get service
     *
     * @param {Object} params
     * @return {Promise}
     */
    service.getResultPromise = function(params) {

        var filter = {
            _id: params.id
        };

        if (params.user) {
            filter['approvalSteps.approvers'] = params.user;
        }



        service.app.db.models.Request
        .findOne(filter)
        .exec(function(err, document) {
            if (service.handleMongoError(err))
            {
                if (document) {
                    service.outcome.success = true;
                    service.deferred.resolve(document);
                } else {
                    service.notFound(gt.gettext('This request does not exists'));
                }
            }
        });

        return service.deferred.promise;
    };


    return service;
};

