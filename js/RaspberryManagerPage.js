function previousPage(){
	
	location.href="./welcome.html";
}

function moveRaspberryManagerFindRaspberryPage() {
	location.href="./RaspberryManager_FindRaspberryPage.html";
}


function get_raspberry_manager_info()
{
	system_admin_check();
	member_load();
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	var param = "sessionServerAdmin="+sessionServerAdmin+"&raspberryStatus=1"	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_ConfirmedList.do?"+param,
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
            		html += '<td>S/N</td>';
            		html += '<td>IP Addr</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
                		html += '<tr>'
                		html += '<td width="120" onclick="MoveRaspberryInfoCheck('+m["raspberryNumSeq"]+')">'+m["raspberryID"]+'</td>';
                		html += '<td width="120" onclick="MoveRaspberryInfoCheck('+m["raspberryNumSeq"]+')">' + m["raspberryNumSN"] + '</td>';
                		html += '<td width="120" onclick="MoveRaspberryInfoCheck('+m["raspberryNumSeq"]+')">' + m["raspberryIPAddr"] + '</td>';
                		html += '</tr>';
            		});
            		$("#Raspberrystatusdisplay").append(html);
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no raspberry node in your SMART AL</td>';
            		html += '</tr>';
            		$("#Raspberrystatusdisplay").append(html);
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
}


function MoveRaspberryInfoCheck(seq){
	location.href="./RaspberryInfoCheck.html?seq="+seq;
}

