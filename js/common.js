( function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "one" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
} () );

//11.6. - 봉재 - 여기는 wifissid를 가져오기 위한 전역변수 및 콜백함수 정의
var wifissid = '';
var deviceModel = '';

function onSuccessCallback(wifi) {

	wifissid = wifi.ssid;
	alert("You are connectted to "+wifissid);
}

function onErrorCallback(error) {
    alert("Not supported: " + error.message);
}

function SuccessCallback(device) {
	deviceModel = device.manufacturer;
	
    
}

 function ErrorCallback(error) {
    alert("Not supported: " + error.message);
}



//11.6. - 봉재 - 여기는 서버 IP주소를 가져오게 하기 위한 함수임
function getDomain(){
	return "192.168.0.220:8080";
}

var domainText = getDomain();	

//11.6. - 봉재 - 세션 정보를 가져오게 하기 위한 함수 
function check_session(){
	var sessionId = sessionStorage.getItem("ase.id");
	var sessionSeq = sessionStorage.getItem("ase.seq");
	var sessionSSID = sessionStorage.getItem("ase.ssid");
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	if(sessionId == null)
		return "NM";
	else
		return "TM";
}

//11.6. - 봉재 - 가져온 세션 정보를 웹앱 상에 보여주게 하기 위한 함수
function member_load(){
	var tmp = check_session();
	if (tmp== "TM"){
		$("#tbIdentifyUser").text(sessionStorage.getItem("ase.id"));
		$("#tbIdentifyServerAdmin").text(sessionStorage.getItem("ase.serveradmin"));
		$("#tbIdentifySSID").text(sessionStorage.getItem("ase.ssid"));
	} else {
		tizen.application.getCurrentApplication().exit();
	}
}

//11.6. - 봉재 - 서버 관리자인지 아닌지를 확인하기 위한 함수 
function system_admin_check(){
	var sessionid =sessionStorage.getItem("ase.id");
	var sessionserveradmin =sessionStorage.getItem("ase.serveradmin"); 
	if (sessionid === sessionserveradmin){
		
	} else{
		alert("You are not system administartor! Automatically go back welcome page!");
		location.href="./welcome.html";
	}
}

//11.6. - 봉재 - 아직 미구현됨 : 로그아웃
function logout(){
	sessionStorage.removeItem("ase.id");
	sessionStorage.removeItem("ase.seq");
	location.href="main.html";

}

//11.6. - 봉재 - 페이징할때 파라미터값으로 전달된 seq번호를 전달받게 하기 위한 함수임
function getUrlSeq(){
	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	return seq;
}


// 실험용이긴 하지만, 나중에 ID, PW 저장 및 기타 정보 저장에 

function getEncryption(data){
	var cipherText;
	cipherText = Encrypt(data, deviceModel);
	return cipherText;
}

function getDecryption(data){
	var plainText;
	plainText = Decrypt(data, deviceModel);
	return plainText;
}

