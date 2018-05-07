var currLoc = "";

$(document).ready(function() {
	// CURRENT B U G: not popping up again when user refreshes or tries to access
	// before logging in then actually logs in
	if(localStorage.getItem('popState') != 'shown'){
		$("#popup").hide().fadeIn(1000);
		$("#text1").hide().fadeIn(1000);
         localStorage.setItem('popState','shown');
     }
		 //close the POPUP if the button with id="close" is clicked
		 $("#submit1").on("click", function (e) {
				 e.preventDefault();
				 $("#popup").fadeOut(1000);
		 });
		 $("#submit2").on("click", function (e) {
				 e.preventDefault();
				 $("#popup2").fadeOut(1000);
				 $("#popup3").hide().fadeIn(1500);
				 $("#text3").hide().fadeIn(1500);
		 });
		 $("#submit3").on("click", function (e) {
				 e.preventDefault();
				 $("#popup3").fadeOut(1000);
		 });
	searchBars();
	changeBarWidth();
});

function processCurrLoc() {
	var dataLoc = $("#currLoc").val(); // this is the location string as formatted in database
	console.log(dataLoc);
	if (dataLoc != "") {
		currLoc = dataLoc;
		var selectedOption = $( "#currLoc option:selected" ).text(); // this is the more user friendly name
		$("#fullQ").text("How full is " + selectedOption + " ?");
		$("#popup2").hide().fadeIn(1500);
		$("#text2").hide().fadeIn(1500);
	} else {
		$("#popup3").hide().fadeIn(1500);
		$("#text3").hide().fadeIn(1500);
	}
}

function processNewInfo() {
	// use global variable and entered number to update the database
	var newPercent = $("#currDensity").val();
	newPercent = parseInt(newPercent);
	newPercent = newPercent / 100; // prints decimal correctly
	console.log("currLoc");
	$.post('/home/updateDens', {dens: newPercent, loc: currLoc}, function(response){
	});

}

function searchBars(){
	$(".allpbars div").each(function(i, curr) {
		var name = $(curr).attr('id');
		var alt = $(curr).attr('xml:id');
		var sn = document.getElementById('search').value.toLowerCase();
		console.log(sn);
		if (sn == "") {
			$('.allpbars > div').show();
		}
		else if(sn == name || sn == alt){
			console.log("in search");
			$(".allpbars > div").hide();
			$('.allpbars > div[id*="'+name+'"]').show();
		}
	});
}

var intvl1 = setInterval(changeBarWidth, 3600000); //set every hour: 3600000, every min: 60,000
// var invtl2 = setInterval(sendData, 60000);
var bars = [".andrews-bar", ".bh-bar", ".cit-bar", ".faunce-bar", ".hay-bar", ".jww-bar", ".ratty-bar", ".rock-bar", ".scili-bar", ".watson-bar"];

function changeBarWidth() {
	$.get('/getDensities', function(data, status) {
		if (status === "success") {
			// console.log(data.densities);
			var dens = [];
			//turn decimal values into percent values for jquery progress bar
			for (var i=0; i<data.densities.length; i++) {
				var p = data.densities[i].population*100;
				dens.push(p);
			}
			//SORT BEFORE DOING THIS?

			//manually change width of progress depending on what db query returns (is there a more efficient way to do this)
			$(".andrews-bar").css("width", dens[0]+"%");
			$(".bh-bar").css("width", dens[1]+"%");
			$(".cit-bar").css("width", dens[2]+"%");
			$(".faunce-bar").css("width", dens[3]+"%");
			$(".hay-bar").css("width", dens[4]+"%");
			$(".jww-bar").css("width", dens[5]+"%");
			$(".ratty-bar").css("width", dens[6]+"%");
			$(".rock-bar").css("width", dens[7]+"%");
			$(".scili-bar").css("width", dens[8]+"%");
			$(".watson-bar").css("width", dens[9]+"%");
		}
	});
}

var opt;
function filterByDensity(option) {
	// var sorted = dens;
	// sorted.sort(function(a,b){return b-a});
	var sorted = [];
	for (var i=0; i<bars.length; i++) {
		var s = [];
		s.push(parseFloat($(bars[i]).css("width")));
		var parent = bars[i].substring(0, bars[i].length-4);
		parent = "#" + parent.split('.').join('');
		console.log(parent);
		s.push(parent);
		sorted.push(s);

	}
	opt = option;
	sorted.sort(sortNum);
	console.log(sorted);
	$(".progress-h").show();
	for (var i=0; i<bars.length; i++) {
		$(sorted[i][1]).css("order", i);
		console.log(sorted[i][1] + " " + $(sorted[i][1]).css("order"));

	}
}

function sortNum(a, b) {
	if (opt === "most") {
		if (a[0] === b[0]) {
	        return 0;
	    }
	    else {
	        return (b[0] < a[0]) ? -1 : 1;
	    }
	}
	else if (opt === "least") {
		if (a[0] === b[0]) {
	        return 0;
	    }
	    else {
	        return (a[0] < b[0]) ? -1 : 1;
	    }
	}
	else if (opt === "all") {
		if (a[1] === b[1]) {
	        return 0;
	    }
	    else {
	        return (a[1] < b[1]) ? -1 : 1;
	    }
	}

}


function filterByLocation(loc) {
	if (loc == "north") {
		$(".west").hide();
		$(".east").hide();
		$(".south").hide();
		$(".north").show();
	}
	else if (loc == "south") {
		$(".west").hide();
		$(".east").hide();
		$(".north").hide();
		$(".south").show();
	}

	else if (loc == "west") {
		$(".north").hide();
		$(".east").hide();
		$(".south").hide();
		$(".west").show();
	}

	else if (loc == "east") {
		$(".west").hide();
		$(".north").hide();
		$(".south").hide();
		$(".east").show();
	}
	else if (loc == "all") {
		$(".west").show();
		$(".north").show();
		$(".south").show();
		$(".east").show();
	}
}
