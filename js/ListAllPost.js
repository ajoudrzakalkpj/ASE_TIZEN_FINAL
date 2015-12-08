//11.6. - 봉재 - 처음 이 페이지에 이동한 경우 세션정보와 해당 가입자와 관련되는 정보 및 서버 관리자아래의 가입자에게 공개된 정보를 가져옴
function All_Post_load()
{
	member_load();
	Load_All_Post_List(1);
}

//11.6. - 봉재 - 리스트 나열하는것 10개 단위로 리스트가 됨
function Load_All_Post_List(page){
	
	var sessionId = sessionStorage.getItem("ase.id");
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	var boardOpenPolicy = "PU";
	
	var end = 10;
	var start = parseInt(page)*10-10;
	
	var param = "sessionId="+sessionId+"&sessionServerAdmin="+sessionServerAdmin+"&boardOpenPolicy="+boardOpenPolicy+"&start="+start+"&end="+end; 
	
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/board/board_loadallpostlist.do?",
        callback:"callbak",
        data: param,
		dataType: "jsonp",
		timeout : 5000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		var html = '';
            		html += '<tr>';
            		html += '<td width="120">ID</td>';
            		html += '<td width="300">Title</td>';
            		html += '<td width="300">Due Time</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
            			html += '<tr>'
            			html += '<td width="120" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardWriter"]+'</td>';
                		html += '<td width="300" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardSubject"]+'</td>';
                		html += '<td width="300" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardFinishedTime"]+'</td>';
                		html += '</tr>';
            		});
            		
            		$("#PostListTable").html(html);
            		
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no post now!</td>';
            		html += '</tr>';
            		$("#PostListTable").html(html);
            		
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
		
    });
	load_paging(sessionId, sessionServerAdmin, boardOpenPolicy);
	
}

//11.6. - 봉재 - 페이징 번호와 하이퍼 링크를 걸기위한 함수임
function load_paging(sessionId, sessionServerAdmin, boardOpenPolicy){
	
	var param =  "sessionId="+sessionId+"&sessionServerAdmin="+sessionServerAdmin+"&boardOpenPolicy="+boardOpenPolicy;
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/board/board_count.do",
        callback:"callbak",
		dataType: "jsonp",
		data : param,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		var count = parseInt(v);
            		var pageCount = count/10;
            		var html = '';
            		
            		for(i=1; i<pageCount+1; i++){
            			html += "<a href='#' onclick='Load_All_Post_List("+i+")'><span id='page"+i+"'>"+i+"</span></a>&nbsp";
            		}
          			$("#paging").html(html);
            		
            	}

            	if(k=="fail"){
            		
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Can not Connect to Server");
        }
		
    });
}

//11.6. - 봉재 - 리스트에 포함된 함수를 클릭하면 해당 View페이지로 이동시키기 위한 함수임
function view_article(seq){
	location.href="./BoardViewPage.html?seq="+seq;
}

//11.6. - 봉재 - 목록 제일 아래에 위치한 새로운 글쓰기 페이지로 전환시키기 위한 함수임
function moveRegisterNewPostPage(){
	location.href="./RegisterNewPost.html";
}