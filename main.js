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



var validationObj = {
	
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

};

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
    	return validationObj.validateSamesies(a) && validationObj.validateEqualColors(a) && validationObj.validateThrees(a);    	
    }   
});

App.addRegions({
    page: "#content"
});

window.msg = '';

var randomNum = function(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var possibleRows = [1122, 1212, 1221, 2211, 2121, 2112];
//get first row
var index = randomNum(0, 5)
var row1 = possibleRows[index];
possibleRows.splice(index, 1);
//get second row
index = randomNum(0, 4)
var row2 = possibleRows[index];
possibleRows.splice(index, 1);

var tempBoard = (row1 + "").split('').map(function(s){ return parseInt(s, 10) });
tempBoard = tempBoard.concat((row2 + "").split('').map(function(s){ return parseInt(s, 10) }));

var boardFound = false;
for(var i = 0; i < possibleRows.length; i++){
	tempBoard.splice(8, tempBoard.length);
	var row3 = possibleRows[i];
	tempBoard = tempBoard.concat((row3 + "").split('').map(function(s){ return parseInt(s, 10) }));
	if(i !== j){
		for(var j = 0; j < possibleRows.length; j++){
			tempBoard.splice(12, tempBoard.length);
			var row4 = possibleRows[j];
			tempBoard = tempBoard.concat((row4 + "").split('').map(function(s){ return parseInt(s, 10) }));			
			
			var a = tempBoard.map(function(v){ return { v: v } });
			if(validationObj.validateSamesies(a) && validationObj.validateEqualColors(a) && validationObj.validateThrees(a)){
				boardFound = true;
				break;
			}
		}
	}
	if(boardFound){
		break;
	}
}

var lockedIndexes = [];
for(var i = 0; i < randomNum(3, 4); i++){
	var go = true;
	while(go){
		var rtemp = randomNum(0, 15);
		if(lockedIndexes.indexOf(rtemp) < 0){
			lockedIndexes.push(rtemp);
			go = false;
		}
	}	
}

var board = [];
for(var i = 0; i < tempBoard.length; i++){
	if(lockedIndexes.indexOf(i) < 0){
		tempBoard[i] = 0;
		board[i] = new Square({ v: 0, locked: false });
	}else{
		board[i] = new Square({ v: tempBoard[i], locked: true });
	}
}

var game = new Board(board);

// var game = new Board([
// 	new Square({ v: 0, locked: false }), new Square({ v: 1, locked: true }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), 
// 	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 2, locked: true }), new Square({ v: 0, locked: false }),
// 	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }),
// 	new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 0, locked: false }), new Square({ v: 2, locked: true })
// ]);

App.page.show(new BoardView({ collection: game }));
	
App.start({});