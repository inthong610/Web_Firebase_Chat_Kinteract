/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var maxList=[];
var currentChatKey = "";
var currentChatUserInfo = [];

// Signs-in Friendly Chat.

// Signs-out of Friendly Chat.
function signOut() {
  firebase.auth().signOut();
  // TODO 2: Sign out of Firebase.
}


var userPicElement = document.getElementById('profile-img');
var signOutButtonElement = document.getElementById('sign-out');

var userNameElement = document.getElementById('user-name');
var messageListDiv = document.getElementById('messages-list')
var messageListElement = document.getElementById('message-box');
var messageFormElement = document.getElementById('message-form');

var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageAddButtonElement = document.getElementById('image_add');


var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');



//var mediaCaptureElement = document.getElementById('mediaCapture');
var rankElement = document.getElementById('rankIcon');
rankElement.addEventListener('click', ranking);


signOutButtonElement.addEventListener('click', signOut);


messageListDiv.addEventListener('scroll', loadMoreMessage); // 메세지가 들어가는 부분의 스크롤이 일어 났을 시 이벤트 리스너 달기

function loadMoreMessage(e){ // 스크롤 일어났을 시 실행 되는 부분
  var element = e.target;
  if(element.scrollTop==0){ // 스크롤이 최상단으로 갔을때
    var firstMessageKey = $("#message-box").children(":first").attr('id'); // 최상단에 위치한 메세지의 id값 가져오기
    var index=0; // 새로운 메세지가 들어갈 위치를 지정해 주는 변수
    var callback = function(snap){
      if(!(snap.key ==firstMessageKey)){ //최상단에 있는 메세지는 포함되어 있기 때문에 제외하기
        var data = snap.val(); // snap의 데이터 불러와서 할당
        for(var i = 0 ; i < currentChatUserInfo.length;i++){ // 메세지 내가 보냈는지(채팅창에서 오른쪽), 상대방이 보냈는지(채팅창에서 왼쪽)
          if(currentChatUserInfo[i]['uid']==data.user){ // 현재 채팅방 유저의 리스트[i] == 현재 보낸 메세지의 유저 id 일 때 -> 메세지 보낸 사람이 누군지 알게됨.
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

            /* index를 사용하는 이유는 firebase database에서 데이터를 불러올때 역순으로 불러오는데, 메세지 리스트에 넣을때 제대로 넣기위해서
             예를들어 1,2,3,4,5,6,7,8,9,10 이있으면 1,2,3,4,5,6,7,8,9,10 순으로 불러옴 따라서 메세지에 보여줄때 1,2,3,4,5,6,7,8,9,10으로 넣기 위하여 필요한 변수
                최상단 메세지
                1 최상단 메세지
                1 2 최상단 메세지
                1 2 3 최상단 메세지
             이런식으로 밖에 넣는 방법 없음. 따라서 index 필요
            */

            // 파라미터 itsme 추가.
            displayMessage(snap.key,currentChatUserInfo[i]['name'],data.text,currentChatUserInfo[i]['picUrl'], send,data.imageUrl, data.createdAt, count,currentChatUserInfo[i]['uid'], itsme, first,index); // HTML에 직접적으로 할당,
            ++index; //위치정보 index 추가
            break;
          }
        }
      }
    }
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').orderByKey().endAt(firstMessageKey).limitToLast(13).on('child_added', callback);// 최상단에 위치한 메세지의 id값을 기준으로 전에 12개 가져오기(13인 이유는 최상단 메세지 포함해서 가져오기때문에)
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').orderByKey().endAt(firstMessageKey).limitToLast(13).on('child_changed', callback);// 최상단에 위치한 메세지의 id값을 기준으로 전에 12개 가져오기(13인 이유는 최상단 메세지 포함해서 가져오기때문에)
  }
}


// Initiate firebase auth.
function initFirebaseAuth() {
  firebase.auth().onAuthStateChanged(authStateObserver);
  // TODO 3: Initialize Firebase.
}
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.src=profilePicUrl;
    userNameElement.textContent = userName;


    getChatList();
    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();*/
  } else { // 로그아웃 됐을 때
    location.href="/login.html";
  }
}

function getUserName() { //현재 로그인 되어 있는 유저의 이름 가져오기
  return firebase.auth().currentUser.displayName;
}

