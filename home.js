$(document).ready(function() {
	searchBars();
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