function previousPage(){
	location.href = './welcome.html';
}


function loadPatternAnalysisData()
{
	system_admin_check();
	member_load();
	$("#raspberrySearchInfo").hide();
	$("#btgetGraph").hide();
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
            		html += '</tr>';
               		$.each(v, function(l,m){
                		html += '<tr>'
                		html += '<td width="120" onclick="getRaspberrySAType('+m["raspberryNumSN"]+')">'+m["raspberryID"]+'</td>';
                		html += '<td width="120" onclick="getRaspberrySAType('+m["raspberryNumSN"]+')">' + m["raspberryNumSN"] + '</td>';
                		html += '</tr>';
            		});
            		$("#SelectRaspberry").append(html);
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no raspberry node in your SMART AL</td>';
            		html += '</tr>';
            		$("#SelectRaspberry").append(html);
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
    });
}

function getRaspberrySAType(raspberrySerialNumber){

	$("#SelectRaspberry").hide();
	$("#raspberrySearchInfo").show();
	$("#tbraspberryID").text(raspberrySerialNumber);
	$("#tbraspberryID").val(raspberrySerialNumber);

	var param =  "raspberryNumSN="+raspberrySerialNumber;	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/raspberrycontrol/load_UnconfirmedRaspberrySA.do?"+param,
        callback:"callbak",
		dataType: "jsonp",
		timeout : 4000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
               		var html = '';
               		html += '<select name="select-custom-0" id="saTypeName" data-native-menu="true">';
            		$.each(v, function(l,m){
            			html += '<option value="'+m["saType"]+'">'+m["saType"]+'</option>';
                	});
            		html += '</select>';
            		$("#tbsaType").append(html);
            		$("#btgetGraph").show();
            	}

            	if(k=="fail"){

            		$("#tbsaType").text('no Sensor Actuator');
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
    		$("#tbsaType").text('No connection');
        }
    });

}

