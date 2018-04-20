
$(document).ready(function() {
	searchBars();
	changeBarWidth();
});


function searchBars(){
	$("#content div").each(function(i, curr)
	{
		var name = $(curr).attr('id');
		var sn = document.getElementById('search').value.toLowerCase();
		if (sn == "") {
			$('#content > div').show();
		}
		else if(sn == name){
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
			console.log(data.densities);
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


