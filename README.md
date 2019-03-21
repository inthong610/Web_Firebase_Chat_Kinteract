# "Kinteract: "
> 수업 중 단체 웹 채팅.

# 1. Kinteract
 

## a. 서비스 설명

Kinteract는 K와 interact의 합성어로서, K= I(In) + C(Class)로 수업 중 소통한다는 의미를 담고있습니다.

Kinteract의 이름에서 알 수 있듯이 In Class, 즉 수업 시간에 활용하거나 질문을 돕는 웹 채팅입니다. 

Kinteract 채팅 웹을 통해 _단체 채팅, 좋아요-가산점 기능, 좋아요 랭킹, 질문 데이터 빈도수 분석 및 시각화_를 주요 기능으로 구현하였습니다.


## b. 설치 방법

1. [github 주소](https://github.com/wonyeonglee/wonyeong)에서 zip파일 다운로드 후 압축 해제 후 소스 코드가 있는 경로로 이동(Window / Mac 동일)
```sh
cd 설치경로/wonyeong-master/web-start
```
2. [firebase console](https://console.firebase.google.com/)에 접속 후 프로젝트 추가 버튼을 눌러 프로젝트 이름 입력 후 추가
3. 생성 된 프로젝트 클릭 후 좌측 메뉴에 database 메뉴 클릭
4. 실시간 데이터베이스 하단 보기 버튼 클릭 후 상단 메뉴 중 규칙 클릭
5. 규칙 내용을 아래와 같이 변경 후 저장
```javascript
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": true,
    ".write": true
  }
}
````
6. node.js 미 설치시 링크를 참조하여 설치 <https://nodejs.org/en/>
7. command line(shell)으로 돌아가 firebase 컴포넌트 설치
```sh
npm -g install firebase-tools
```
8. 프로젝트를 생성한 아이디로 로그인 하기
```sh
firebase login
```
9. firebase 에서 사용할 프로젝트 선택
```sh
firebase use --add
```
10. firebase 앱 실행
```sh
firebase serve
```
11. localhost:5000 접속(포트번호 5000 아닐 수 있음. 확인해야 함)

12. 호스팅 원할 시
```sh
firebase deploy
```


## c. 사용 방법

+ 호스팅 주소 : https://openswteam.firebaseapp.com/

+ 시연 영상 :

[![](http://img.youtube.com/vi/JcxVNpjbq7U/0.jpg)](http://www.youtube.com/watch?v=JcxVNpjbq7U "Kinteract")

+ 시연 캡처 :

0. 로그인 화면
![13](https://user-images.githubusercontent.com/43198923/50206284-464aa280-03ae-11e9-8cdc-b902494ec345.png)

1. 메인화면 및 로그아웃 화면
![1](https://user-images.githubusercontent.com/43198923/50205785-ca038f80-03ac-11e9-8f2e-bd1560a5d922.png)
![default](https://user-images.githubusercontent.com/43198923/50206228-1c917b80-03ae-11e9-8a4d-787498a7a872.png)

2-1. 채팅방 생성
![3](https://user-images.githubusercontent.com/43198923/50205843-0c2cd100-03ad-11e9-8872-a599849341b9.png)
![4](https://user-images.githubusercontent.com/43198923/50205871-1d75dd80-03ad-11e9-998a-dbfaca1e6cfb.png)

2-2. 채팅방 삭제
![default](https://user-images.githubusercontent.com/43198923/50206791-dfc68400-03af-11e9-97c2-a2ce13ced994.PNG)

3. 사진 전송
![11](https://user-images.githubusercontent.com/43198923/50206090-aab93200-03ad-11e9-881a-af3de3a5e363.png)
![5](https://user-images.githubusercontent.com/43198923/50205888-2b2b6300-03ad-11e9-9e4f-c11f27cba864.png)

4. 좋아요 기능 및 마이페이지에서 좋아요 합계 확인
![6](https://user-images.githubusercontent.com/43198923/50205986-688ff080-03ad-11e9-8383-82597815dddf.png)
![12](https://user-images.githubusercontent.com/43198923/50206091-ab51c880-03ad-11e9-8e41-685f7981c125.png)

5. 좋아요 랭킹 페이지
![8](https://user-images.githubusercontent.com/43198923/50206009-75acdf80-03ad-11e9-837a-c21ea18083af.png)

6. Word Cloud 데이터 시각화
![9](https://user-images.githubusercontent.com/43198923/50206010-76de0c80-03ad-11e9-9309-43191a9af08d.png)


## d. 데이터 베이스 구조
kinteract에서 사용한 데이터베이스는 Firebase Realtime Database이며, 구조는 다음과 같습니다.


```sh
---chat_list       // 채팅방의 정보가 담겨있는 테이블
  ---{채팅방 이름}  // 각 채팅방의 key값을 채팅방 이름으로 정함
     --- code      // 채팅방 입장시 필요한 코드 저장
     --- message   // 채팅방에 존재하는 메세지 정보가 담겨있는 테이블
         --- likeUserList // 메세지를 좋아하는 유저의 리스트 정보가 담긴 테이블
             ---{유저의 uid}
         --- createdAt // 메세지가 저장된 시간
         --- user  // 해당 메세지를 보낸 유저의 uid 저장
         --- text  // 해당 메세지의 텍스트 정보 저장(텍스트 메세지)
         --- imageURL // (이미지 메세지)
         --- storageURI // (이미지 메세지)
     --- user      // 채팅방에 존재하는 유저 정보가 담겨있는 테이블
         ---{유저의 uid}
             --- like_num // 해당 채팅방에서 유저가 받은 좋아요 개수 count
             --- name // 유저의 이름 저장
             --- profilePicUrl // 유저의 프로필 사진 저장 경로
---user_list       // kinteract에 가입한 유저정보가 담겨있는 테이블
   ---{유저의 uid} // 유저의 uid로 key값 할당
      --- name // 유저의 이름 저장
      --- profilePicUrl // 유저의 프로필 사진 저장 경로
      --- room_list  // 해당 유저가 들어간 채팅방 리스트가 있는 테이블
          ---room_name // 해당 채팅방의 키값을 저장
```
## e. 주요 기능 및 관련 코드/API 설명

### - 로그인 & 로그아웃
로그인 버튼 클릭시 실행 구글로 로그인 하는 provider 실행하였습니다.
```javascript
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

```
firebase에서 제공하는 옵저버를 활용 하여 로그인 상태 일시 메인페이지로 넘어가는 로직으로 작성했습니다.

ref의 update 함수를 사용하여 최초로 로그인 했을 시엔 유저 정보를 user_list 안에 넣고 기존 사용자가 로그인 했을 시 최신 정보(이름, 사진)로 업데이트 되도록 구현했습니다.

```javascript
 firebase.auth().onAuthStateChanged(authStateObserver);


function authStateObserver(user) {
    if (user) { // 로그인 되었을 때
         firebase.database().ref("/user_list/"+getUserUid()).update({ 
          name: getUserName(),
          profilePicUrl: getProfilePicUrl()
        }).catch(function(error) {
          console.error("Error writing new message to Realtime Database:", error);
        }).then(function(){
          location.href="/index.html";
        }); 
     }
// 로그아웃 후 로그인 시 정보가 전부 날아가는 버그 수정 
//https://firebase.google.com/docs/database/web/read-and-write?hl=ko

```
위에 사용 된 함수는 firebase에서 기본적으로 제공된 함수를 이용했으며 세부 내용은 다음과 같습니다.

```javascript


function getUserName() { //현재 로그인 되어 있는 유저의 이름 가져오기
  return firebase.auth().currentUser.displayName;
  // TODO 5: Return the user's display name.
}

function getProfilePicUrl() { //현재 로그인 한 유저의 프로필 사진 불러오기, 없을 시 기본 사진 불러오기
  return firebase.auth().currentUser.photoURL || 
'https://t3.ftcdn.net/jpg/01/50/44/40/500_F_150444057_XafiBkyICzuWgYHWAPCYETzH5zwCKSri.jpg';
  // TODO 4: Return the user's profile pic URL.
}

function getUserUid(){ //현재 로그인 한 유저의 이메일 불러오기
  return firebase.auth().currentUser.uid
}

```

### - 자신의 채팅방 리스트 불러오기
처음 메인페이지에 접속 했을 시 자신이 속해 있는 채팅방 리스트 불러오는 함수입니다.
```javascript

function getChatList(){ // 현재 로그인 한 유저의 채팅방 리스트 불러오기
  var callback = function(snap) {
    var data = snap.val(); // 불러온 정보(snap)를 javascript로 사용할 수 있게 변경
    displayChatlist(snap.key, data.room_name); // 채팅 리스트 불러오기

    firebase.database().ref('/chat_list/'+data.room_name+'/user/'+getUserUid()+'/like_num')
.on('value',function(snapshot){
      //채티방 리스트에 존재하는 자기 아이디의 좋아요 개수 불러오기
      displayChatLikeList(snapshot.key, data.room_name,snapshot.val()); // 좋아요(My incentive) 리스트 불러오기
    });
  }
  firebase.database().ref('/user_list/'+getUserUid()+'/room_list/').on('child_added', callback); 
  // 자기 정보에 존재하는 채팅방 리스트 불러오기
  // child_added 는 해당 데이터베이스에 데이터가 추가 됐을 시 callback 함수를 실행하라는 의미
}
```

### - 채팅방 추가 기능 (Add Class)
채팅방을 새로 만들거나 입장이 가능합니다. 채팅방의 이름을 key값으로 사용하고 있으며, 해당 채팅방이 존재 하지 않을 시 채팅방을 생성하는 방식으로 되어있습니다. 채팅방을 입장할 시 code를 이용해 검증 과정을 거치고 있습니다.

```javascript

$("#add-class-modal-btn").on('click', function() { // 채팅방 추가 알림창에서 추가하기 버튼 클릭했을 시
  var chatListRef = firebase.database().ref('chat_list/'+$("#chat-name-input").val());
  chatListRef.once('value', function(snapshot) {
     // 해당 목록에 존재하는 데이터 한번만 불러오기 https://firebase.google.com/docs/database/web/read-and-write?hl=ko
    if(snapshot.val()!=null){ 
      // 해당 이름을 가진 채팅방이 존재할 시
      if(snapshot.val().code== $("#chat-code-input").val()){ 
        // 해당 채팅방의 코드와 입력한 코드가 일치 할 시
        addRoomListInMyInfo($("#chat-name-input").val());
      } else{ // 해당 채팅방의 코드와 입력한 코드가 일치하지 않을 시
        $("#myModal").modal('hide');
        alert("코드가 일치 하지 않습니다. 다시 시도 해 주세요")
      }
    } else { // 해당 이름을 가진 채팅방이 존재하지 않을 시
      $("#myModal").modal('hide');
      $("#confirmModal").modal('show'); // 해당 코드로 채팅방 생성할 것 인지 묻는 알림창 띄우기
    }
  });
});



```


### - 채팅방 삭제 기능 (Delete Class)
현재 들어가 있는 채팅방을 삭제할 수 있습니다. 채팅방 추가와 마찬가지로 채팅방의 이름을 key값으로 사용하여, 해당 채팅방이 존재 할 시 채팅방을 삭제할 수 있으며 삭제를 위해서는 Firebase database의 'chat_list'/해당 채팅방/'user'에서 해당 사용자를 삭제하고 'user_list'/해당 사용자/'room_list'에서 해당 채팅방을 삭제하는 두 가지 과정을 거칩니다.

```javascript
function deleteRoomListInMyInfo(name){ // 내가 가지고 있는 룸 리스트에 채팅방 삭제 하기
  var keyVal;
  var ref = firebase.database().ref('user_list/'+getUserUid()+'/room_list');
  if (ref.orderByChild('room_name').equalTo(name).on("value", function(snapshot) {
      snapshot.forEach((function(child) {
        keyVal=child.key; // 해당 사용자의 room list 중 전달된 이름과 일치하는 것을 찾아 채팅방 key값을 저장
      }
    ))
  }))
  {
      deleteMyInfoInChatRoom(name);
      firebase.database().ref('user_list/'+getUserUid()+'/room_list/'+keyVal).remove();   //채팅방 key값을 이용해 삭제
      $("#myModal2").modal('hide');
      window.location.reload(); //삭제 후 페이지 새로고침 > 업데이트 된 채팅방 리스트 목록 확인
    }
  else{ // 해당 사용자의 room list 중 전달된 이름과 일치하는 것이 없으면 
    alert("존재하지 않는 채팅방입니다!"); //종료
    $("#myModal2").modal('hide');
  };
}

function deleteMyInfoInChatRoom(chatKey){ // 룸 정보에서 유저 정보 빼기
  firebase.database().ref('chat_list/'+chatKey+'/user/'+getUserUid()).remove(); //chat list의 유저 정보들에서 해당 유저 정보 삭제
  firebase.database().ref('chat_list/'+chatKey+'/message/').push({
    text: getUserName()+"님이 퇴장하셨습니다.",
  });
}

```

### - 채팅방 클릭 했을 시
채팅방을 클릭 했을 시 실행되는 함수입니다. 채팅방을 클릭 했을 시 기존에 존재 했던 데이터베이스 옵저버를 해제하고 메세지들을 불러옵니다.

```javascript
  container.addEventListener('click' , function(e){ 
    // 각 채팅방이 클릭되었을 때
    firebase.database().ref('/chat_list/'+currentChatKey+'/user/').off(); 
    // 새로운 채팅방으로 넘어갔으니 대기하던 firebase off
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').off(); 
    // 새로운 채팅방으로 넘어갔으니 대기하던 firebase off
    $("#chat_list>li.active").removeClass("active"); 
    // 기존 채팅방 active 상태 풀리도록 CSS 해제
    $(this).addClass("active"); 
    // 새로운 채팅방이 active 되도록
    $("#message-box").html('');
    currentChatKey = $(this).find(".name").text(); 
    // 새로운 채팅방에 name 클래스(채팅방)를 가진 요소를 찾아서 그 텍스트를 currentChatKey에 넣음
    $("#chat-name").html(currentChatKey+" "+'&nbsp;&nbsp;<i class="fas fa-users"></i> <span id="chatUserCount"></span>');  
    // 채팅창 상단에 채팅방 이름 부분 + user 몇명인지 표시
    currentChatUserInfo = []; 
    // 예전 채팅방의 유저 인포 리셋
    classClick(currentChatKey); 
    // (새로운 채팅방에 존재하는)유저 리스트랑 메세지 리스트 불러옴
  });
```

### - 메세지 불러오는 함수
채팅방을 클릭 했을 시 기존 채팅방에 존재하는 메세지를 불러옵니다. 해당 메세지에는 메세지 내용, 좋아요 개수, 작성자 프로필 사진을 불러옵니다. 해당 기능은 firebase database에 on('child_added') 와 on('child_changed')함수를 바탕으로 구현 되었습니다.

child_added의 경우 메세지가 추가 됐을 때마다 실행이 되어 다른사람이 적은 메세지를 실시간으로 화면에 노출 할 수 있습니다.

또한 child_changed의 경우 메세지 내용 자체는 변하지 않으나 다른사람이 좋아요 버튼을 눌렀을 시 실시간으로 개수 변경을 업데이트 할 수 있도록 구현 하였습니다.
```javascript

function loadMessages(chatKey) { // DB에서 메세지 리스트 불러오기
  var callback = function(snap){
    var data = snap.val(); // snap의 데이터 불러와서 할당
    for(var i = 0 ; i < currentChatUserInfo.length;i++){
       // 메세지 내가 보냈는지(채팅창에서 오른쪽), 상대방이 보냈는지(채팅창에서 왼쪽)
      if(currentChatUserInfo[i]['uid']==data.user){ 
        // 현재 채팅방 유저의 리스트[i] == 현재 보낸 메세지의 유저 id 일 때 -> 메세지 보낸 사람이 누군지 알게됨.
        var send = false; // 채팅방에서 왼쪽
        if(data.user == getUserUid()){ // 보낸 사람이 본인일 때
          send = true // 채팅방에서 오른쪽
        }
        var count;
        if(data.likeUserList==null){ // 메세지 좋아요 없을 때
          count = 0;
        } else{ // 메세지 좋아요 있을 때
          count = Object.keys(data.likeUserList).length; // 내 메세지를 좋아하는 유저 리스트 모두 세기
        }
          // 2018. 12. 15. 메세지 받아올 때 좋아요 눌렀던 메세지일 때 하트 색 빨간 색으로. - 이원영
        var itsme = false;
        if(data.likeUserList !== undefined && data.likeUserList[getUserUid()]){
          itsme = true;
        }
        // 파라메터 itsme 추가.
        var first = false;
        displayMessage(snap.key,currentChatUserInfo[i]['name'],data.text,currentChatUserInfo[i]['picUrl'], 
        send,data.imageUrl, data.createdAt, count,currentChatUserInfo[i]['uid'], itsme,first); // HTML에 직접 적으로 할당
        break;

      }
    }
  }
  firebase.database().ref('/chat_list/'+chatKey+'/message/').limitToLast(12).on('child_added', callback); 
  // .on 이라서 새로운 메세지가 달릴 때 마다 callback 함수 실행
  firebase.database().ref('/chat_list/'+chatKey+'/message/').limitToLast(12).on('child_changed', callback); 
  // 좋아요 같은 경우(변화 있을 때 refresh)
}

```

### - 채팅방 사용자 목록 (User List)
채팅방 상단의 user 아이콘에서 현재 채팅방에 들어와 있는 유저 수를 확인할 수 있고 아이콘을 클릭 시 유저 목록을 확인할 수 있습니다. 

```javascript
function addUserInfo(snap){ // DB에서 가져온 유저 정보 할당
  var childData = snap.val();
      var info = {
        name : childData.name,
        uid : snap.key,
        picUrl : childData.profilePicUrl
      }
      //on에서 넘어온 유저 push될 때마다 length세서 참가인원수 표시.
      currentChatUserInfo.push(info); // 유저 정보를 currentChatUserInfo에 넣기
      document.getElementById('chatUserCount').innerHTML = currentChatUserInfo.length; //그 채팅방을 이용하는 user 수 얻기 -> 표시하기 위해
}
function showUserList(){
  var str="";
  for (var i=0; i<currentChatUserInfo.length; i++){
      str+=(currentChatUserInfo[i].name+"<br>");
  } //현재 채팅방에 있는 user 정보에서 이름들만 가져와 str에 저장
  $('#usersModal-body').html(str);  //모달 body에 str을 추가
  $("#usersModal").modal('show')  //모달 띄우기
}
```

### - 사진 파일 전송 기능 (Submit Image)

사진 파일을 전송할 수 있습니다. File Picker를 통해 파일이 선택되면 가입된 유저인지 확인한 후 임시로 로딩 아이콘을 메세지 형태로 채팅방에 보여줍니다. 먼저 Firebase Cloud Storage에 사용자 Uid 이름으로 이미지를 먼저 업로드한 후 이미지 파일에서 URL을 생성하고 띄워 두었던 로딩 아이콘을 이 URL로 교체합니다.

```javascript
function onMediaFileSelected(event) { // media picker를 통해 파일이 선택되었을 때 호출
  event.preventDefault();
  var file = event.target.files[0];
  // picker의 인풋 부분을 초기화 
  imageFormElement.reset();
  // 유저가 가입된 유저인지 확인 후에 이미지 파일 저장을 위해 saveImageMessage 호출
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}
function saveImageMessage(file) {
  // 1 -메세지 placeholder : 사용자 이름, 임시로 보여줄 로딩 아이콘, 전송 시각 저장하여 firebase에 추가
  firebase.database().ref('/chat_list/'+currentChatKey+'/message/').push({
    user: getUserUid(),
    imageUrl: LOADING_IMAGE_URL,
    createdAt: new Date()
  }).then(function(messageRef) {
    // 2 - Cloud Storage의 사용자 Uid 아래에 이미지를 업로드
    var filePath = firebase.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - 이미지 파일로부터 public URL 만들기
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - 이미지 URL로 메세지 placeholder 업데이트 : 임시 로딩 아이콘을 이미지파일로 변경
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });
      });
    });
  }).catch(function(error) {  //오류 처리
    console.error('Cloud Storage에 업로드하던 중 에러가 발생했습니다:', error);
  });
}
```


### - 좋아요 버튼 처리
좋아요는 1번만 누를 수 있고, 유저 두명이 한개의 메세지에 동시에 좋아요 버튼을 눌렀을 시 카운트 오류가 생길 수 있는 여지가 있어 firebase database에서 제공하는 transaction 함수를 사용하여 구현하였습니다.
```javascript
firebase.database().ref('/chat_list/'+currentChatKey+'/message/'+$(this).parent().attr('id')+'/likeUserList/')
      .transaction(function(result){   // 해당 메세지의 좋아요 버튼 누른사람 리스트 불러오기
       // 좋아요의 동시성 해소를 위하여 트랜젝션 사용
        var plusminus = 1;//좋아요를 누르면 총 incentive를 +1 해야한다
        if(result){ // 좋아요를 누른 userlist의 내용이 존재
          if(result[getUserUid()]){// userlist가 존재하고 그 안에 본인이 있는 경우는 좋아요를 취소하는 것.
            likeElement.style.color="#32465a"; //원래 하트 색깔로 되돌리고
            delete result[getUserUid()]; //userlist에서 본인 삭제
            plusminus = -1; // 좋아요를 취소하면 총 incentive -1 해야한다
          } else{// 유저리스트에 본인이 없는 경우는 좋아요를 누르는 것.
            likeElement.style.color="red"; //하트 색깔 빨간색으로 변경
            result[getUserUid()] ={temp : 'temp'};
          }
        } else{ // 좋아요를 누른 userlist의 내용이 존재하지 않을 때(아무도 그 메세지에 좋아요를 누르지 않음) 
                //-> 체크할 필요없이 본인만 넣음
          result = {};
          likeElement.style.color="red"; //하트 색깔 빨간색으로 변경
          result[getUserUid()] ={temp : 'temp'};
        }
        firebase.database().ref('/chat_list/'+currentChatKey+'/user/'+messageUid+'/like_num')
        .transaction(function(number) { // 메세지의 좋아요 갯수(number) 불러오기.
        // 좋아요의 동시성 해소를 위하여 트랜젝션 사용
          if (number) {// 좋아요 개수가 있을 때

              number = number + plusminus; // 취소하는 경우에는 -1을 더하고 좋아요를 하는 경우에는 +1

          } else{ // 숫자가 없는 경우
            number = 1; // 1이된다.
          }
          return number;
        });
        return result;
      });