function getProfilePicUrl() { // 현재 로그인 한 유저의 프로필 사진 불러오기, 없을 시 기본 사진 불러오기
  return firebase.auth().currentUser.photoURL || 'https://t3.ftcdn.net/jpg/01/50/44/40/500_F_150444057_XafiBkyICzuWgYHWAPCYETzH5zwCKSri.jpg';
}

function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

function getUserUid(){ //현재 로그인 한 유저의 uid 불러오기
  return firebase.auth().currentUser.uid
}

function checkSignedInWithMessage() {
  if (isUserSignedIn()) {
    return true;
  }
}


function getChatList(){ // 현재 로그인 한 유저의 채팅방 리스트 불러오기
  var callback = function(snap) {
    var data = snap.val(); // 불러온 정보(snap)를 javascript로 사용할 수 있게 변경
    displayChatlist(snap.key, data.room_name); // 채팅 리스트 불러오기

    firebase.database().ref('/chat_list/'+data.room_name+'/user/'+getUserUid()+'/like_num').on('value',function(snapshot){//채티방 리스트에 존재하는 자기 아이디의 좋아요 개수 불러오기
      displayChatLikeList(snapshot.key, data.room_name,snapshot.val()); // 좋아요(My incentive) 리스트 불러오기
    });
  }
  firebase.database().ref('/user_list/'+getUserUid()+'/room_list/').on('child_added', callback); // 자기 정보에 존재하는 채팅방 리스트 불러오기
                                                                                                                   // child_added 는 해당 데이터베이스에 데이터가 추가 됐을 시 callback 함수를 실행하라는 의미
}
function displayChatLikeList(key, name,number){ //채팅방 좋아요 요소 불러오는 부분
  var chatLikeListElement = document.getElementById("chat-like-list"); // 채팅방 좋아요 리스트 넣는 요소 찾기
  var likeContainer;
  if(document.getElementById(name)){
    likeContainer =  document.getElementById(name);
  } else{
    likeContainer = document.createElement('li'); //채팅방 좋아요 리스트 생성
    likeContainer.setAttribute('class', 'chat-like');
    likeContainer.setAttribute('id', name); // 채팅방의 name
  }

  likeContainer.innerHTML = name+'<span class="like-num">'+number+'</span>' //채팅방 좋아요 관련 정보 업데이트
  chatLikeListElement.appendChild(likeContainer);
}
function displayChatlist(key,name) { // 채팅방 리스트에 채팅방 추가 함수
  var CHAT_LIST_TEMPLATE =  // 채팅방 이름이 들어갈 리스트 템플릿. html과 같음.
      '<div class="wrap"><div class="meta">' +
      '<p class="name"></p>' +
      '</div></div>';

  var chatListElement = document.getElementById("chat_list");

  var container = document.createElement('li'); // 각 채팅방 생성
  container.setAttribute('class', 'contact');
  container.setAttribute('id', key);
  container.innerHTML = CHAT_LIST_TEMPLATE;
  var div = container.firstChild;

  var nameElement = div.querySelector('.name');
  nameElement.textContent = name;
  container.addEventListener('click' , function(e){ // 각 채팅방이 클릭되었을 때
    firebase.database().ref('/chat_list/'+currentChatKey+'/user/').off(); // 새로운 채팅방으로 넘어갔으니 대기하던 firebase off
    firebase.database().ref('/chat_list/'+currentChatKey+'/message/').off(); // 새로운 채팅방으로 넘어갔으니 대기하던 firebase off
    $("#chat_list>li.active").removeClass("active"); // 기존 채팅방 active 상태 풀리도록 CSS 해제
    $(this).addClass("active"); // 새로운 채팅방이 active 되도록
    $("#message-box").html('');
    currentChatKey = $(this).find(".name").text(); // 새로운 채팅방에 name 클래스(채팅방)를 가진 요소를 찾아서 그 텍스트를 currentChatKey에 넣음
    $("#chat-name").html(currentChatKey+" "+'&nbsp;&nbsp;<i class="fas fa-users" id="usersIcon"></i><span id="chatUserCount"></span>');
          // 채팅창 상단에 채팅방 이름 부분 + user 몇명인지 표시
    document.getElementById('usersIcon').addEventListener('click', showUserList); //usersIcon 누를 시 채팅참여자 목록 보여줄 함수 호출
    currentChatUserInfo = []; // 예전 채팅방의 유저 인포 리셋
    classClick(currentChatKey); // (새로운 채팅방에 존재하는)유저 리스트랑 메세지 리스트 불러옴
  });
  chatListElement.appendChild(container);
}

