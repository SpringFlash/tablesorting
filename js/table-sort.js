class Table {
	
	rows = [];
	headers = [];

	// --------- private ----------

	#sort(header) { // функция сортировки
		const index = this.headers.indexOf(header);
		const order = (header.element.dataset.order = -(header.element.dataset.order || -1));
		const collator = new Intl.Collator(['en', 'ru'], { numeric: true, });
		let sorting;
		
		if (header.type == 'date') {
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

		this.table.append(...[...this.rows].sort((a, b) => sorting(a, b)));

		for(const {element} of this.headers)
			element.classList.toggle('sorted', element === header.element);
	}


	#isDate(val, td, header) { // проверка - является ли значение датой
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
			header.type = 'date';
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

	init({root, headers}) { // создать новую таблицу
		this.table_root = document.querySelector(root)
		this.headers = headers;

		this.table = document.createElement("table");
		let thead = document.createElement("thead");
		this.tbody = document.createElement("tbody");

		for (let header of headers) {
			const {key, label, sortable = true} = header;
			let th = document.createElement("th");
			th.innerHTML = label;
			header['element'] = th;
			
			if (!key)  {
				header.type = 'autoincrement';
				th.dataset.index = 0;
			}

			if (sortable) {
				th.classList.toggle('sortable');
				th.addEventListener('click', () => this.#sort(header));
			}
			thead.append(th);
		}

		this.table.append(thead);
		this.table.append(this.tbody);

		this.table_root.append(this.table);
		return this;
	}

	createRows(rows) { // добавить строки в таблицу
		for (let row of rows) {
			let tr = document.createElement("tr");
			
			let row_elements = new Array(this.headers.length);
			for (let i = 0; i < this.headers.length; i++) {
				if (this.headers[i].type == 'autoincrement') {
					row_elements[i] = Number(this.headers[i].element.dataset.index) + 1;
					this.headers[i].element.dataset.index = row_elements[i];
				} else {
					for (let key in row) {
						if (key === this.headers[i].key)
							row_elements[i] = row[key];
					}
				}
			}

			for (let el of row_elements) {
				let td = document.createElement("td");
				if (!el) 
					td.innerHTML = '-';
				else
					td.innerHTML = this.#isDate(String(el), td, this.headers[row_elements.indexOf(el)]);
				tr.append(td);
			}

			this.rows.push(tr);
			this.tbody.append(tr);
		}
	}	

	parse(table) {
		this.table = table;
		const headers = table.querySelectorAll("th");
		this.tbody = table.tBodies[0];
		const rows = this.tbody.rows;

		for (let th of headers) {
			const header = {
				'caption': th.innerHTML,
				'element': th
			};
			
			this.headers.push(header);
			if (!th.classList.contains('unsortable')) {
				th.classList.add('sortable');
				th.addEventListener('click', () => this.#sort(header));
			}
		}

		for (let i = 0; i < rows.length ; i++) {
			this.rows.push(rows[i]);
			for (let j = 0; j < this.headers.length; j++) {
				const el = rows[i].children[j];

				el.innerHTML = this.#isDate(el.innerHTML, el, this.headers[j]);
			}
		}
	}

	static parseAll(qSelector) {
		const querries = document.querySelectorAll(qSelector);
		let tables = [];

		for (let selector of querries) {
			let result_table = new this();
			result_table.parse(selector);
			tables.push(result_table);
		}
		
		return tables;
	}
}