```

### - 각 채팅방에서의 본인 좋아요 개수 집계 (My incentive-마이페이지)
My incentive에서는 해당 채팅방에서 유저가 좋아요 개수를 총 몇 개 받았는지 확인할 수 있습니다.

Like_num 변수를 활용해 구현 하였으며 위에 좋아요 버튼 클릭 시 실행되는 함수와 연관되어 있습니다.

```javascript
firebase.database().ref('/chat_list/'+data.room_name+'/user/'+getUserUid()+'/like_num')
    .on('value',function(snapshot){//채팅방 리스트에 존재하는 자기 아이디의 좋아요 개수 불러오기
      displayChatLikeList(snapshot.key, data.room_name,snapshot.val()); // 좋아요(My incentive) 리스트 불러오기
    });
```

### - 좋아요 랭킹 차트 (Ranking) 
각 채팅방마다 존재하는 랭킹 페이지를 통해 가장 많은 좋아요를 받은 사용자를 최대 5명까지 차트 형태로 확인할 수 있습니다.
채팅방에 있는 사용자들이 받은 좋아요 개수와 사용자 이름을 각각 likeNumArr과 likeOwnerArr에 저장합니다. 좋아요 개수의 내림차순으로 배열을 정렬 후 최댓값 5개 데이터의 사용자 이름과 그 사용자가 받은 좋아요 개수를 다시 maxList 배열에 저장합니다. 이 데이터를 차트 생성 함수에 넘겨주면 차트 생성 함수는 그것을 기반으로 랭킹 차트를 생성하고 모달에 표시합니다.
여기서 차트 생성하는 함수는 amChart에서 참고한 것으로, 그래프 도형 서식이나 각종 애니메이션을 설정합니다.

```javascript
function ranking(){
  if(currentChatKey ==""){
  alert("채팅방에 접속 후 이용이 가능합니다.")
} else{
  var likeNumArr = [];     // 좋아요 개수들의 배열
  var likeOwnerArr=[];  //좋아요 주인이름의 배열
  firebase.database().ref('/chat_list/'+currentChatKey+'/user/').once('value', function(snapshot){
    snapshot.forEach(function(childSnapshot) {  //좋아요 개수들의 배열 불러오기
      if(childSnapshot.val().like_num){  //좋아요 받은 기록이 있다면
        likeNumArr.push(childSnapshot.val().like_num); //좋아요 배열에 좋아요 수 저장
        likeOwnerArr.push(childSnapshot.val().name);  //이름 배열에 사람 이름 저장
      }
    });
  })
  for (var i=1; i<likeNumArr.length; i++){  //like_num의 내림차순으로 배열 정렬 
    var key= likeNumArr[i];
    var name=likeOwnerArr[i];
    for (var j=i-1; j>=0 && likeNumArr[j]<key; j--){
      likeNumArr[j+1]=likeNumArr[j];
      likeOwnerArr[j+1]=likeOwnerArr[j];
    }
    likeNumArr[j+1]=key;
    likeOwnerArr[j+1]=name;
  }
  maxList=[]; // 최대값 저장할 배열 초기화
  for(var i=0; i<5 ; i++){ 
    if(likeNumArr[i]) // 유의미한 데이터가 있으면
      maxList.push(likeOwnerArr[i],likeNumArr[i]);  //이름, 좋아요 수 저장
    else //빈 데이터면
      maxList.push("순위 없음", null);  //순위 없음, null 저장
  } 
  createChart();  //차트 생성
  $("#rankModal").modal('show');  //모달 띄우기
 }
}

