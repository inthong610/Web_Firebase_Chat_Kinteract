var myVar;
var curChatKey;
var allMessageList =[];
var resultMessageList =[];
var maxLength;
var index =0;



function myFunction() { // 페이지가 로드 되었을 때 실행되는 함수
    curChatKey = decodeURIComponent(getQueryVariable('chatkey')); // URL에 있는 chatkey 뽑아오기. -> 한글로 decode
    firebase.database().ref('/chat_list/'+curChatKey+'/message').limitToLast(100).once('value', function(snap){ // 현재 curChatKey로 최근 100개 메세지 불러오기.
        snap.forEach(function(childSnapshot) { // 한번에 가져온 메세지는 snap(100개 메세지). 각 1개의 메세지는 chlidSnapshot
            if(childSnapshot.val().hasOwnProperty('imageUrl')==false){//image가 없는 메세지만 word cloud로 
            if(childSnapshot.val().text.indexOf("님이 입장하셨습니다.")==-1 ){ // 결과값에 유저 입장 메세지 포함되던 문제 제거를 위해 -> 입장 메세지 없을 때만 넘김
                   allMessageList.push(childSnapshot.val().text) // allMessageList에 메세지 넣기
            }
        }
    })
    }).then(function(){
        maxLength = allMessageList.length-1; // allMessageList의 총 갯수
        for(var i = 0 ; i <allMessageList.length; i++){ // 각각의 메세지에 대해서 트위터 한글 형태소 분석 api로 요청 보내기.
                                                        // 이것 때문에 로딩 오래 걸리지만, 한번에 요청 보내면 중복이 삭제 되어서 한번에 못 보내고 각각에 대하여 보냄.
            requestApi(allMessageList[i]);
        }
    })
    //console.log(uri_dec);
  //myVar = setTimeout(showPage, 3000);
}


/*
트위터 api

https://open-korean-text.herokuapp.com/extractPhrases의 기능 : 쓸데 없는 단어( EX: 하다, 이다, 같은 동사, 조사)를 제거해줌.

그러나 띄어쓰기가 포함되어 결과값을 뱉어냄(ex- https://open-korean-text.herokuapp.com/extractPhrases?text=text의 결과값)는 등 문제가 많아 단어 결과 중 띄어쓰기를 포함하는 결과값은 없애 추출하기도록 구현.

api에 대한 반환 값이 JSON이 아니고 단순 String 형태로 반환이 되어 String상태에서 정보를 추출함.

"twitter(Noun: 0, 7)" <- 반환값 한개에 대한 예시. ()가 지워지지 않고 반환됨.

이에 따라, 반환값에서 () 부분을 삭제하도록 구현.(단, 실제의 소괄호-twitter(SNS)-가 들어와도 소괄호는 결과값으로 반환하지 않음)

flow :

String 입력값 -> 소괄호의 맨처음 값과 맨 마지막 값을 입력 받아 해당 문자열을 삭제시킴 -> "twitter" -> 해당 문자열에 띄어쓰기가 있으면 탈락, 없을 시 결과 값에 포함시킴.

*/

function requestApi(message){ // 트위터 한글 형태소 분석 api로 요청 보내기
    axios.get('https://open-korean-text.herokuapp.com/extractPhrases',{ // https://github.com/open-korean-text/open-korean-text-api twitter 한글 형태소 분석 api 관련
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

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

function getQueryVariable(variable) // URL에 있는 chatkey를 split을 이용하여 추출하는 함수.
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
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
