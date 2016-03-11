/*$(function(){
    var wrapper = $('<div id="dictionaryWrapper"><div id="dictionaryTitle"><img src="logo.png"> <a id="addToList">Learning This Word</a> <a id="removeList">Stop Learning This Word</a><audio src="#" autoplay></audio></div><div id="dictionaryContent"></div></div>');
    $("body").append(wrapper);
    $("body").on("mouseup",function(){
        var text = window.getSelection().toString();
        if(text) {

            //查询发音
            $.ajax({
                url: "http://dict.youdao.com/dictvoice?audio=test&type=2",
                data:{
                    audio:text,
                    type:2
                },
                type:"GET",
                success: function(data){
                    //alert(data);
                },
                error:function(error) {
                    alert(error);
                }
            });
        }
    });


});*/

$(function(){
    var disabled = false,isDrag = false;
    var src = chrome.extension.getURL('logo.png');
    var wrapper = $('<div id="dictionaryWrapper"><div id="dictionaryTitle"><img src="'+ src + '"> <a id="addToList">Learning This Word</a> <a id="removeList">Stop Learning This Word</a><audio src="#" autoplay></audio></div><div id="dictionaryContent"></div></div>');
    var body =  $("body");
    body.append(wrapper);
    body.on("mouseup",OnDictEvent);
    function OnDictEvent(e){
        if(disabled)
            return;
        var word = String(window.getSelection());
        word = word.replace(/^\s*/, "").replace(/\s*$/, "");
        if(word=="") return;
        var x = e.pageX,y = e.pageY;
        //查询释义
        $.ajax({
            url: "https://www.vocabulary.com/dictionary/definition.ajax",
            data:{
                search:word,
                lang:"en"
            },
            type:"GET",
            success: function(data){
                wrapper.css({display:"block",top:x+"px",left:y+"px"});
                wrapper.find("#dictionaryContent").html(data);
            }
        });
    }

    $("#dictionaryContent").on({
        "mouseenter":function(e){
            body.css("overflow","hidden");
            body.css("padding-right","17px");
        },
        "mouseleave":function(e){
            body.css("overflow","");
            body.css("padding-right","");
        }
    });


    wrapper.find("#dictionaryTitle")[0].onmousedown = dragDown;
    wrapper.find("#dictionaryTitle")[0].onmouseup = dragUp;
    wrapper.find("#dictionaryTitle")[0].onmousemove = dragMove;
    wrapper.find("#dictionaryTitle")[0].onmouseover = function(e){wrapper[0].style.cursor='move';};
    wrapper.find("#dictionaryTitle")[0].onmouseout = function(e){wrapper[0].style.cursor='default';};
    function dragMove(e)
    {

        if(isDrag)
        {
            var myDragDiv = wrapper[0];
            myDragDiv.style.pixelLeft = px + e.x;
            myDragDiv.style.pixelTop = py + e.y;
        }
    }
    function dragDown(e)
    {
        var oDiv = wrapper[0];

        px = oDiv.style.pixelLeft - e.x;
        py = oDiv.style.pixelTop - e.y;
        isDrag = true;
    }
    function dragUp(e)
    {
        var oDiv = wrapper[0];

        isDrag = false;
    }
});