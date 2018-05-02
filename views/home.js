var currLoc = "";

$(document).ready(function() {
	// CURRENT B U G: not popping up again when user refreshes or tries to access
	// before logging in then actually logs in
	if(localStorage.getItem('popState') != 'shown'){
		$("#popup").hide().fadeIn(1000);
		$("#text1").hide().fadeIn(1000);
         localStorage.setItem('popState','shown')
     }
		 //close the POPUP if the button with id="close" is clicked
		 $("#submit1").on("click", function (e) {
				 e.preventDefault();
				 $("#popup").fadeOut(1000);
		 });
		 $("#submit2").on("click", function (e) {
				 e.preventDefault();
				 $("#popup2").fadeOut(1000);
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
	}
}

function processNewInfo() {
	// use global variable and entered number to update the database
	var newPercent = $("#currDensity").val();
	newPercent = parseInt(newPercent);
	newPercent = newPercent / 100; // prints decimal correctly
	// TODO send post request to server
}

function searchBars(){
	$("#content div").each(function(i, curr)
	{
		var name = $(curr).attr('id');
		var alt = $(curr).attr('xml:id');
		var sn = document.getElementById('search').value.toLowerCase();
		if (sn == "") {
			$('#content > div').show();
		}
		else if(sn == name || sn == alt){
			$("#content > div").hide();
			$('#content > div[id*="'+name+'"]').show();
		}
	});
}

var intvl1 = setInterval(changeBarWidth, 3600000); //set every hour: 3600000, every min: 60,000
// var invtl2 = setInterval(sendData, 60000);

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

			//manually change width of progress depending on what db query returns (is there a more efficient way to do this)
			$("#a-bar").css("width", dens[0]+"%");
			$("#bh-bar").css("width", dens[1]+"%");
			$("#cit-bar").css("width", dens[2]+"%");
			$("#faunce-bar").css("width", dens[3]+"%");
			$("#hay-bar").css("width", dens[4]+"%");
			$("#jww-bar").css("width", dens[5]+"%");
			$("#ratty-bar").css("width", dens[6]+"%");
			$("#rock-bar").css("width", dens[7]+"%");
			$("#scili-bar").css("width", dens[8]+"%");
			$("#w-bar").css("width", dens[9]+"%");
		}
	});
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