function getGraph(){
	
	var param = "salogRaspberrySN="+$("#tbraspberryID").attr("value") + 
	"&salogSAType=" + $("#saTypeName").attr("value") + 
	"&salogLastupdatetime=" + $("#searchDateValue").val();
	
	if($("#saTypeName").attr("value") != "TV_Channel"){
		
		$.ajax({
			type: "GET",
			url: "http://" + domainText + "/ase_server/raspberrycontrol/load_BinaryLogList.do?"+param,
			callback:"callbak",
			dataType: "jsonp",
			timeout : 4000,
			success:
				function(data){
				$.each(data, function(k,v){
					if(k=="success"){
						var container = document.getElementById('visualization');
						var previousValue = 0;
						var idValue = 1;
						var difftime = 0;
						var starttime,endtime,  difftimetemp;
						var html = '<script type="text/javascript">var container = document.getElementById(\'visualization\'); var items = new vis.DataSet('
							var allLogData = '[';
						$.each(v, function(l,m){
							if (m["salogUpdateValue"]=="on"){
								if (previousValue == 0){
									if(idValue==1){
										allLogData += '{id:';
									}else{
										allLogData += ',{id:';
									}
									allLogData += idValue;
									allLogData += ', content:\'';
									allLogData += m["salogSAType"];
									allLogData += '\', start:\'';
									allLogData += m["salogLastupdatetime"];
									starttime = new Date(m["salogLastupdatetime"]);
									
									previousValue = 1;
								}else if(previousValue == 1 && l == (v.length-1)){
									allLogData += '\', end:\'';
									allLogData += m["salogLastupdatetime"];
									allLogData += '\'}';
									endtime = new Date(m["salogLastupdatetime"]);
									difftimetemp = endtime - starttime;
									if (difftimetemp>difftime){
										difftime = difftimetemp
									}
								}
								
							}else if (m["salogUpdateValue"]=="off") {
								if (previousValue == 1){
									allLogData += '\', end:\'';
									allLogData += m["salogLastupdatetime"];
									allLogData += '\'}';
									idValue++;
									previousValue = 0;
									endtime = new Date(m["salogLastupdatetime"]);
									difftimetemp = endtime - starttime;
									if (difftimetemp > difftime){
										difftime = difftimetemp
									}
								}
							}
							
						});
						allLogData += ']';
						
						html += allLogData;
						html += ');  var options = {};  var timeline = new vis.Timeline(container, items, options);</script>'
							$("#visualization").append(html);
						alert(difftime);
						var msecPerMinute = 1000 * 60;
						var msecPerHour = msecPerMinute * 60;
						
						var hours = Math.floor(difftime / msecPerHour );
						difftime = difftime - (hours * msecPerHour );
						
						var minutes = Math.floor(difftime / msecPerMinute );
						difftime = difftime - (minutes * msecPerMinute );
						
						var seconds = Math.floor(difftime / 1000 );
						
						
						alert("Highest Usage Interval is " + hours + " hours " + minutes + " minutes " 
								+ seconds + " seconds!!");
					}			
					if(k=="fail"){
						alert("There is no Log Data in Database.");
					}
				});
			},
			
			//404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
			error: function(){
				alert("Cannot connect to the server");
			}
		});
	
	} else {
			
		$.ajax({
			type: "GET",
			url: "http://" + domainText + "/ase_server/raspberrycontrol/load_BinaryLogList.do?"+param,
			callback:"callbak",
			dataType: "jsonp",
			timeout : 4000,
			success:
				function(data){
				$.each(data, function(k,v){
					if(k=="success"){
												
						var idValue = 1;
						var cnt1= 0, cnt2= 0, cnt3= 0, cnt4= 0, cnt5= 0, cnt6= 0, cnt7= 0, cnt8= 0, cnt9= 0, cnt0 = 0; 
						var html = '<script type="text/javascript">var options = {\'dataset\':{title: \'Channel Analysis\',values:[';
							
						$.each(v, function(l,m){
							switch (m["salogUpdateValue"]){
							case "0": cnt0++; break;
							case "1": cnt1++; break;
							case "2": cnt2++; break;
							case "3": cnt3++; break;
							case "4": cnt4++; break;
							case "5": cnt5++; break;
							case "6": cnt6++; break;
							case "7": cnt7++; break;
							case "8": cnt8++; break;
							case "9": cnt9++; break;
							default : break;
							}
						});
						var options = {
								'dataset':{
									title: 'Web accessibility status',
									values:[cnt0, cnt1 , cnt2, cnt3, cnt4, cnt5, cnt6, cnt7, cnt8, cnt9],
									colorset: ['#2EB400', '#2BC8C9', "#666666", '#f09a93', '#0000ff', '#ffdad9', '#ff1493', '#00ffff', '#ff0000'],
									fields: ['CH0', 'CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6', 'CH7', 'CH8', 'CH9'],
								},
								'donut_width' : 85,
								'core_circle_radius':0,
								'chartDiv': 'visualization',
								'chartType': 'pie',
								'chartSize': {width:300, height:400}
							};
						Nwagon.chart(options);
						var cntall = cnt1+cnt2+cnt3+cnt4+cnt5+cnt6+cnt7+cnt8+cnt9+cnt0;
						alert("CH0 : "+(cnt0/cntall)+"  CH1 : "+(cnt1/cntall)+"  CH3 : "+(cnt3/cntall)+"  CH4 : "+(cnt4/cntall)+"  CH5 : "+(cnt5/cntall)+"  CH6 : "+(cnt6/cntall)+"  CH7 : "+(cnt7/cntall)+"  CH8 : "+(cnt8/cntall)+"  CH9 : "+(cnt9/cntall));
					}			
					if(k=="fail"){
						alert("There is no Log Data in Database.");
					}
				});
			},
			//404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
			error: function(){
				alert("Cannot connect to the server");
			}
		});
	}
}
