//11.6. - 봉재 - 페이지 수정 취소를 누르면 이동하는 페이지임 
function previousPage()
{
	location.href="./BoardViewPage.html?seq="+getUrlSeq();
}

//11.6. - 봉재 - 이전 정보를 바탕으로 내용을 가져오는 함수임
function get_PostInfoBySeq_info(){
	member_load();

	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	
	var params = "boardNumSeq="+seq+"&boardWriter="+sessionStorage.getItem("ase.id");
	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/board/board_view.do",
        callback:"callbak",
		dataType: "jsonp",
		data:params,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		$("#tbBoardSubject").val(v["boardSubject"]);
            		$("#tbBoardContents").text(v["boardContents"]);
            		$("#tbfinishedTimeBefore").val(v["boardFinishedTime"]);
            		if(v["boardOpenPolicy"] =="PU"){
            			$(':radio[id="OpenPolicy-1"]').attr("checked", "checked");
            		}else{
            			$(':radio[id="OpenPolicy-2"]').attr("checked", "checked");
            		}
          		
            	}
            	if(k=="fail"){
            		alert("Fail to bring post information!");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to server");
        }
    });
}

//11.6. - 봉재 - 수정 완료 이후 제출하는 함수
function updatePost(){

	var finishedtime = "";
	
	if ( $("#tbBoardSubject").val() == "")
	{
		alert("Alert!! Please fill the Title field!!");
		return false;
	} 
	if ( $("#finishedTime").val() == "")
	{
		finishedtime = $("#tbfinishedTimeBefore").val();
	}else{
		finishedtime = $("#finishedTime").val();
	} 
	
	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	
	var openPolicy = $(':radio[name="OpenPolicy-choice"]:checked').val();
	var registeruserID = sessionStorage.getItem("ase.id");
	
	var param ="boardNumSeq="+seq 
		+"&boardSubject="+$("#tbBoardSubject").val()
		+"&boardWriter="+registeruserID
		+"&boardContents="+$("#tbBoardContents").val()
		+"&boardOpenPolicy="+openPolicy
		+"&boardFinishedTime="+finishedtime;

	
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/board/board_update.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		timeout : 4000,
		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("Success to register your post!!");
            		
  
            		location.href="./welcome.html"
            	}
            	
            	if(k=="fail"){
            		alert("Fail to register your Post!! Please try again!!");
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