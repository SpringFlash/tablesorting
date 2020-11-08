function push_html() {
	for (let el of tableRows) {
		mainTable.appendChild(el);
	}
}

function btn_names(btn, ch) {
	btn1.innerHTML = "Товар";
	btn2.innerHTML = "Количество";
	btn3.innerHTML = "Цена/1";

	btn.innerHTML += " " + ch;
}

function sorts(btn, sorting) {
	let is_sorted = Boolean(btn.innerHTML.indexOf("▼") + 1);
	let ch;
	if (is_sorted) {
		tableRows.sort((a, b) => sorting(a, b));
		ch = "▲";
	} else {
		tableRows.sort((b, a) => sorting(a, b));
		ch = "▼";
	}
	push_html();
	return ch;
}


btn1.onclick = function name_sort() {  // btn 1
	let sorting = function(a, b) {
		if (a.children[0].innerHTML < b.children[0].innerHTML)
			return (-1);
		
		else
			return (1);
	};

	let ch = sorts(btn1, sorting);
	btn_names(btn1, ch);
}


btn2.onclick = function count_sort() {  // btn 2
	let sorting = (a, b) => (a.children[1].innerHTML - b.children[1].innerHTML);
	
	let ch = sorts(btn2, sorting);
	btn_names(btn2, ch);
}

btn3.onclick = function price_sort() {  // btn 3	
	let sorting = (a, b) => (a.children[2].innerHTML - b.children[2].innerHTML);
	
	let ch = sorts(btn3, sorting);
	btn_names(btn3, ch);
}


let mainTable = document.getElementsByTagName('tbody')[0];
let tableRows = [];

for (let el of mainTable.children) {
	tableRows.push(el);
}