function showUserList(){
  var str="";
  for (var i=0; i<currentChatUserInfo.length; i++){
      str+=(currentChatUserInfo[i].name+"<br>");
  } //현재 채팅방에 있는 user 정보에서 이름들만 가져와 str에 저장
  $('#usersModal-body').html(str);  //모달 body에 str을 추가
  $("#usersModal").modal('show')  //모달 띄우기
}

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

function classClick(chatKey){ // (새로운 채팅방에 존재하는)유저 리스트랑 메세지 리스트 불러옴
  // child_added로 on 해둬도 어차피 초기화 하기 때문에 두번 쓸 필요 없어용
  var o = true;
  firebase.database().ref('/chat_list/'+chatKey+'/user/').on('child_added', function(snapshot){ // .on은 계속 불러오는 것. 새로운 메세지가 써지면 실행 됨.
    addUserInfo(snapshot);
    if(o){
      loadMessages(chatKey);
      o = false;
    }
  });
}

function loadMessages(chatKey) { // DB에서 메세지 리스트 불러오기
  var callback = function(snap){
    var data = snap.val(); // snap의 데이터 불러와서 할당
    for(var i = 0 ; i < currentChatUserInfo.length;i++){ // 메세지 내가 보냈는지(채팅창에서 오른쪽), 상대방이 보냈는지(채팅창에서 왼쪽)
      if(currentChatUserInfo[i]['uid']==data.user){ // 현재 채팅방 유저의 리스트[i] == 현재 보낸 메세지의 유저 id 일 때 -> 메세지 보낸 사람이 누군지 알게됨.
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
        displayMessage(snap.key,currentChatUserInfo[i]['name'],data.text,currentChatUserInfo[i]['picUrl'], send,data.imageUrl, data.createdAt, count,currentChatUserInfo[i]['uid'], itsme,first); // HTML에 직접 적으로 할당
        break;

      }
    }
  }
  firebase.database().ref('/chat_list/'+chatKey+'/message/').limitToLast(12).on('child_added', callback); // .on 이라서 새로운 메세지가 달릴 때 마다 callback 함수 실행
  firebase.database().ref('/chat_list/'+chatKey+'/message/').limitToLast(12).on('child_changed', callback); // 좋아요 같은 경우(변화 있을 때 refresh)
}

