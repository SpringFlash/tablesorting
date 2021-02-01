class RowHeader {
    renderfuncs = [];

    constructor(headers, table_id) {
        this.id = table_id + '-header';
        this.head = new Row(this.id, 0);
        headers.forEach((header, index) => {
            const {key, label, render, sortable = true} = header;
            const col = new ColumnElement(label, this.id, this.head.cols.length); // document.createElement(elemTag);
            // th.innerHTML = label;
            
            if (render) {
                col.setAttribute('type', 'rendering');
                this.renderfuncs[index] = render;
            } else if (!key) {
                col.setAttribute('type', 'autoincrement');
                col.dataset.index = 0;
            } else {
                col.dataset.key = key;
            }
            if (sortable) {
                col.setClassList('add', 'sortable')
                col.dataset.order = 0;
                col.sorting = function(a, b, order, index) {
		            const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
                    return order * collator.compare(
                        a.cols[index].data,
                        b.cols[index].data
                    );
                }
            }
            this.head.append(col);
            this.length = this.head.getLength();
        });
    }

    getSortableHeaders() {
        let result = [];
        this.head.cols.forEach((el, ind) => {
            if (el.classList.includes('sortable')) result[ind] = el
        });
        return result;
    }

    getEditableHeaders() {
        let result = [];
        this.head.cols.forEach((el, ind) => {
            if (el.dataset.key) result[ind] = el
        });
        return result;
    }

    getCol(ind, row, elements) {
        const type = this.head.cols[ind].attributes['type'];
        if (type == 'autoincrement') {
            const result = Number(this.head.cols[ind].dataset.index) + 1; // tr.insert(thead[i].dataset.index+1, i)
            this.head.cols[ind].setDataset({'index': result});
            return new ColumnElement(result);
        } else if (type == 'rendering') {
            return new ColumnElement(this.renderfuncs[ind](elements));
        } else {
            for (let key in row) {
                if (key == this.head.cols[ind].dataset.key) {
                    const col = new ColumnElement(row[key]);
                    if (col.dataset.ms) {
                        this.head.cols[ind].setAttribute('type', 'date');
                        if (this.head.cols[ind].sorting)
                            this.head.cols[ind].sorting = function(a, b, order, index) {
                                const collator = new Intl.Collator(['en', 'ru'], { numeric: true, });
                                return order * collator.compare(
                                    a.cols[index].dataset.ms,
                                    b.cols[index].dataset.ms
                                );
                            }
                    }
                    return col;
                }  
            }
            return new ColumnElement('-');
        } 
    }

    render(tagHead, tagRow, tagCol) {
        const cont = document.createElement(tagHead);
        const rend = this.head.render(tagRow, tagCol);
        cont.append(rend)
        cont.id = this.id;
        return cont;
    }
}