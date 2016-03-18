$(function(){
    var disabled = false;
    var word;
    var src = chrome.extension.getURL('logo.png');
    var wrapper = $('<div id="dictionaryWrapper"><div id="dictionaryTitle"><img src="'+ src + '"> <a id="addToList">Learning This Word</a><audio id="wordAudio" src="#" autoplay></audio></div><div id="dictionaryContent" style="display: block;"></div></div>');
    var body =  $("body");
    body.append(wrapper);
    var title = wrapper.find("#dictionaryTitle");
    var content =  wrapper.find("#dictionaryContent");
    var wordAudio = wrapper.find("#wordAudio");
    var addListBtn = wrapper.find("#addToList");
    body.on("mouseup",OnDictEvent);
    function OnDictEvent(e){
        wrapper.hide();
        if(disabled)
            return;
        word = String(window.getSelection());
        word = word.replace(/^\s*/, "").replace(/\s*$/, "");
        if(word=="") {
            return;
        }
        var x = e.clientX,y = e.clientY + 10;
        var mx = $(window).width()-505, my = $(window).height()-340;
        x > mx ? x = mx : true;
        y > my ? y -= 360 : true;
        content.html("loading..");
        addListBtn.hide();
        wrapper.css({display:"block",top:y+"px",left:x+"px"});
        //查询释义
        $.ajax({
            url: "https://www.vocabulary.com/dictionary/definition.ajax",
            data:{
                search:word,
                lang:"en"
            },
            type:"GET",
            success: function(data){
                showData(data);
            }
        });

        //查询list按钮
        $.ajax({
            url: "https://www.vocabulary.com/progress/progress.json",
            data:{
                word:word
            },
            type:"POST",
            success: function(data){
                showListBtn(data);
            }
        });
        playAudio(word);
    }

    function showListBtn(data){
        if (!data) {
            return
        }
        if(data.lrn) {
            if (data.pri == -1) {
                addListBtn
                    .text("Learning This Word")
                    .show()
                    .one("click",function(){
                        var _this = $(this);
                        $(this).text(data.wrd + " is scheduling...");
                        $.ajax({
                            url: "https://www.vocabulary.com/progress/startlearning.json",
                            data:{
                                word:data.wrd
                            },
                            type:"POST",
                            success: function(data){
                                _this.text("Added to learning list.");
                            }
                        });
                    });
            }else {
                var pro = Math.floor(data.prg * 100);
                var text = "progress: " + Math.floor(data.prg * 100) + "%";
                if(pro == 100) {
                    text = "Mastered";
                }
                addListBtn
                    .text(text)
                    .show();
            }
        } else {
            addListBtn
                .text("Can't learning this word.")
                .show();
        }
    }
    function showData(data){
        var wordInfo = $(data);
        if(wordInfo.attr("data-word")){
            content.html(data);
        }else {
            content.html("Didn't find " + word);
        }
    }
    function playAudio(word) {
        var src = "https://dict.youdao.com/dictvoice?audio="+ word +"&type=2";
        var oSrc = wordAudio.attr("src");
        if(src == oSrc) {
            wordAudio[0].play();
        }else {
            wordAudio.attr("src",src);
        }
    }
    content.on("mouseenter","a.audio",function(){
        var word = content.find(".wordPage").attr("data-word");
        playAudio(word);

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
        "mousemove":dragMove,
        "mouseup":dragUp
    });
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
        isDrag = true;
    }
    function dragUp(e) {
        isDrag = false;
    }
});