function displayMessage(key, name, text, picUrl, send,imageUrl, createdAt, likeNum,messageUid, itsme = false,first,index) { // 채팅방 HTML에 넣는 함수
  var li = document.getElementById(key);// 메세지 박스가 이미 있는지
  // If an element for that message does not exists yet we create it.
  if (!li) {
    li = document.createElement('li');
    li.innerHTML = '<img class="pic" src="">'+
                          '<div class="send_name"></div>'+
                          '<p class="message"></p>' +

                          '<i class="fas fa-heart like " style="font-size:12px; '+(itsme ? 'color:red;' : '')+'" aria-hidden="true"> 0</i>'+
                          '<label class="time" style="font-size: 7px; vertical-align: top;"></label>' ;

    li.setAttribute('id', key);// 메세지 구분하기 위해서 key 할당
    if(send){ // 채팅창에서 오른쪽
      li.setAttribute('class','sent');
    } else{ // 채팅창에서 왼쪽
      li.setAttribute('class','replies');
    }
    if(first==true){ //스크롤 최상단으로 불러왔을 때
      $("#messages-list").scrollTop(300); //스크롤의 위치를 위에서부터 300px 되는 부분에 넣으라는 의미
      $("#message-box").children()[index].before(li) //우리가 넣으려는 메세지를 위에서부터 index번째에 넣으라는 의미

      /*
        이렇게 한 이유는 db에 시간순으로 들어가 있는게 1,2,3,4,5,6,7,8,9,10이라 가정하면
        메세지가 불러져서 들어오는순서가 1,2,3,4,5,6,7,8,9,10 이기 때문에
         순서를 생각하면 1을 넣고 1 앞에 2를 넣어야하기 때문에 index가 1인것
                      1  최상단 메세지
                     1 2 최상단 메세지
                     1 2 3  최상단 메세지
                     1 2 3 4  최상단 메세지
                     1 2 3 4 5  최상단 메세지
      $("#message-box").children()[1].before(li) <- 이것의 의미는 2번째 메세지의 앞부분에 지금 들어온 메세지를 넣으라는 의미
      */
    } else{
      messageListElement.appendChild(li);
    }
  }
  var likeElement = li.querySelector('.like'); // 좋아요
    likeElement.textContent = " "+likeNum;

    likeElement.onclick = function(e){ // 좋아요가 클릭 됐을 때 실행
      var isUser = 0; //본인 메세지인지 확인하기 위한 변수
      firebase.database().ref('/chat_list/'+currentChatKey+'/message/'+$(this).parent().attr('id')+'/user/').transaction(function(user1){ // 해당 메세지를 작성한 user불러오기
                                                                                                                                    // 좋아요의 동시성 해소를 위하여 트랜젝션 사용
        if(user1==getUserUid()){//본인 메세지인지 확인
          isUser = 1;//본인 메세지인 경우 isUser를 1로
          alert('본인 메세지는 좋아요를 누를 수 없습니다');//본인 메세지 클릭 불가능 하다고 알려주기.
        }
      });

      if(isUser==0){//본인 메세지가 아닌 경우에만 좋아요 버튼 누르면 효과 있음

      firebase.database().ref('/chat_list/'+currentChatKey+'/message/'+$(this).parent().attr('id')+'/likeUserList/').transaction(function(result){   // 해당 메세지의 좋아요 버튼 누른사람 리스트 불러오기
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

        } else{ // 좋아요를 누른 userlist의 내용이 존재하지 않을 때(아무도 그 메세지에 좋아요를 누르지 않음) -> 체크할 필요없이 본인만 넣음
          result = {};
          likeElement.style.color="red"; //하트 색깔 빨간색으로 변경
          result[getUserUid()] ={temp : 'temp'};
        }

        firebase.database().ref('/chat_list/'+currentChatKey+'/user/'+messageUid+'/like_num').transaction(function(number) { // 메세지의 좋아요 갯수(number) 불러오기.
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
    }
  };


  if (picUrl) { // 유저 프로필
    li.querySelector('.pic').src=picUrl
  }
  li.querySelector('.send_name').textContent = name;

 li.querySelector('.time').textContent = createdAt;

  var messageElement = li.querySelector('.message');
  if (text) { // If the message is text.  메세지가 텍스트인 경우
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>'); // 줄바꿈
  }
  else if (imageUrl) { // 이미지 메세지였다면
    var image = document.createElement('img');
    image.addEventListener('load', function() {
//    messageListDiv.scrollTop = messageListDiv.scrollHeight;
    image.style.borderRadius="0%";
    image.style.margin="0px 0px 0px 0px";
    image.style.height="auto"; //크기 조절
    image.style.width="280px";
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);

  }

  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {li.classList.add('visible')}, 1); // 엔터치면 아래로 내려가는거
  if(!(first==true)){
    messageListDiv.scrollTop = messageListDiv.scrollHeight;
  }
 // messageInputElement.focus();
}


function saveMessage(messageText) { // 메세지 DB에 저장
  // Adds a new message entry to the Realtime Database.
  var t = new Date(+new Date()+(1000*60*60*9));
  return firebase.database().ref('/chat_list/'+currentChatKey+'/message/').push({
   user: getUserUid(),
   text: messageText,
   createdAt: t.getUTCFullYear()+"."+ (t.getUTCMonth()+1) +"."+t.getUTCDate()+"   /   "+(t.getUTCHours())%24+":"+new Date().getUTCMinutes()
 }).catch(function(error) {
   console.error('Error writing new message to Realtime Database:', error);
 });
}

messageFormElement.addEventListener('submit', onMessageFormSubmit);

function onMessageFormSubmit(e) { // 메세지가 제출 됐을 때(엔터 클릭시)실행 되는 함수
  e.preventDefault();
  if (messageInputElement.value && (currentChatKey!="")) { // 메세지 있을 때
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      $('.message-input input').val(null);
      toggleButton();
    });
  } else if(currentChatKey==""){
    $('.message-input input').val(null);
    alert("채팅방 입장 후 입력이 가능합니다.");
  }
  // Check that the user entered a message and is signed in.
}

function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);