function createChart(){
  $('#rankModal').modal({   // 채팅방마다 새로운 모달이 생성될 수 있도록
      refresh: true // refresh 시키기
  });
  var chart;  //chart 생성할 변수 선언
  am4core.useTheme(am4themes_animated); // 애니메이션 효과 주기 위해 테마 설정
  chart = am4core.create("chartdiv", am4charts.XYChart);  //차트 생성
  chart.paddingBottom = 30;
  chart.data = [{     // 해당 채팅방의 top 5 데이터(이름, 좋아요 수)를 차트 데이터로 넘겨줌
      "name": maxList[0],
      "steps": maxList[1]
  }, {
      "name": maxList[2],
      "steps": maxList[3]
  }, {
      "name": maxList[4],
      "steps": maxList[5]
  }, {
      "name": maxList[6],
      "steps": maxList[7]
  }, {
      "name": maxList[8],
      "steps": maxList[9]
  }];
  // 이하 생략 - 차트 데이터 표시 단위, 그래프 단위와 사이즈 등을 조절하는 부분임. amChart에서 참고했음
}
```

### - 채팅방 최상단에서 더 위로 스크롤 시 이전 메세지 로드 기능
이전 대화 메세지를 확인 하기 위해선 로드 기능을 추가해야 했습니다. 서비스의 성능을 위하여 채팅방 입장 시 최신 메세지 12개 만을 불러옵니다. 해당 메세지를 불러오기 위한 작업은 아래와 같습니다.

채팅방 메세지 목록에 최상단에 있는 메세지 key값 불러오기 -> firebase database의 endAt 함수를 활용 해 key 값을 기준으로 12개 불러오기 -> 불러온 순서의 역순으로 html에 메세지 삽입(불러온 순서대로 메세지를 삽입 할 시 역순으로 삽입이 됨)

```javascript

