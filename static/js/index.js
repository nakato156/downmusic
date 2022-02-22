window.onload = init

function init(){
    const loader = document.getElementById("loader")
    const parent = document.getElementById("icon_download").parentNode;
    const icon_download = document.getElementById("icon_download")

    const form = document.getElementById("form")
    form.addEventListener("submit", downMusic)
    const icon_search = document.getElementById("icon_search")
    icon_search.addEventListener("click", downMusic)
}

function downloadBlob(blob, filename){
    filename+=".mp3"
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function preLoad(){
    icon_download.style.display = "none"
    loader.style.display="block"
    loader.setAttribute("class", "preloader")
}

function IdFromUrl(url){
    if(/https:\/\/(www.)?youtube.com\/*/g.test(url)){
        n = url.indexOf("=")+1
        return url.slice(n);
    }else if(/https:\/\/(www.)?youtu.be\/*/g.test(url)){
        return url.split("/").slice(-1)
    }
    return false;
}

function downMusic(e){
    e.preventDefault()
    let video_id = document.getElementById("searchMusic").value
    if(!video_id.trim()){
        alert("Introduzca una url o ID de video")
        return;
    }
    video_id = IdFromUrl(video_id)
    if(!video_id){
        return;
    }

    fetch(`https://downmusic.herokuapp.com/api/v1/download/${video_id}`)
    .then(res=>{
        if(res.status===200){
            return res.blob()
        }
        throw "Not found video"
    })
    .then(music=>{
        try {
            let msg = document.getElementsByClassName("msg")
            msg[0].parentNode.removeChild(msg[0])
        }catch(error){}
        loader.setAttribute("class", "")
        icon_download.style.display = "block"
        const down = function (){
            downloadBlob(music, video_id)
            icon_download.removeEventListener("click", down)
        }
        icon_download.addEventListener("click", down)
    })
    .catch((e)=>{
        let message = document.createElement("div")
        message.setAttribute("class","msg");
        message.innerHTML = `<h4>${e}</h4>`
        parent.appendChild(message)
    })
    preLoad()
}