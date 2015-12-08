//11.6. - 봉재 -  현재 페이지에서 취소버튼을 눌렀을 때 이동하는 페이지임
function previousPage()
{
	location.href="./welcome.html"
}
//11.6. - 봉재 - 처음 가져오는 데이터를 표시함 여기서는 이 페이지를  호출하면서 가져온 파라미터값을 바탕으로 표시하는 로직 포함
//11.6. - 봉재 - 마지막에 update 및 remove 버튼은 자기가 작성한 게시물만 보여지고, 아니면 보여지지 않음

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
            		$("#tbBoardSubject").attr("readonly", true);
            		$("#tbBoardContents").text(v["boardContents"]);
            		$("#tbBoardContents").attr("readonly", true);
            		$("#tbfinishedTimeBefore").val(v["boardFinishedTime"]);
            		$("#tbfinishedTimeBefore").attr("readonly", true);
            		if(v["boardOpenPolicy"] =="PU"){
            			$(':radio[id="OpenPolicy-1"]').attr("checked", "checked");
            		}else{
            			$(':radio[id="OpenPolicy-2"]').attr("checked", "checked");
            		}
            		$(':radio[name="OpenPolicy-choice"]').attr("disabled", "disabled");
            		
            	}
            	if(sessionStorage.getItem("ase.id") != v["boardWriter"]){
            		$("#btUpdatePost").css("display", "none");
            		$("#btRemovePost").css("display","none");
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

//11.6. - 봉재 - 게시물 삭제는 여기서만 가능함 그리고 반드시 작성자만 삭제할 수 있음 
function RemovePostInfo(){
	var result = confirm("Are you sure to remove?");
	
	if(result){
		var url      = window.location.href; 
		var tmpArr = url.split("?");
		var tmp1Arr = tmpArr[1].split("=");
		var seq = tmp1Arr[1];
		
		$.ajax({
	        type: "GET",
	        url: "http://" + domainText + "/ase_server/board/board_remove.do?boardNumSeq="+seq,
	        callback:"callbak",
			dataType: "jsonp",
			success:
				function(data){
	        	$.each(data, function(k,v){
	            	if(k=="success"){
	            		location.href="./welcome.html";	            			               		
	            	}

	            	if(k=="fail"){
	            		alert("Fail to remove the post information")
	            	}
	        	});
	        },
	        
	        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
	        error: function(){
	        	alert("Cannot connect to server");
	        }
			
	    });
		
	}
}

//11.6. - 봉재 - 작성된 게시물의 seq번호를 바탕으로 수정 페이지로 이동
function getPostInfoToUpdate(){
	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	
	location.href="./BoardModificationPage.html?seq="+seq;
}