class ColumnElement {
    
    children = [];

    dataset = {};
    attributes = {};
    classList = [];
    events = {};
    style = {};

    constructor(data, container_id, numb, type='txt') {
        this.data = this.isDate(String(data), this);
        this.setId(container_id, numb);
        this.rendered = false;
    }

    setId(container_id, numb) {
        this.id = container_id + '-col' + numb;
    }

    getElement() {
        if (this.rendered) {
            const htmEl = document.getElementById(this.id);
            return htmEl;
        } else throw new Error('Элемента не существует!')
    }

    isDate(val, td) { // проверка - является ли значение датой
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
			td.setDataset({'ms': date});
			return formatter.format(date);
		} else return val;
	}

    setDataset(ds) {
        for (let key in ds) this.dataset[key] = ds[key];
        if (this.rendered) {
            const htmEl = document.getElementById(this.id);
            for (let key in ds) htmEl.dataset[key] = ds[key];
        }
        return ds;
    }

    setAttribute(atrName, value) {
        this.attributes[atrName] = value;
    }

    setClassList(mode, clName) {
        if (mode == 'add') this.classList.push(clName);
        else if (mode == 'remove') this.classList.splice(this.classList.indexOf(clName), 1);
        else throw new Error('Неизвестный режим');
        if (this.rendered) {
            const htmEl = document.getElementById(this.id);
            if (mode == 'add') htmEl.classList.add(clName);
            else if (mode == 'remove') htmEl.classList.remove(clName);
        }

    }

    setStyle(styleName, value) {
        this.style[styleName] = value;
        if (this.rendered) {
            const htmEl = this.getElement();
            htmEl.style[styleName] = value;
        }
    }

    on(eventName, func) { 
        this.events[eventName] = func;
        
        if (this.rendered) {
            const htmEl = document.getElementById(this.id);
            htmEl.addEventListener(eventName, func);
        }
    }

    edit(data) {  
        this.data = this.isDate(String(data), this);
        if (this.rendered) this.getElement().innerHTML = this.data;
        this.children = [];
    }

    append(elem) {
        if (this.rendered) {
            this.children.push(elem)
            const htmEl = this.getElement()
            htmEl.innerHTML = '';
            htmEl.append(elem.render())
        }
    }

    render(tag) {
        const rend = document.createElement(tag);
        rend.innerHTML = this.data;
        for (let ev in this.events) {
            rend.addEventListener(ev, this.events[ev]);
        }
        for (let atr in this.attributes) {
            rend.setAttribute(atr, this.attributes[atr])
        }

        for (let ds in this.dataset) {
            rend.dataset[ds] = this.dataset[ds]
        }

        for (let stl in this.style) {
            rend.style[stl] = this.style[stl]
        }

        this.classList.forEach(cl => {
            rend.classList.add(cl)
        });
        rend.id = this.id;
        this.rendered = true;
        return rend;
    }
}