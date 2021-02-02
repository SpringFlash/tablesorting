class TableN {

    sort(event, index) {
        const order = (event.setDataset({'order': -(event.dataset.order || -1)})['order']);
        const sorting = event.sorting;
        this.bodyContainer.sort((row1, row2) => sorting(row1, row2, order, index));
        for(const el of [...event.getElement().parentElement.children]) el.classList.toggle('sorted', el === event.getElement());
    }
    
    init({root, editable=false, headers, tags={}}) {
        this.id = 'table' + [...document.getElementsByTagName('table')].length;
        this.headersRow = new RowHeader(headers, this.id);
        this.bodyContainer = new TableBody(this.id);
        this.headersLength = this.headersRow.length;
        this.editable = editable;
        
        const {tableTag='table', rowTag='tr', headTag='thead', headerTag='th', bodyTag='tbody'} = tags;
        const table_root = document.querySelector(root);
        const html_table = this.render(tableTag, headTag, rowTag, headerTag, bodyTag)
        
        table_root.append(html_table);
        this.headersRow.getSortableHeaders().forEach((el, ind) => {
            if (el != undefined)
                el.on('click', () => this.sort(el, ind));
        });

        return this;
    }

    getElement() {
        try {
            return document.getElementById(this.id)
        } catch (error) {
            console.error(error);
        }   
    }

    createRows(rows, rowTag='tr', elTag='td') {
        for (let data of rows) {
            let row = new Row(this.bodyContainer.id, this.bodyContainer.getLength());
            for (let i = 0; i < this.headersLength; i++) {
                let value = this.headersRow.getCol(i, data, row);
                value.setId(row.id, i)
                row.insert(value, i);
            }
            this.bodyContainer.addRow(row, rowTag, elTag);
        }
    }

    render(parentTag, headTag, rowTag, headElTag, bodyTag) {
        const tableRend = document.createElement(parentTag);
        
        const headers = this.headersRow.render(headTag, rowTag, headElTag);
        tableRend.append(headers);

        const body = this.bodyContainer.render(bodyTag);
        tableRend.append(body);
        
        if (this.editable) {
            const HTML_input = new InputTableN(this);
            const inprend = HTML_input.render()
            tableRend.append(inprend)
        }

        tableRend.id = this.id;
        return tableRend;
    }
}