messageListDiv.addEventListener('scroll', loadMoreMessage); 
// 메세지가 들어가는 부분의 스크롤이 일어 났을 시 이벤트 리스너 달기

function loadMoreMessage(e){ 
  // 스크롤 일어났을 시 실행 되는 부분
  var element = e.target;
  if(element.scrollTop==0){ // 스크롤이 최상단으로 갔을때
    var firstMessageKey = $("#message-box").children(":first").attr('id'); 
    // 최상단에 위치한 메세지의 id값 가져오기
    var index=0; // 새로운 메세지가 들어갈 위치를 지정해 주는 변수
    var callback = function(snap){
      if(!(snap.key ==firstMessageKey)){ //최상단에 있는 메세지는 포함되어 있기 때문에 제외하기
        var data = snap.val(); // snap의 데이터 불러와서 할당
        for(var i = 0 ; i < currentChatUserInfo.length;i++){ 
          // 메세지 내가 보냈는지(채팅창에서 오른쪽), 상대방이 보냈는지(채팅창에서 왼쪽)
          if(currentChatUserInfo[i]['uid']==data.user){ 
            // 현재 채팅방 유저의 리스트[i] == 현재 보낸 메세지의 유저 id 일 때 -> 메세지 보낸 사람이 누군지 알게됨.
            var send = false; // 채팅방에서 왼쪽
            if(data.user == getUserUid()){ // 보낸 사람이 본인일 때
              send = true // 채팅방에서 오른쪽
            }
            var count;
            if(data.likeUserList==null){ // 메세지 좋아요 없을 때
              count = 0;
            } else{ // 메세지 좋아요 있을 때
              count = Object.keys(data.likeUserList).length; // 내 메세지를 좋아하는 유저 리스트 모두 세기
            }

            var itsme = false; // 2018. 12. 15. 메세지 받아올 때 좋아요 눌렀던 메세지일 때 하트 색 빨간 색으로. - 이원영
            if(data.likeUserList !== undefined && data.likeUserList[getUserUid()]){
              itsme = true;
            }
            var first = true; //스크롤에 의해서 불러온건지 아닌지 확인하는 변수

            /* index를 사용하는 이유는 firebase database에서 데이터를 불러올때 역순으로 불러오는데, 
            메세지 리스트에 넣을때 제대로 넣기위해서
             예를들어 1,2,3,4,5,6,7,8,9,10 이있으면 1,2,3,4,5,6,7,8,9,10 순으로 불러옴 
             따라서 메세지에 보여줄때 1,2,3,4,5,6,7,8,9,10으로 넣기 위하여 필요한 변수
                최상단 메세지
                1 최상단 메세지
                1 2 최상단 메세지
                1 2 3 최상단 메세지
             이런식으로 밖에 넣는 방법 없음. 따라서 index 필요
            */

            // 파라미터 itsme 추가.
            displayMessage(snap.key,currentChatUserInfo[i]['name'],data.text,currentChatUserInfo[i]['picUrl'], send,data.imageUrl,
             data.createdAt, count,currentChatUserInfo[i]['uid'], itsme, first,index); // HTML에 직접적으로 할당,
            ++index; //위치정보 index 추가
            break;
          }
        }
      }
    }
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').orderByKey().endAt(firstMessageKey)
    .limitToLast(13).on('child_added', callback);
    // 최상단에 위치한 메세지의 id값을 기준으로 전에 12개 가져오기(13인 이유는 최상단 메세지 포함해서 가져오기때문에)
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').orderByKey().endAt(firstMessageKey)
    .limitToLast(13).on('child_changed', callback);
    // 최상단에 위치한 메세지의 id값을 기준으로 전에 12개 가져오기(13인 이유는 최상단 메세지 포함해서 가져오기때문에)
  }
}


