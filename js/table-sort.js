class Table {
	
	rows = [];
	#renderfuncs = {};

	// --------- private ----------

	#sort(event) { // функция сортировки

		const index = [...event.target.parentElement.children].indexOf(event.target);
		//const index = this.headers.indexOf(header);
		const order = (event.target.dataset.order = -(event.target.dataset.order || -1));
		const collator = new Intl.Collator(['en', 'ru'], { numeric: true, });
		
		let sorting;
		if (event.target.getAttribute('type') == 'date') {
			sorting = (a, b) => order * collator.compare(
				a.children[index].dataset.ms,
				b.children[index].dataset.ms
			);
		} else {
			sorting = (a, b) => order * collator.compare(
				a.children[index].innerHTML,
				b.children[index].innerHTML
			);
		}

		this.table.tBodies[0].append(...this.rows.sort((a, b) => sorting(a, b)));

		for(const el of [...event.target.parentElement.children])
			el.classList.toggle('sorted', el === event.target);
	}


	#isDate(val, td, th) { // проверка - является ли значение датой
		if (val.split('.').length == 3){
			val = val.split('.')[2] + '-' + val.split('.')[1] + '-' + val.split('.')[0]; 
		}

		if (!isFinite(Number(val)) && Boolean(Date.parse(val))) {
			const formatter = new Intl.DateTimeFormat("ru", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
			const date = Date.parse(val);
			th.setAttribute('type', 'date');
			td.dataset.ms = date;
			return formatter.format(date);
		} else return val;
	}

	// ----------- public ------------
	
	constructor(html_table) { // парсинг существующей таблицы
		if (html_table != null) {
			this.parse(document.querySelector(html_table));
		}
	}

	init({root, editable=false, headers}) { // создать новую таблицу
		const table_root = document.querySelector(root)

		this.table = document.createElement("table");
		const thead = document.createElement("thead");
		const tbody = document.createElement("tbody");

		const headers_row = document.createElement("tr");
		headers.forEach((header, index) => {
			const {key, label, render, sortable = true} = header;
			let th = document.createElement("th");
			th.innerHTML = label;
			
			if (render) {
				th.setAttribute('type', 'rendering');
				this.#renderfuncs[index] = render;
			} else if (!key) {
				th.setAttribute('type', 'autoincrement');
				th.dataset.index = 0;
			} else {
				th.dataset.key = key;
			}

			if (sortable) {
				th.classList.toggle('sortable');
				th.addEventListener('click', event => this.#sort(event));
			}
			headers_row.append(th);
		});
		
		
		thead.append(headers_row);
		this.table.append(thead, tbody);
		if (editable) {
			new InputTable(this);
		}

		table_root.append(this.table);
		return this;
	}

	createRows(rows) { // добавить строки в таблицу
		for (let row of rows) {
			let tr = document.createElement("tr");
			const thead = this.table.tHead.children[0].children;
			
			
			let row_elements = new Array(thead.length);
			for (let i = 0; i < thead.length; i++) {
				const type = thead[i].getAttribute('type');
				if (type == 'autoincrement') {
					row_elements[i] = Number(thead[i].dataset.index) + 1;
					thead[i].dataset.index = row_elements[i]; 
				} else if (type == 'rendering') {
					row_elements[i] = this.#renderfuncs[i](row_elements);
				} else {
					for (let key in row) {
						if (key == thead[i].dataset.key) row_elements[i] = row[key];
					}
				}
			}
			

			row_elements.forEach ((el, i) => {
				let td = document.createElement("td");
				if (!el) td.innerHTML = '-';
				else td.innerHTML = this.#isDate(String(el), td, thead[i]);
				tr.append(td);
			});

			this.rows.push(tr);
			this.table.tBodies[0].append(tr);
		}
	}

	editRow({where, index, edit}) {
		const thead = this.table.tHead.children[0].children;

		if (!index) {
			if (Object.keys(where).length != 1) throw new Error('В "where" может быть только одно значение')
			for (let i = 0; i < thead.length; i++) {
				for (let key in where) {
					if (key == thead[i].dataset.key) {
						this.rows.forEach ((row, j) => {
							if (row.children[i].innerHTML == where[key]) index = j;
						});
					}
				}
			}
		}
		
		let row_elements = [];
		if (isFinite(index)) {
			const ed_row = this.rows[index].children;
			for (let i = 0; i < thead.length; i++) {
				if (thead[i].getAttribute('type') == 'rendering') {
					row_elements[i] = this.#renderfuncs[i](row_elements);
					ed_row[i].innerHTML = row_elements[i];
				} else {
					for (let key in edit) {
						if (key == thead[i].dataset.key) {
							row_elements[i] = edit[key];
							ed_row[i].innerHTML = this.#isDate(String(edit[key]), ed_row[i], thead[i]);
						}
					}
				}
			}		
			this.table.tBodies[0].append(...this.rows);
		}
	}
	
	deleteRow(ind) {
		this.table.tBodies[0].deleteRow(ind);
		this.rows.splice(ind, 1);
	}

	parse(table, editable = false) {
		this.table = table;
		const headers = table.tHead.children[0].children
		const tbody = table.tBodies[0];
		const rows = tbody.rows;

		for (let th of headers) {
			if (!th.classList.contains('unsortable')) {
				th.classList.add('sortable');
				th.addEventListener('click', event => this.#sort(event));
			}
		}

		for (let i = 0; i < rows.length ; i++) {
			this.rows.push(rows[i]);
			for (let j = 0; j < headers.length; j++) {
				const el = rows[i].children[j];
				el.innerHTML = this.#isDate(el.innerHTML, el, headers[j]);
			}
		}

		if (editable) new InputTable(this);
	}

	static parseAll(qSelector, editable = false) {
		const querries = document.querySelectorAll(qSelector);
		let tables = [];

		for (let selector of querries) {
			let result_table = new this();
			result_table.parse(selector, editable);
			tables.push(result_table);
		}
		
		return tables;
	}
}
