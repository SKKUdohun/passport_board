
let obj;
open();

function open() {
  console.log("open호출");
  window.onload = function () {
    getContent();
  }
}

function writeDoc(url, data){
  var result = data;
  result = JSON.stringify(result);
  console.log('writeDoc 호출됨', result);

  let fetchData = {
    method: 'POST',
    body: result,
    headers: {
      "Content-type": "application/json"
    }
  };

  fetch(url, fetchData)
    .then(function(response){
      console.log(response);
    });
}

function clearDoc() {

  console.log("clearDoc 호출됨");

  var cell= document.getElementById("root");
  while(cell.hasChildNodes()){
    cell.removeChild(cell.firstChild);
  }
  var cont = document.getElementById("content");
  while(cont.hasChildNodes()){
    cont.removeChild(cont.firstChild);
  }
}

function sendAjax(url){
  console.log('sendAjax호출됨');

  var result;
  let fetchData = {
    method: 'POST',
    body: result,
    headers: {
      "Content-type": "application/json"
    }
  };

  fetch(url, fetchData)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      result= data;
      var my_div = null;
      var newDiv =null;

      newDiv = document.createElement("div");
      newDiv.setAttribute('id','diiv');
      newDiv.innerHTML = "제목: "+result[0].title + "<br/>" + "내용: "+result[0].contents + "<br/>"
        + "작성자: " + result[0].author + "<br/>" + "이미지:" + "<br/>"
        + "<img src= /uploadimage/" + result[0].image +  " width = 300px  height=300px>";

      my_div = document.getElementById("content");
      document.body.insertBefore(newDiv, my_div);
      var btn = document.createElement("BUTTON");
      var t = document.createTextNode("확인~");
      btn.appendChild(t);
      //var btn2 = document.createElement("BUTTON");
      //var t2 = document.createTextNode("이미지업로드");
      //btn2.appendChild(t2);

      document.body.appendChild(btn);
      //document.body.appendChild(btn2);
      btn.onclick = function(){
        var delnode = document.getElementById('diiv');
        delnode.parentNode.removeChild(delnode);
        btn.parentNode.removeChild(btn);
        //btn2.parentNode.removeChild(btn2);
        getContent();
      };

      // btn2.onclick = function(){
      //   alert('이미지업로드!!');
      //}

    });
}
let getContent = function(){
  console.log("getContent 호출");

  fetch('/boards/ajax/contentGet', {
    method: 'get'
  })
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      var local = document.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
      local.setAttribute('id', 'root');

      //console.log(data);
      obj = data;

      var elements = document.getElementsByClassName('row');
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }

      var th1 = document.createElement("th");
      th1.appendChild(document.createTextNode("번호"));

      var th2 = document.createElement("th");
      th2.appendChild(document.createTextNode("제목"));

      var th3 = document.createElement("th");
      th3.appendChild(document.createTextNode("작성자"));
      local.appendChild(th1);
      local.appendChild(th2);
      local.appendChild(th3);
      for (i = 0; i < obj.length; i++) {

        var tr = document.createElement("tr");
        tr.setAttribute('class', 'row');
        tr.setAttribute('id', obj[i]._id);

        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(i + 1));
        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(obj[i].title));
        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(obj[i].author));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        console.log(obj[i]);
        local.appendChild(tr);

        tr.onclick = function () {
          console.log(this.id);
          clearDoc();
          sendAjax('/boards/ajax/read/' + this.id);
        }
      }
      var write = document.createElement("button");
      write.appendChild(document.createTextNode("글쓰기"));
      local.appendChild(write);

      var lb = document.createElement("br");
      local.appendChild(lb);

      var logout = document.createElement("button");
      logout.appendChild(document.createTextNode('로그아웃'));
      local.appendChild(logout);
      logout.onclick = function(){
        location.href = '/logout';
      };


      write.onclick = function(){
        clearDoc();


        var form = document.createElement("form");
        form.setAttribute("id", "uploadForm");
        form.setAttribute("enctype", "multipart/form-data");
        form.setAttribute("method","post");
        form.setAttribute("action", "/boards/ajax/imageUpload");

        var inputField = document.createElement("input");
        inputField.setAttribute("type", "file");
        inputField.setAttribute("name", "img");
        inputField.setAttribute("id", 'uploadFile');
        form.appendChild(inputField);

        /*
        var submitField = document.createElement("input");
        submitField.setAttribute("type", "submit");
        submitField.setAttribute("name", "submit");
        submitField.setAttribute("value", 'Upload');
        form.appendChild(submitField);
*/


        //var form = document.createElement("form");
        //form.setAttribute('style', 'line-height:2.3em');

        var input_title = document.createElement("INPUT");
        input_title.setAttribute('type', 'text');
        input_title.setAttribute('placeholder', '제목');
        input_title.setAttribute('id','title1');
        input_title.setAttribute('name', 'title');

        var lb1 = document.createElement("br");
        var lb2 = document.createElement("br");
        var lb3 = document.createElement("br");
        var lb4 = document.createElement("br");


        var input_author = document.createElement("INPUT");
        input_author.setAttribute('type', 'text');
        input_author.setAttribute('placeholder', '작성자');
        input_author.setAttribute('id','author');
        input_author.setAttribute('name', 'author');


        var input_content = document.createElement("textarea");
        input_content.setAttribute('type', 'text');
        input_content.setAttribute('placeholder', '내용');
        input_content.setAttribute('rows', '20');
        input_content.setAttribute('cols', '80');
        input_content.setAttribute('id','content2');
        input_content.setAttribute('name','conte');

        form.appendChild(lb4);
        form.appendChild(input_title);
        form.appendChild(lb1);
        form.appendChild(input_author);
        form.appendChild(lb2);
        form.appendChild(input_content);
        //local.appendChild(form);
        form.appendChild(lb3);

        var submit = document.createElement("button");
        submit.appendChild(document.createTextNode("전송"));
        form.appendChild(submit);

        local.appendChild(form);

        submit.onclick = function(){
          var title =document.getElementById('title1').value;
          var author = document.getElementById('author').value;
          var content = document.getElementById('content2').value;

          var data = {
            'title' : title,
            'author' : author,
            'content' : content,
            //'url' : url
          };

          //writeDoc('/boards/ajax/write', data);
          /*
          var url = '/boards/ajax/imageUpload';

          var fetchOptions = {
            method: 'POST',
            headers,
            body: form
          };



          let fetchData = {
            method: 'POST',
            body: form,
          };

          var responsePromise = fetch(url, fetchData);
          responsePromise
            .then(function(response){
              console.log(response);
              //clearDoc();
              return response.json();
              //return response.json();
            })
            .then(data => {
              console.log(data);
            });
          */
          form.submit();
          clearDoc();
          getContent();
        };

        /*
        let imageUploadButton = document.createElement("button");
        imageUploadButton.appendChild(document.createTextNode("이미지업로드"));
        local.appendChild(imageUploadButton);
        imageUploadButton.onclick = function(){
          alert('이미지업로드 누름!');
        };
        */
        //form.submit();


        //local.appendChild(formData);


        var cancel = document.createElement("button");
        cancel.appendChild(document.createTextNode("취소"));
        local.appendChild(cancel);
        cancel.onclick = function(){
          clearDoc();
          getContent();
        };


      }
    })
};