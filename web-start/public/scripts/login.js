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

// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);

}

var signInButtonElement = document.getElementById('sign-in');
signInButtonElement.addEventListener('click', signIn);
function authStateObserver(user) {
  if (user) { // 로그인 되었을 때
       firebase.database().ref('/user_list/'+getUserUid()).update({ // 로그아웃 후 로그인 시 정보가 전부 날아가는 버그 수정 https://firebase.google.com/docs/database/web/read-and-write?hl=ko
          name: getUserName(),
          profilePicUrl: getProfilePicUrl()
        }).catch(function(error) {
          console.error('Error writing new message to Realtime Database:', error);
        }).then(function(){
          location.href="/index.html";
        });
  }
}
initFirebaseAuth();

function getUserName() { //현재 로그인 되어 있는 유저의 이름 가져오기
  return firebase.auth().currentUser.displayName;
  // TODO 5: Return the user's display name.
}

function getProfilePicUrl() { //현재 로그인 한 유저의 프로필 사진 불러오기, 없을 시 기본 사진 불러오기
  return firebase.auth().currentUser.photoURL || 'https://t3.ftcdn.net/jpg/01/50/44/40/500_F_150444057_XafiBkyICzuWgYHWAPCYETzH5zwCKSri.jpg';
  // TODO 4: Return the user's profile pic URL.
}

function getUserUid(){ //현재 로그인 한 유저의 이메일 불러오기
  return firebase.auth().currentUser.uid
}
