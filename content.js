$(function(){
    var disabled = false;
    var word,lastword;
    var src = chrome.extension.getURL('logo.png');
    var wrapper = $('<div id="dictionaryWrapper"><div id="dictionaryTitle"><img src="'+ src + '"> <a id="addToList">Learning This Word</a> <a id="removeList">Stop Learning This Word</a><audio id="wordAudio" src="#" autoplay></audio></div><div id="dictionaryContent"></div></div>');
    var body =  $("body");
    body.append(wrapper);
    var title = $("#dictionaryTitle");
    var content = $("#dictionaryContent");
    var wordAudio = $("#wordAudio");
    body.on("mouseup",OnDictEvent);
    function OnDictEvent(e){
        if(disabled)
            return;
        var word = String(window.getSelection());
        word = word.replace(/^\s*/, "").replace(/\s*$/, "");
        if(word=="") return;
        var x = e.clientX,y = e.clientY + 10;
        var mx = $(window).width()-505, my = $(window).height()-340;
        x > mx ? x = mx : true;
        y > my ? y -= 360 : true;
        content.html("loading..");
        wrapper.css({display:"block",top:y+"px",left:x+"px"});
        wordAudio.attr("src","http://dict.youdao.com/dictvoice?audio="+ word +"&type=2");
        //查询释义
        $.ajax({
            url: "https://www.vocabulary.com/dictionary/definition.ajax",
            data:{
                search:word,
                lang:"en"
            },
            type:"GET",
            success: function(data){
                var wordInfo = $(data);
                if(wordInfo.attr("data-word")){
                    content.html(data);
                }else {
                    content.html("Didn't find " + word);
                }

            }
        });
    }

    content.find("a.audio").on("mouseenter",function(){
        var word = $(this).find(".wordPage").attr("data-word");
        wordAudio.attr("src","http://dict.youdao.com/dictvoice?audio="+ word +"&type=2");
    });

    content.on({
        "mouseenter":function(e){
            body.css("overflow","hidden");
            body.css("padding-right","17px");
        },
        "mouseleave":function(e){
            body.css("overflow","");
            body.css("padding-right","");
        }
    });


    title.on({
        "mousedown":dragDown,
        "mousemove":dragMove
    });
    body.on("mouseup",dragUp);
    var px=0,py=0,isDrag = false;
    function dragMove(e) {
        e.preventDefault();
        if (isDrag) {
            //console.log(e.x);
            wrapper.css("left",px + e.clientX+"px");
            wrapper.css("top",py + e.clientY+"px");
        }
        return false;
    }

    function dragDown(e) {
        px = parseInt(wrapper.css("left")) - e.clientX;
        py =  parseInt(wrapper.css("top")) - e.clientY;
        console.log("px:"+ px + ", py:" + py);
        isDrag = true;
    }

    function dragUp(e) {
        isDrag = false;
    }
});