class Row {
    
    cols = [];

    constructor(container_id, numb, elems = undefined) {
        this.id = container_id + '-row' + numb;
        if (elems) {
            for (let el of elems) {
                const col = new ColumnElement(el, this.id, this.getLength());
                this.cols.push(col)
            }
        }
    }

    getLength() {
        return this.cols.length;
    }

    getValues() {
        const result = [];
        this.cols.forEach(el => result.push(el.data));
        return result;
    }

    append(el) {
        if (el instanceof ColumnElement) this.cols.push(el)
        else {
            const col = new ColumnElement(el, this.id, this.cols.length);
            this.cols.push(col);
            el = col;
        }
        if (this.rendered) {
            const ren = el.render(this.tagCol);
            this.getElement().append(ren);
        }
    }

    insert(el, index) {
        if (el instanceof ColumnElement) this.cols[index] = el;
        else {
            const col = new ColumnElement(el, this.id, index);
            this.cols[index] = col;
        }
        
        if (this.rendered) {
            const htmEl = this.getElement();
            htmEl.children[index].innerHTML = this.cols[index].render.innerHTML;
            console.log(this.cols[index])
        }

        return this.cols[index];
    }

    deleteCell(id) {
        let index;
        this.cols.forEach((col, ind) => {
            if (col.id == id) index = ind;
        });

        if (this.cols[index].rendered) {
            this.getElement().deleteCell(index);
        }

        this.cols.splice(index, 1);
    }

    getElement() {
        if (this.rendered) {
            return document.getElementById(this.id);
        } else throw new Error('Элемента не существует!');
    }

    render (tagRow, tagCol) {
        const cont = document.createElement(tagRow);
        this.cols.forEach(el => {
            const col = el.render(tagCol);
            cont.append(col);
        });
        cont.id = this.id;
        
        this.tagRow = tagRow;
        this.tagCol = tagCol
        this.rendered = 1;

        return cont;
    }

    theOnlyElement(data, index, length) {
        let res;
        for (let i = 0; i < length; i++) {
            if (i != index) {
                const el = new ColumnElement('', this.id, i);
                el.setStyle('visibility', 'hidden');
                this.cols.push(el);
            } else {
                const el = new ColumnElement(data, this.id, i);
                this.cols.push(el);
                res = el;
            }
        }
        return res;
    }
}