var addClassElement = document.getElementById('addclass'); // add class 버튼 불러오기

addClassElement.addEventListener('click', function(e){ // add class 버튼이 클릭됐을때 채팅방 추가하는 알림창 띄우기
    $("#myModal").modal('show')
});

$("#add-class-modal-btn").on('click', function() { // 채팅방 추가 알림창에서 추가하기 버튼 클릭했을 시
  var chatListRef = firebase.database().ref('chat_list/'+$("#chat-name-input").val());
  chatListRef.once('value', function(snapshot) { // 해당 목록에 존재하는 데이터 한번만 불러오기 https://firebase.google.com/docs/database/web/read-and-write?hl=ko
    if(snapshot.val()!=null){ // 해당 이름을 가진 채팅방이 존재할 시
      if(snapshot.val().code== $("#chat-code-input").val()){ // 해당 채팅방의 코드와 입력한 코드가 일치 할 시
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

$("#create-class-modal-btn").on('click', function(){ // 생성 하기 클릭 시
  firebase.database().ref('chat_list/'+$("#chat-name-input").val()+'/').set({ // 데이터 베이스에 Chat_list 항목에 해당 이름과 코드을 가진 채팅방 데이터베이스 생성
    code: $("#chat-code-input").val()                                         // set은 내가 정한 key값(과목이름)으로 데이터 넣기 https://firebase.google.com/docs/database/web/lists-of-data?hl=ko
  },function(error) {
    if (error) {  // 에러 생겼을 시
     alert("에러 발생!");
    } else { // 에러 없을 시
      addRoomListInMyInfo($("#chat-name-input").val());
    }
  });
});

function addRoomListInMyInfo(name){ // 내가 가지고 있는 룸 리스트에 채팅방 추가 하기
  firebase.database().ref('user_list/'+getUserUid()+'/room_list').once('value', function(snapshot){
    var myRoomarr = [];                   // 내가 가지고 있는 채팅방 임시 저장 배열
    snapshot.forEach(function(childSnapshot) {  //내가 가지고있는 채팅방 이름 불러오기
      myRoomarr.push(childSnapshot.val().room_name);
    });
    var check = true;
    for(var i = 0 ; i < myRoomarr.length; i++){ // 만약 내가 가지고 있는 채팅방과 같은 이름의 채팅방 값이 들어왔을 시 false
      if(myRoomarr[i]==name){
        check = false;
      }
    }
    if(check){
      updateMyInfoInChatRoom(name);
      firebase.database().ref('user_list/'+getUserUid()+'/room_list').push({ // push는 firebase에서 겹치지 않는 key값으로 넣기 https://firebase.google.com/docs/database/web/lists-of-data?hl=ko
        room_name: name
      }, function(err){
        if(err){ // 에러 생겼을 시
          alert("에러 발생!");
        } else{ // 에러 없을 시
          $("#myModal").modal('hide');
          $("#confirmModal").modal('hide');
        }
      });
    } else{
      alert("이미 존재하는 채팅방입니다!");
      $("#myModal").modal('hide');
      $("#confirmModal").modal('hide');
    };
  });
}

function updateMyInfoInChatRoom(chatKey){ // 룸 정보에 유저 정보 넣기
  firebase.database().ref('chat_list/'+chatKey+'/user/'+getUserUid()).update({ // push는 firebase에서 겹치지 않는 key값으로 넣기 https://firebase.google.com/docs/database/web/lists-of-data?hl=ko
    name: getUserName(),
    profilePicUrl: getProfilePicUrl(),
    like_num : 0
  }, function(err){
    if(err){ // 에러 생겼을 시

    } else{ // 에러 없을 시
      firebase.database().ref('chat_list/'+chatKey+'/message/').push({ // push는 firebase에서 겹치지 않는 key값으로 넣기 https://firebase.google.com/docs/database/web/lists-of-data?hl=ko
        text: getUserName()+"님이 입장하셨습니다.",
        user: getUserUid()
      })
    }
  });
}


var deleteClassElement = document.getElementById('deleteclass'); // delete class 버튼 불러오기
deleteClassElement.addEventListener('click', function(e){ // delete class 버튼이 클릭됐을때 채팅방 삭제 모달 띄우기
    $("#myModal2").modal('show')
});

$("#delete-class-modal-btn").on('click', function() { // 채팅방 삭제 알림창에서 삭제하기 버튼 클릭했을 시
  var chatListRef = firebase.database().ref('chat_list/'+$("#chatToDelete-name-input").val());
  chatListRef.once('value', function(snapshot) { // 해당 목록에 존재하는 데이터 한번만 불러오기
    if(snapshot.val()!=null){ // 해당 이름을 가진 채팅방이 존재할 시
      deleteRoomListInMyInfo($("#chatToDelete-name-input").val());  //삭제
      }
    else { // 해당 이름을 가진 채팅방이 존재하지 않을 시
      $("#myModal2").modal('hide');
      alert("해당 이름의 채팅방이 존재하지 않습니다")
    }
  });
});

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

//랭킹
function ranking() {
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
    for (var i=1; i<likeNumArr.length; i++){  //like_num 내림차순으로 배열 정렬
      var key= likeNumArr[i];
      var name=likeOwnerArr[i];
      for (var j=i-1; j>=0 && likeNumArr[j]<key; j--){
        likeNumArr[j+1]=likeNumArr[j];
        likeOwnerArr[j+1]=likeOwnerArr[j];
      }
      likeNumArr[j+1]=key;
      likeOwnerArr[j+1]=name;
    }

    maxList=[];
    for(var i=0; i<5 ; i++){
      if(likeNumArr[i]) //데이터 있으면
        maxList.push(likeOwnerArr[i],likeNumArr[i]);  //이름, 좋아요 수 저장
      else //빈 데이터면
        maxList.push("순위 없음", null);  //순위 없음, null 저장
    }
    createChart();  //차트 생성
    $("#rankModal").modal('show');  //띄우기
  }
}

function createChart(){ //실제 차트 그리는 부분

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
  //실제 차트 그리는 부분
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dy = 35;
    categoryAxis.renderer.tooltip.dy = 35;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;

    var series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "steps";
    series.dataFields.categoryX = "name";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = - 6;
    series.columnsContainer.zIndex = 100;

    var columnTemplate = series.columns.template;
    columnTemplate.width = am4core.percent(50);
    columnTemplate.maxWidth = 30;
    columnTemplate.column.cornerRadius(60, 60, 10, 10);
    columnTemplate.strokeOpacity = 0;

    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
    series.mainContainer.mask = undefined;

    var cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = "none";

    var bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 15;
    bullet.valign = "bottom";
    bullet.align = "center";
    bullet.isMeasured = true;
    bullet.interactionsEnabled = false;
    bullet.verticalCenter = "bottom";

    var hoverState = bullet.states.create("hover");

    var outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius, target) {
        var circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
    })

    var previousBullet;
    chart.cursor.events.on("cursorpositionchanged", function (event) {
        var dataItem = series.tooltipDataItem;

        if (dataItem.column) {
            var bullet = dataItem.column.children.getIndex(1);

            if (previousBullet && previousBullet != bullet) {
                previousBullet.isHover = false;
            }

            if (previousBullet != bullet) {

                var hs = bullet.states.getKey("hover");
                hs.properties.dy = -bullet.parent.pixelHeight + 30;
                bullet.isHover = true;

                previousBullet = bullet;
            }
        }
    })
}

// 이미지 업로드를 위한 이벤트 처리
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);


var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';  //로딩 아이콘

// Firebase에 image 메세지를 저장
// Cloud Storage에 이미지를 먼저 저장함
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

// media picker를 통해 파일이 선택되었을 때 호출
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];
  // picker의 인풋 부분을 초기화
  imageFormElement.reset();
  // 유저가 가입된 유저인지 확인 후에 이미지 파일 저장을 위해 saveImageMessage 호출
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}


// initialize Firebase
initFirebaseAuth();

var wCloudElement = document.getElementById('word-Cloud');
wCloudElement.addEventListener('click', goWordCloud);

function goWordCloud(){
  if(currentChatKey ==""){
    alert("채팅방에 접속 후 이용이 가능합니다.")
  } else{
    window.open('wordcloud.html?chatkey='+currentChatKey,'pop', 'menubar=no,status=no,scrollbars=no,resizable=no ,width=800,height=600,top=50,left=50');
  }
}

