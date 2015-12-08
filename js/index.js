var validIdcheck = 0;
var domainText = getDomain();	

//취소 버튼 누를시
function previousPage()
{
	location.href="./index.html"
}

function get_initial_info(){
	//tizen.systeminfo.getPropertyValue("BUILD", SuccessCallback, ErrorCallback);
	tizen.systeminfo.getPropertyValue("WIFI_NETWORK", onSuccessCallback, onErrorCallback);

	if (localStorage.getItem("cipher1") != null){
		$("#tbLoginId").val(getDecryption(localStorage.getItem("cipher2")));
		$("#tbLoginPassword").val(getDecryption(localStorage.getItem("cipher3")));
		$("#cbRememberMe").attr("checked", true);
	}

	
}

//11.4. 아이디 중복 체크 이후 아이디 텍스트 필드 수정 불가 및 버튼 disabled 기능 추가

function checkUniqueId(){
	
	var param = "userID="+$("#tbRegId").attr("value");	

	// Alert when the ID is null
	if ( $("#tbRegId").val() == "")
	{
		alert("Alert!! Please fill the ID first");
		return false;
	}
	
	// check whether the ID is over 4 characters  
	if ($("#tbRegId").val().length < 4) 
	{
		alert("Alert!! ID must be over 4 characters ");
		return false;
	} 
	// Server communication! 
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/user_checkUniqueId.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		timeout:4000,
		//when Success to check, the ID input box is disable and the button is disabled 
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("You can use this ID!! Thanks!");
            		validIdcheck = validIdcheck + 1;
            	    $("#btnIDCheck").attr("disabled", true);
            		$("#tbRegId").attr("readonly", true);
            	}
            	
            	// 동일한 ID가 있는 경우
            	if(k=="fail"){
            		alert("Alert! Your Id is already used. Please rewrite your ID .");
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


var reg_pwd = /^.*(?=.{8,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
var reg_phone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;

//11.3. -봉재 - 회원가입처리 및 아이디 중복 체크 기능 수행여부 추가(전역변수) 

function registerComplete(){
	
	var birthdate = $("#Birthdate").val();
	var passwd = $("#tbRegPassword1").val();

	if (validIdcheck == 0)
	{
		alert("Alert!!! Please check the Id unique check!!");
		return false;
	}
	if(!reg_pwd.test(passwd)){
		alert("Alert!! Password must be over 8character and under 16 characters mixing character, number, and symbols!");
		return false;
	}
	
	if ($("#tbRegPassword2").val() == "") {
		alert("Alert! Please fill in the password for confirm your password.");
		return false;
	}

	if ($("#tbRegPassword1").val() != $("#tbRegPassword2").val()) {
		alert("Alert! Passwords are not correspond with each other.");
		return false;
	}
	
	if ( $("#tbRegName").val() == "")
	{
		alert("Alert!! Please fill the name field!!");
		return false;
	} 
	
	var phone = $("#tbRegCellPhone").val();
	if(!reg_phone.test(phone)){
		alert("Alert!! please put the correct Cell Phone Number.");
		return false;
	}
	
	var privilege = $(':radio[name="privilege-choice"]:checked').val();
	
	if(privilege == 2){
		if($("#tbRegServerAdmin").val() != ""){
			alert("Alert!! please leave this box with blank!!")
			return false;
		}
		$("#tbRegServerAdmin").val($("#tbRegId").val());
	}
	
	var passworddigest = implement_pbkdf2($("#tbRegPassword1").attr("value"));
	
	var param = "userID="+$("#tbRegId").attr("value")
	+"&userPassword="+passworddigest
	+"&userName="+$("#tbRegName").attr("value")
	+"&userPhoneNumber="+$("#tbRegCellPhone").attr("value")
	+"&userBirthdate="+$("#Birthdate").attr("value")
	+"&userPrivilege="+privilege
	+"&userServerAdmin="+$("#tbRegServerAdmin").attr("value");
	
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/user_registration.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		timeout : 4000,
		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("Success to register user!!");
            		
  
            		location.href="#three"
            	}
            	
            	if(k=="fail"){
            		alert("Fail to user registration!! Please try again!!");
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


// 11.3 - 봉재- 로그인 로직 처리

function login(userId, passwd){

	
	var params = "userID="+userId+"&userPassword="+passwd+ "&userSSID=" + wifissid;
	$.ajax({
        type: "POST",
        url: "http://"+domainText+"/ase_server/user/login.do",
        callback: "callbak",
		dataType: "jsonp",
		data:params,
		timeout : 4000,
        error: function(){
        	alert("Can not connect to server!!");
        }, 
		success: function(data){
        	$.each(data, function(k,v){
        		
            	if(k=="success"){
            		sessionStorage.setItem("ase.id", v["userID"]);
					sessionStorage.setItem("ase.seq", v["userSeq"]);
					sessionStorage.setItem("ase.ssid", v["userSSID"]);
					sessionStorage.setItem("ase.serveradmin", v["userServerAdmin"]);
					
					if($('input:checkbox[name=RememberMe]').is(':checked')){
						localStorage.setItem("cipher1", $('input:checkbox[name=RememberMe]').is(':checked'));
						localStorage.setItem("cipher2", getEncryption(userId));
						localStorage.setItem("cipher3", getEncryption($("#tbLoginPassword").attr("value")));
					}else{
						localStorage.removeItem("cipher1");
						localStorage.removeItem("cipher2");
						localStorage.removeItem("cipher3");
					}
            		location.href="./src/welcome.html";
            	}
            	
            	if(k=="fail"){
            		alert("Fail to Login : check ID, Password, Confirmed");
            		$("#tbLoginId").val("");
            		$("#tbLoginPassword").val("");
            	}
        		
        	});
        }

    });
	
}

// 11.6. - 봉재 - 로그인 로직 처리전 로그인 ID와 Password 확인 
function check()
{
	var id = $("#tbLoginId").attr("value");
	var passwd = implement_pbkdf2($("#tbLoginPassword").attr("value"));
	
	if(id == "")
	{
    	alert("Please fill in the ID text box.");
 		$("#tbLoginId").focus();
 		
 		return false;
	}
	
	if(passwd == "")
	{
	    alert("Please fill in the Password text box.");
		$("#tbLoginPassword").focus();
		
		return false;
	}
	

	login(id, passwd);
	
}


function implement_pbkdf2(msgdata){
	
	var hashdgt = CryptoJS.SHA256(msgdata);
	var key512Bits100Iterations = CryptoJS.PBKDF2(msgdata, hashdgt, {keySize : 512/32, iterations : 100});
	return key512Bits100Iterations;
}
