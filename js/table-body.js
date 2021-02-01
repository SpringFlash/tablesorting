class TableBody {

    rows = [];

    constructor(table_id) {
        this.id = table_id + '-body';
    }

    addRow(row, rowTag=undefined, elTag=undefined) {
        this.rows.push(row);
        if (this.rendered) {
            this.getElement().append(row.render(rowTag, elTag));
        }
    }

    deleteRow(id) {
        let index;
        this.rows.forEach((row, ind) => {
            if (row.id == id) index = ind;
        });

        if (this.rows[index].rendered) {
            this.getElement().deleteRow(index);
        }

        this.rows.splice(index, 1);
    }

    getLength() {
        return this.rows.length;
    }

    sort(check, table) {
        this.rows.sort((a, b) => check(a, b));
        this.rows.forEach(row => this.getElement().append(row.getElement()));
    }

    getElement() {
        try {
            return document.getElementById(this.id);
        } catch (error) {
            console.error(error);
        }
    }

    render(bodyTag) {
        const tbody = document.createElement(bodyTag)
        tbody.id = this.id;
        this.rendered = true;
        return tbody;
    }
}