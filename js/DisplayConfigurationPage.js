/**
  * 쿠키값 추출
  * @param cookieName 쿠키명
  */
function moveontonextpage(){
	location.href="./welcome.html";
}


function loadDisplayConfigurationPage(){
	member_load();
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	var param = "sessionServerAdmin="+sessionServerAdmin+"&raspberryStatus=1";	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_AllDisplayList.do?"+param,
        callback:"callbak",
		dataType: "jsonp",
		timeout : 4000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
               		var html = '';
               		html += '<tr>';
            		html += '<td>ID</td>';
            		html += '<td>Sensor Type</td>';
            		html += '<td>Display?</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
                		html += '<tr>'
                		html +=	'<td>'+m["raspberryID"]+'</td>';
                		html +=	'<td>'+m["saType"]+'</td>';
                		html += '<td> <input type="checkbox" name="checkbox-1" id="'+m["saNumSeq"]+' "value="'+m["saNumSeq"]+'"/></td>';
                		html += '</tr>';
            		});
            		$("#saDisplayConfiguration").append(html);
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no Sensor Information in your SMART AL</td>';
            		html += '</tr>';
            		$("#saDisplayConfiguration").append(html);
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
}

function applyConfig(){

	var chk = document.getElementsByName("checkbox-1"); 
	var len = chk.length;    
	var checkRow = '';      
	var checkCnt = 0;
	var checkCntResult = 0;
	var configInfo = '';

	for(var i=0; i<len; i++){
		if(chk[i].checked == true){
			checkCntResult = checkCnt++;        
		}
	}
	
	if (checkCntResult == 0){
		 localStorage.setItem("ase.config", "");
		 location.href = "./welcome.html";
		 return false;
	}
	
	checkCnt = 0;
	for(var i=0; i<len; i++){
		if(chk[i].checked == true){  
			checkRow = chk[i].value;
			if (checkCnt==checkCntResult){
				configInfo += checkRow;
			}else{
				configInfo += checkRow + ',';
				checkCnt++;
			}
			
			checkRow = '';    
		}
	}
	 
	 localStorage.setItem("ase.config", getEncryption(configInfo));
	 location.href = "./welcome.html";
}