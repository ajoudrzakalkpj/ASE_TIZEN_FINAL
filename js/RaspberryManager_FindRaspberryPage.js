/**
 * 
 */
function previousPage(){
	
	location.href="./RaspberryManagerPage.html";
}

function get_raspberry_manager_findRaspberry_info(){
	
	system_admin_check();
	member_load();
	
}

function FindUnconfirmedRaspberry(){
	
	var sessionSSID = sessionStorage.getItem("ase.ssid");
	var param = "sessionSSID="+sessionSSID+"&raspberryStatus=0"	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_UnconfirmedList.do?"+param,
        callback:"callbak",
		dataType: "jsonp",
		timeout : 4000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
               		var html = '';
               		html += '<tr>';
            		html += '<td>S/N</td>';
            		html += '<td>IP Addr</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
                		html += '<tr>'
                		html +=	'<td width="120" onclick="register_raspberry('+m["raspberryNumSeq"]+')">'+m["raspberryNumSN"]+'</td>';
                		html +=	'<td width="120" onclick="register_raspberry('+m["raspberryNumSeq"]+')">'+m["raspberryIPAddr"]+'</td>';
                		html += '</tr>';
            		});
            		$("#unconfirmedRaspberryList").append(html);
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no unconfirmed raspberry node in your SMART AL</td>';
            		html += '</tr>';
            		$("#unconfirmedRaspberryList").append(html);
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
}

function register_raspberry(seq){
	location.href="./RaspberryRegister.html?seq="+seq;
}