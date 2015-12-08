
/* 11.5 - 봉재 - 처음 페이지를 열었을때, 사용자가 시스템관리자인지 확인한후 open
 * 페이지가 오픈된 이후 현재 사용자 정보를 세션정보로부터 가져오기 
 * 새롭게 등록한 사용자를 system admin 이름과 confirmed 변수로 가져오는 로직을 포함
 */ 

function systeminfo_list_load()
{
	system_admin_check();
	member_load();
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	
	var param = "userServerAdmin="+sessionServerAdmin+"&userConfirmed=0"
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/user/user_getconfirmationlist.do?"+param,
        callback:"callbak",
		dataType: "jsonp",
		timeout : 4000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
               		var html = '';
               		html += '<tr>';
            		html += '<td>User ID</td>';
            		html += '<td>Name</td>';
            		html += '<td>Confirmed?</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
                		html += '<tr>'
                		html += '<td>' + m["userID"] + '</td>';
                		html += '<td>' + m["userName"] + '</td>';
                		html += '<td> <input type="checkbox" name="checkbox-1" id="'+m["userID"]+' "value="'+m["userID"]+'"/></td>';
                		html += '</tr>';
            		});
            		$("#ConfirmationTable").append(html);
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no new user in your SMART AL</td>';
            		html += '</tr>';
            		$("#ConfirmationTable").append(html);
            		$("#btConfirmationSubmission").hide();
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
}

// 11.5 - 봉재 - 새로운 사용자가 등록한 이후 시스템 관리자에의해 확인된 사용자를 승인하여, 서버로 전송하는 로직  
function submitConfirmation(){

	var chk = document.getElementsByName("checkbox-1"); 
	var len = chk.length;    
	var checkRow = '';      
	var checkCnt = 0;
	var successcounter = 0;

	for(var i=0; i<len; i++){
		if(chk[i].checked == true){
			checkCnt++;        
		}
	}
	
	for(var i=0; i<len; i++){
		if(chk[i].checked == true){  
			checkRow = chk[i].value;
	        var param = "userID="+checkRow;    	
	        $.ajax({
	        	type: "GET",
	        	url: "http://" + domainText + "/ase_server/user/user_updateconfirmationinfo.do?"+param,
	        	callback:"callbak",
	        	dataType: "jsonp",
	        	timeout : 4000,
	        	success:
	        		function(data){
	        		$.each(data, function(k,v){
	        			if (k=="fail"){
	        				alert(checkRow+" confirmation is not updated!!");
	        				return false;
	        			}
	        			if (k=="success"){
	        				successcounter++;
	        				if(successcounter === checkCnt){
	        					alert("All confirmation is complete");
	        					location.href = "./SystemInfo.html";
	        				}
	        			}
	        		});
	        	},
	        	
	        	//404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
	        	error: function(){
	        		alert("Cannot connect to the server");
	        		return false;
	        	}
	        });
			checkRow = '';    
		}

	}
	
}

function moveOnToPatternAnalysisPage(){
	location.href = './PatternAnalysisPage.html';
	
}

