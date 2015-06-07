'use strict';

exports = module.exports = function(params) {
	
	var mongoose = params.mongoose;
	
  var requestSchema = new mongoose.Schema({
    user: { // owner
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true }
    },

    timeCreated: { type: Date, default: Date.now },
    
    createdBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true }
    },
    
    absence: {
		distribution: [mongoose.modelSchemas.AbsenceElem]
	},
	
    time_saving_deposit: {
		from: { type: mongoose.Schema.Types.ObjectId, ref: 'Right' },
		to: { type: mongoose.Schema.Types.ObjectId, ref: 'Right' },
		quantity: { type: Number }
	},
	
    workperiod_recover: {
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent' },
		user_right: { type: mongoose.Schema.Types.ObjectId, ref: 'Right' },
		timeCreated: { type: Date, default: Date.now }
	},
    
    deleted: { type: Boolean, default: false },
    
    approvalSteps: [mongoose.modelSchemas.ApprovalStep],			// on request creation, approval steps are copied and contain references to users
																	// informations about approval are stored in requestLog sub-documents instead
																	
    requestLog: [mongoose.modelSchemas.RequestLog],					// linear representation of all actions
																	// create, edit, delete, and effectives approval steps
  });

  requestSchema.index({ 'user.id': 1 });
  requestSchema.set('autoIndex', params.autoIndex);
  
  params.db.model('Request', requestSchema);
};