//역순으로 넣을 시 사용한 함수

$("#message-box").children()[index].before(li) //우리가 넣으려는 메세지를 위에서부터 index번째에 넣으라는 의미

```

### - 질문 데이터 전처리 과정 (Twitter API)
해당 채팅방에 존재하는 메세지를 분석하여 word cloud를 이용해 시각화 하여 보여줍니다. 가장 최신의 100개(임의의 값, 변동 가능) 메세지 만을 분석을 하며, 형태소 분석기를 활용해 핵심 키워드 만을 이용했습니다. word cloud에서, 단어의 빈도수가 높아질수록 해당 단어의 시각화 사이즈가 커집니다.

한글의 경우 Word Cloud를 바로 적용시키면 한글 조사가 처리가 안 되는 문제가 있었습니다. (ex: 한글이, 한글은, 한글로, 라는 말은 "한글"로서 3번 중복되어야 하지만 각자 다른 것으로 체크 되어 중복이 안 됨.)
이에 따라, 한글 형태소 분석을 위하여 twitter api를 호스트 해놓은 서버를 활용해 이용하였으며, 데이터 시각화는 d3 wordcloud를 활용해 wordcloud를 표현 했습니다.

실행 순서는 다음과 같습니다.

100개 메세지 불러오기 -> twitter api http 요청 -> 결과 값 분석 후 단어의 빈도수를 count하여 word cloud 표현

해당 기능에서 제공 하는 기능에서 추가한 기능은 다음과 같습니다.

1) twitter api 결과 값 중 단어가 2개 이상 조합된 단어를 중복해서 반환을 하는 문제가 있어 띄어 쓰기가 있는 단어의 경우 빈도수에서 제외 시키는 것 구현(ex: '채팅방 목록'으로 요청 시 '채팅방', '목록', '채팅방 목록' 으로 결과가 반환 되었던 오류가 있었음)

2) twitter api 결과 값의 형태가 "twitter(Noun: 0, 7)" 와 같은 형태로 반환이 되어 소괄호 부분을 제외 시키는 작업을 함

3) 메세지 목록에 입장 메세지가 포함이 되어 있어, 입장 메세지를 불러올 시 이를 결과값에 들어가지 않게 하는 처리를 함

```javascript
function myFunction() { // 페이지가 로드 되었을 때 실행되는 함수
    curChatKey = decodeURIComponent(getQueryVariable('chatkey')); 
    // URL에 있는 chatkey 뽑아오기. -> 한글로 decode
    firebase.database().ref('/chat_list/'+curChatKey+'/message').limitToLast(100).once('value', function(snap){ 
        // 현재 curChatKey로 최근 100개 메세지 불러오기.
        snap.forEach(function(childSnapshot) { 
            // 한번에 가져온 메세지는 snap(100개 메세지). 각 1개의 메세지는 chlidSnapshot
            if(childSnapshot.val().hasOwnProperty('imageUrl')==false){
                //image가 없는 메세지만 word cloud로 
            if(childSnapshot.val().text.indexOf("님이 입장하셨습니다.")==-1 ){ 
                // 결과값에 유저 입장 메세지 포함되던 문제 제거를 위해 -> 입장 메세지 없을 때만 넘김
                   allMessageList.push(childSnapshot.val().text) 
                   // allMessageList에 메세지 넣기
            }
        }
    })
    }).then(function(){
        maxLength = allMessageList.length-1; 
        // allMessageList의 총 갯수
        for(var i = 0 ; i <allMessageList.length; i++){ 
            // 각각의 메세지에 대해서 트위터 한글 형태소 분석 api로 요청 보내기.
            // 이것 때문에 로딩 오래 걸리지만, 한번에 요청 보내면 중복이 삭제 되어서 한번에 못 보내고 각각에 대하여 보냄.
            requestApi(allMessageList[i]);
        }
    })
}


