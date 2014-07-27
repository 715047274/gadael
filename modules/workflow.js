'use strict';

/**
 * Event workflow 
 * 
 * @property	int		httpstatus		Response HTTP code
 * @property	Object	outcome			client infos
 * 
 * 
 * the outcome object is sent to client in json format
 * 
 * success: workflow result
 * alert: a list of message with { type: 'success|info|warning|danger' message: '' } type is one of bootstrap alert class
 * errfor: name of fields to highlight to client (empty value)
 * document: reference to the processed document (id or object)
 * 
 * @return EventEmitter
 */ 
exports = module.exports = function(req, res) {
  var workflow = new (require('events').EventEmitter)();
  
  workflow.httpstatus = 200;

  workflow.outcome = {
    success: false,
    alert: [], 
    errfor: {},
    document: null
  };


  /**
   * @return bool
   */  
  workflow.hasErrors = function() {
	  
	if (Object.keys(workflow.outcome.errfor).length !== 0)
	{
		return true;
	}
	  
	for(var i=0; i<workflow.outcome.alert.length; i++)
	{
		if (workflow.outcome.alert[i].type === 'danger')
		{
			return true;
		}
	}
	  
    return false;
  };
  
  /**
   * Test required fields in req.body
   * @return bool
   */  
  workflow.needRequiredFields = function(list) {

	  
	 for(var i=0; i<list.length; i++)
	 {
		if (!req.body[list[i]]) {
			workflow.outcome.errfor[list[i]] = 'required';
			workflow.httpstatus = 400; // Bad Request
		}
	 }
	 
	 return this.hasErrors();
  };
  
  /**
   * emit exception if parameter contain a mongoose error
   */  
  workflow.handleMongoError = function(err) {
	  if (err) {
		  console.trace(err);
		  return workflow.emit('exception', err.message);
	  }
  };
  

  workflow.on('exception', function(err) {
    workflow.outcome.alert.push({ type:'danger' ,message: err});
    return workflow.emit('response');
  });
  

  workflow.on('response', function() {
    workflow.outcome.success = !workflow.hasErrors();
    res.status(workflow.httpstatus).send(workflow.outcome);
  });
  
  

  return workflow;
};
