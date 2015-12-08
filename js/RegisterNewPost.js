
//11.6. - 봉재 - 이 페이지에서 취소를 누를 경우 이동하는 페이지
function previousPage()
{
	location.href="./welcome.html"
}

//11.6. - 봉재 - 처음 페이지를 열게될때 세션정보를 가져오게 하는 함수 
function get_RegisterNewPost_info(){
	member_load();
}

//11.6. - 봉재 - 정보입력 완료 이후 서버로 데이터 전송하여 저장하는 함수
function PostRegisterationComplete(){

	if ( $("#tbBoardSubject").val() == "")
	{
		alert("Alert!! Please fill the Title field!!");
		return false;
	} 
	if ( $("#finishedTime").val() == "")
	{
		alert("Alert!! Please fill the Finished Time field!!");
		return false;
	} 

	var openPolicy = $(':radio[name="OpenPolicy-choice"]:checked').val();
	var registeruserID = sessionStorage.getItem("ase.id");
	var registerServerAdmin = sessionStorage.getItem("ase.serveradmin");
	
	var param = "boardSubject="+$("#tbBoardSubject").val()
		+"&boardWriter="+registeruserID
		+"&boardContents="+$("#tbBoardContents").val()
		+"&boardOpenPolicy="+openPolicy
		+"&boardFinishedTime="+$("#finishedTime").val()
		+"&boardServerAdmin="+registerServerAdmin;

	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/board/board_write.do",
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

            		location.href="#three"
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