function requestApi(message){ // 트위터 한글 형태소 분석 api로 요청 보내기
    axios.get('https://open-korean-text.herokuapp.com/extractPhrases',{ 
        // https://github.com/open-korean-text/open-korean-text-api twitter 한글 형태소 분석 api 관련
            params: {
                text: message // 메세지를 파라미터로 보내면 결과값이 반환됨(완성 결과값 아님. 밑에서 더 처리).
            }
        }).then(function (response) { // 결과값 왔을 때
            var data = response.data['phrases']; // 결과값 문자를 data로 할당
            for(var i = 0 ; i <data.length; i++){
                extractString(data[i]); // 결과값에 대한 우리가 원하는 결과값 추출하기
            }
        })
        .catch(function (error) {
            alert("내부 서버 오류입니다. 잠시후에 다시 시도해 주세요");
        }).then(function(){ // extractString() 추출 끝났을 시
            ++index; // 1개의 응답이 올 때마다 index 증가
            if(index ==  maxLength){ // index와 보낸 요청 갯수가 같으면
                computeFrequency(resultMessageList) // 단어의 빈도 수 계산
            }
        })
}


// 반환값 예시. {"phrases":["text의(Noun: 0, 5)","text의 결과값(Noun: 0, 9)","text(Noun: 0, 4)","결과(Noun: 6, 2)"]}
function extractString(message){ // (Noun: 0, 5)의 앞 부분만 추출하는 함수.
    var result = message.substring(0,message.indexOf("("));
    if(result.indexOf(" ")==-1){ // 띄어쓰기 있으면 결과값에 안 넣음. 위에서 예) "text의 결과값" 은 안 넣음.
        resultMessageList.push(result);
    }
}


