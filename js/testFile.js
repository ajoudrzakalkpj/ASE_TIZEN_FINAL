function getTimeNow(){
	
	var date = new Date();
	var newdata = new Date($("#finishedTime").val())
	var comparedata = newdata - date - (9 * 1000 * 60 * 60);
	alert(newdata +" - "+ date + "  = " + comparedata);
}

function Now(){
	alert("it works in right now!!!!");
}

function alertThis(){
	alert("This is reserved time action!!!!");
}


function Reserve(){
	var date = new Date();
	var newdata = new Date($("#finishedTime").val())
	var comparedata = newdata - date - (9 * 1000 * 60 * 60);
	alert(comparedata);
	setTimeout("alertThis()",comparedata);
}