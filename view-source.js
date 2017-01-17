var doms = document.getElementsByClassName("view-source");
for(var i=0; i<doms.length; i++) {
  var dom = doms[i];
  dom.addEventListener("click", e => {
    window.open("https://github.com/hystking/three-bone-demo/blob/master/" + window.location.pathname.split("/").splice(2).join("/"));
  })
}