function computeFrequency(messageList){ // 단어의 빈도수 계산하는 함수.
    var frequencyTempResult = {} // 빈도수 계산을 위한 임시 오브젝트
    for(var i = 0 ; i < messageList.length; i++){ // 메세지 갯수만큼
        if(frequencyTempResult[messageList[i]]==null){ // 새 단어가 처음 들어왔을 떄
            frequencyTempResult[messageList[i]] = 1; // 1을 넣는다
        } else{ // 빈도수 1개씩 증가
            frequencyTempResult[messageList[i]] = ++frequencyTempResult[messageList[i]];
        }
    }

    var frequencyList=[];
    var keyList = Object.keys(frequencyTempResult); // 오브젝트의 key만 배열 반환
    for(var i = 0; i <keyList.length;i++){ // 해당 key값(text)에 대한 size를 word cloud에 쓸 수 있게 text, size에 할당
        frequencyList.push({'text':keyList[i],'size':frequencyTempResult[keyList[i]]});

    }
    document.getElementById("loader").style.display = "none"; // 로딩 창 없애기
    document.getElementById("myDiv").style.display = "block"; // word cloud 창 보여주기


    update(frequencyList) // 여기부터 하단까지 https://github.com/shprink/d3js-wordcloud/blob/master/word-cloud.js 참고하여 변경


}


