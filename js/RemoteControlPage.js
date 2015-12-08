var ipAddressinfo = new Array();

function previousPage()
{
	location.href="./welcome.html"
}


function available_remote_device_load(){
	
	member_load();
	var sessionssid = sessionStorage.getItem("ase.ssid");
	var sessionServerAdmin  = sessionStorage.getItem("ase.serveradmin");
	var param = "sessionServerAdmin=" + sessionServerAdmin + "&sessionSSID=" + sessionssid + "&raspberryStatus=1";	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_ConfirmedListWithSSID.do?"+param,
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
        				html += '<td>IP Addr</td>';
        				html += '</tr>';
        				$.each(v, function(l,m){
        					
        					ipAddressinfo[l] = m["raspberryIPAddr"];
        					html += '<tr>'
        					html += '<td width="120" onclick="MovingRaspberryControlPage('+ l +')">' + m["raspberryID"] + '</td>';
        					html += '<td width="120" onclick="MovingRaspberryControlPage('+ l +')">' + m["raspberryIPAddr"] + '</td>';
        					html += '</tr>';
        				});
        				$("#Raspberrycontroldisplay").append(html);
        			}

        			if(k=="fail"){
        				html = '<tr>';
        				html += '<td> There is no raspberry node in your Network</td>';
        				html += '</tr>';
        				$("#Raspberrycontroldisplay").append(html);
        			}
        		});
        	},
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
	
}


function MovingRaspberryControlPage(sequence){
	
	$("#Raspberrycontroldisplay").hide();
	$("#tbRapsberryIP").text("> "+ipAddressinfo[sequence]); 
	
	var baseurl = 'http://';
	//var ipaddress = '210.107.198.173';
  
	var ipaddress = ipAddressinfo[sequence];
	var baseport = ':8000/';
	//var uri = 'hello';
	
	
	var url = baseurl + ipaddress + baseport ;
	document.getElementById('myIframe').setAttribute("width", "100%");
	document.getElementById('myIframe').setAttribute("height", 400);

	//var testurl = 'http://192.168.0.179:8000/';
	document.getElementById('myIframe').src = url;

	
}