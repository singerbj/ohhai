var App = new Backbone.Marionette.Application();

var Square = Backbone.Model.extend({});

var Board = Backbone.Collection.extend({
	model: App.Row

});

var SquareView = Backbone.Marionette.ItemView.extend({
	template: "#square",
	className: 'square',
	events : {
        'click': 'changeColor'
    },
    initialize: function(ev){
    	if(ev.model.attributes.locked){     
    		this.el.className = "square v" + ev.model.attributes.v + ' locked';
    	}else{
    		this.el.className = "square v" + ev.model.attributes.v;
    	}
    },
	changeColor: function(ev){
		if(window.msg !== 'winner' && !this.model.attributes.locked){       
			if(this.model.attributes.v < 2){
	        	this.model.attributes.v += 1;
			} else {
	        	this.model.attributes.v = 0;
			}
			ev.currentTarget.className = "square v" + this.model.attributes.v;
			this.render();
		}
    }
});

var BoardView = Backbone.Marionette.CompositeView.extend({
	tagname: 'div',
	className: 'boardContainer',
	template: '#board',
	childView: SquareView,
	childViewContainer: '.board',	
	events : {
        'click': 'checkForWin'
    },
    checkForWin: function(ev){
    	if(window.msg !== 'win'){
	    	if(this.validateBoard() === true){
	    		window.msg = "win";
	    		this.render();
	    	}
    	}
    },
    validateBoard : function(){    
    	var a = this.collection.toJSON();	    	
    	return this.collection.toJSON(a) && this.validateSamesies(a) && this.validateEqualColors(a) && this.validateThrees(a);    	
    },
    validateSamesies: function(a){
    	var h = [];
		for(var i = 0; i < 4; i++){
			h[i] = '';
			for(var j = 0; j < 4; j++){
				h[i] = h[i] + '' + a[4 * i + j].v;		
			}
			h[i] = parseInt(h[i], 10);
			h = h.sort();
			for (var i = 0; i < h.length - 1; i++) {
			    if (h[i + 1] == h[i]) {
			        return false;
			    }
			}
		}
		var v = [];
		for(var i = 0; i < 4; i++){
			v[i] = '';
			for(var j = 0; j < 4; j++){
				v[i] = v[i] + '' + a[i + j * 4].v
			}
			v[i] = parseInt(v[i], 10);
			v = v.sort();
			for (var i = 0; i < v.length - 1; i++) {
			    if (v[i + 1] == v[i]) {
			        return false;
			    }
			}
		}
		return true;
    },
    validateEqualColors: function(a){
    	var one = 0;
    	var two = 0;
		for(var i = 0; i < a.length; i++){
			if(a[i].v === 1) one += 1;
			if(a[i].v === 2) two += 1;
		}

		if(one + two !== 16 || one !== two){
			return false;
		}else{
			for(var i = 0; i < 4; i++){
				var one = 0;
    			var two = 0;
				for(var j = 0; j < 4; j++){
					if(a[4 * i + j].v === 1) one += 1;
					if(a[4 * i + j].v === 2) two += 1;
				}
				if(one !== two){
					return false;
				}
			}

			for(var i = 0; i < 4; i++){
				var one = 0;
    			var two = 0;
				for(var j = 0; j < 4; j++){
					if(a[i + j * 4].v === 1) one += 1;
					if(a[i + j * 4].v === 2) two += 1;
				}
				if(one !== two){
					return false;
				}
			}
		}
		return true;
    },
    validateThrees: function(a){
    	for(var i = 0; i < 4; i++){
	    	if(a[1 + (4 * i)].v > 0 && a[1 + (4 * i)].v === a[2 + (4 * i)].v){
	    		var check = a[1 + (4 * i)].v;
    			if(a[0 + (4 * i)].v === check){
					return false;
    			}
    			if(a[3 + (4 * i)].v === check){
					return false;
    			}
	    	}
    	}

    	for(var i = 0; i < 4; i++){
	    	if(a[4 + i].v > 0 && a[4 + i].v === a[8 + i].v){

	    		var check = a[4 + i].v;
    			if(a[i].v === check){
					return false;
    			}
    			if(a[12 + i].v === check){
					return false;
    			}
	    	}
    	}
    	return true;
    }
});

App.addRegions({
    page: "#content"
});

window.msg = '';
var game = new Board([
	new Square({ v: 0, locked: false }), new Square({ v: 1, locked: true }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), 
	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 2, locked: true }), new Square({ v: 0, locked: false }),
	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }),
	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 2, locked: true })
]);

App.page.show(new BoardView({ collection: game }));
	
App.start({});