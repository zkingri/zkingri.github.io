let elem = $('article h1, article h2');
let tree = document.createElement("ul");
let node = undefined;

for (let i = 0; i < elem.length; ++i) { /*为每个标题创建节点*/
    node = document.createElement("li");
    node.innerHTML = elem[i].innerHTML;
    if (elem[i].tagName.toUpperCase() === 'H2') /*若为二级标题，则向右缩进一个字符*/
        node.style.paddingLeft = "1em";
    tree.appendChild(node);
    elem[i].setAttribute("id", "title" + i); /*为每个节点设置标识符以便在导航时使用*/
}

elem = tree.childNodes;
for (let i = 0; i < elem.length; ++i) { /*为每个节点添加导航功能*/
    elem[i].onclick = function () {
        for (let j = 0; j < elem.length; ++j) { /*设置节点状态*/
            if (j === i) {
                elem[i].classList.add("active");
                continue;
            }
            elem[j].classList.remove("active");
        }
        $('html,body').animate({scrollTop: $('#title' + i).offset().top - 65}, 500); /*在顶部空出 65px，避免标题栏遮挡文字*/
    };
}
document.getElementById("contents").appendChild(tree); /*将制作好的目录添加至页面*/

/*将该函数添加至 $(window).scroll，实时更新目录节点活跃状态*/
function contentsAnchor() {
    let p = $(document).scrollTop() + 65; /*判定的基准点位于页面顶部向下 65px 处*/
    if (p < $('#title0').offset().top) /*若页面位于第一个标题以上，则移除所有节点的活跃状态*/
        for (let j = 0; j < elem.length; ++j)
            elem[j].classList.remove("active");
    else
        for (let i = 0; i < elem.length; ++i) {
            if (i < elem.length - 1 && /*最后一个元素需特殊处理*/
                $('#title' + i).offset().top - 1 <= p && p < $('#title' + (i + 1)).offset().top - 1) { /*寻找当前页面所处位置*/
                for (let j = 0; j < elem.length; ++j) /*设置节点状态*/
                    elem[j].classList.remove("active");
                elem[i].classList.add("active");
                break;
            } else { /*若页面位于最后一个标题及其以下，则将最后一个节点标记为活跃状态*/
                for (let j = 0; j < elem.length - 1; ++j)
                    elem[j].classList.remove("active");
                elem[elem.length - 1].classList.add("active");
            }
        }
} 
