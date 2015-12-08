var raspberrySerialNumber;
var checkSAInfo = 0;
//11.16. - 대한 - 이 페이지에서 취소를 누를 경우 이동하는 페이지
function previousPage() {
	location.href="./welcome.html";
}

//11.16. - 대한 - Submit 누를 경우 아두이노 등록으로 이동하는 페이지로 전환
function moveRegisterArduinoNodeInfoPage() {
	location.href="./ArduinoManager_FindArduinoPage.html";
}

function getraspberryRegistrationInfo(){
	system_admin_check();
	member_load();
	get_raspberryInfo();
	
}

function get_raspberryInfo(){

	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	
	var param1 = "raspberryNumSeq="+seq;

	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_UnconfirmedRaspberry.do",
        async: false,
		dataType: "jsonp",
		data: param1,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		$("#tbSASerialNumber").text(v["raspberryNumSN"]);
            		$("#tbSAIPAddress").text(v["raspberryIPAddr"]);
            		raspberrySerialNumber = v["raspberryNumSN"];
      	
            	}
            	if(k=="fail"){
            		alert("Fail to bring Raspberry information!");
            		return false;
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to server");
        	return false;
        }
    });

}

function get_SAInfo(){

	var param2 = "raspberryNumSN="+raspberrySerialNumber;
	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_UnconfirmedRaspberrySA.do",
        dataType: "jsonp",
		data: param2,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		$("#btGetSAInfo").hide();
            		var i=1;
            		var html = '';
            		
            		html += '<tr>';
            		html += '<td width="120">Num</td>';
            		html += '<td width="400">SA Type</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
            			
               			html += '<tr>';
            			html += '<td width="120">'+i+'</td>';
            			html += '<td width="400">'+m["saType"]+'</td>';
                		html += '</tr>';
                		i++;
            		});
            		
            		$("#DisplayingSAInfo").html(html);
            		checkSAInfo = 1;
            		
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no Connected Sensor and Actuatornow!</td>';
            		html += '</tr>';
            		$("#DisplayingSAInfo").html(html);
            		
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to server");
        }
    });
	
}

function RegisterRaspberryConfiguration(){


	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	
	
	if (checkSAInfo == 0)
	{
		alert("Alert!!! Please check the SA Information!!");
		return false;
	}
	if($("#tbGetIDinfo").val() == ""){
		alert("Alert!! You must put the ID for your convienience");
		return false;
	}

	var param3 = "raspberryNumSN="+raspberrySerialNumber+"&raspberryID="+$("#tbGetIDinfo").val()+"&raspberryStatus=1&raspberryServerAdmin="+ sessionServerAdmin;
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/ConfirmeRaspberry.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param3,	
		timeout : 4000,
		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("Success to register Raspberry!!");
            		
  
            		location.href="./RaspberryManagerPage.html"
            	}
            	
            	if(k=="fail"){
            		alert("Fail to user registration!! Please try again!!");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Can not connect to server!!");
        }
		
    });
    return false;
}