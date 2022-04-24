// makeClass - By John Resig (MIT Licensed)
// changed a little by Sebastian Pidek to throw exception when called without "new"


if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}

ajuc.makeClass = function() {
	return function(args){
		if ( this instanceof arguments.callee ) {
			if ( typeof this.init == "function" ) {
				this.init.apply( this, args.callee ? args : arguments );
			}
		} else {
			throw { name: "instantation required",
					message : "Function should be called with \"new\" keyword"};
		}
	};
};


// Usage:
//var User = makeClass();
//User.prototype.init = function(first, last){
//  this.name = first + " " + last;
//};
//var user = User("John", "Resig");
//equals(user.name, "John Resig");

//Code and example copied from http://ejohn.org