```

### - 질문 데이터 시각화 (Word Cloud)
d3-wordcloud.js 기반으로 작성되었으며, 텍스트와 frequency가 적힌 배열을 입력값으로 시각화 해서 표현하였습니다.
```javascript

var fill = d3.scale.category20b();

var w = window.innerWidth,
        h = window.innerHeight;

var max,
        fontSize;

var layout = d3.layout.cloud()
        .timeInterval(Infinity)
        .size([w, h])
        .fontSize(function(d) {
            return 10+(d.size-1)*10; // 글자 폰트 사이즈 알맞게 변경. 단어 size(빈도수)가 1이면 폰트 크기 10
            //return fontSize(+d.size);
        })
        .text(function(d) {
            return d.text;
        })
        .on("end", draw);

var svg = d3.select("#myDiv").append("svg")  // myDiv를 가진 id에 svg 할당하게 id명 변경
        .attr("width", w)
        .attr("height", h);

var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");


if(window.attachEvent) {
    window.attachEvent('onresize', update);
}
else if(window.addEventListener) {
    window.addEventListener('resize', update);
}

function draw(data, bounds) {
    var w = window.innerWidth*(4/5), // 사이즈 적절하게 변경
        h = window.innerHeight*(4/5);

    svg.attr("width", w).attr("height", h);

    scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

    var text = vis.selectAll("text")
            .data(data, function(d) {
                return d.text.toLowerCase();
            });
    text.transition()
            .duration(1000)
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function(d) {
                return d.size + "px";
            });
    text.enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function(d) {
                return d.size + "px";
            })
            .style("opacity", 1e-6)
            .transition()
            .duration(1000)
            .style("opacity", 1);
    text.style("font-family", function(d) {
        return d.font;
    })
            .style("fill", function(d) {
                return fill(d.text.toLowerCase());
            })
            .text(function(d) {
                return d.text;
            });

    vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

function update(list) {
    layout.font('impact').spiral('archimedean');
    fontSize = d3.scale['sqrt']().range([10, 100]);
    if (list.length){
        fontSize.domain([10, 100]); // 폰트 사이즈가 이상하게 나와서 폰트 사이즈 범위 10-100으로 고정
    }
    layout.stop().words(list).start();
}

```



## 2. 개발자 정보


- 1415088 홍정수 (jsjs0) : jungsoobranch
  * 로그인 & 로그아웃 기능 구현
  * 채팅방 기능 구현 : 채팅방 생성하기(Add Class), 본인의 채팅방 리스트 불러오기
  * 채팅창 기능 구현 : 메세지 불러오기, 대화하기(텍스트), 채팅방 최상단에서 더 위로 스크롤 시 이전 메세지 로드하기
  * 좋아요 기능 구현 : 좋아요 1번만 눌리게, transaction, 각 채팅방에서의 본인 좋아요 개수 집계 (My incentive-마이페이지)
  * 질문 데이터 시각화 기능 구현 UI & 기능 구현 : 질문 데이터 전처리 과정(Twitter Api), 질문 데이터 시각화(Word Cloud)
  * 최종 발표자
  
- 1771016 김은지 (eun-g-kim) : eunjiBranch
  * 기존 UI에서 불필요한 부분 삭제
  * 채팅방 UI 구현 : 좋아요 버튼, Word Cloud 버튼, 랭킹 버튼 구현 
  * 채팅방 기능 구현 : 채팅방 삭제하기(Delete Class), 채팅방 사용자 목록 확인
  * 채팅창 기능 구현 : firebase cloud storage 이용한 파일 전송 기능 구현, 채팅 시간 표시
  * 랭킹 차트 modal 및 기능 구현 : 좋아요 개수 top 5 데이터 기반으로 차트 생성(amChart)
  * ppt 초안 제작
  
- 1771044 이원영 (wonyeonglee) : wonyeongbranch
  * 기존 UI에서 불필요한 부분 삭제
  * 채팅방 UI 구현 : 로그인창 UI, 팝업창 UI, 마이페이지 랭킹 UI, 좋아요 버튼 UI 구현, 랭킹 페이지 UI 구현(삭제), 채팅방 사용자 수 표시
  * 좋아요 기능 구현 : 좋아요  색깔 변경, 좋아요 취소 기능, 본인 메세지에 좋아요 누를 수 없도록 기능 추가
  * wordcloud 사진 첨부 문제 해결 
  * ppt 제작
  * 시연 동영상

- 1771098 이가은 (gaeunleeandlee) : gaeun
  * 기존 UI에서 불필요한 부분 삭제
  * 마이페이지 UI및 스크롤바 
  * 채팅창 내 버튼 UI 수정
  * ppt 최종본 작성 및 수정
  * 시연 동영상 편집
  

## 3. 라이센스 정보
See [LICENSE](LICENSE), Apache License 2.0

## 4. 사용 open source
+ Firebase 웹 메신저 오픈소스 : https://github.com/firebase/friendlychat-web
+ amChart의 Column chart Api: https://www.amcharts.com/demos/column-chart-images-top/
+ Twitter 형태소 분석기 Api : https://github.com/open-korean-text/open-korean-text-api
+ 질문 데이터 시각화 d3 Word Cloud 오픈소스 : https://github.com/jasondavies/d3-cloud
+ Main 채팅 창 UI 오픈소스 : https://bootsnipp.com/snippets/35mvD


