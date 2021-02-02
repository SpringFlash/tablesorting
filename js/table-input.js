class InputTableN {
    constructor(table) {
        this.table = table;
        this.foot_btn = new Row(table.id + '-foot', 0);
        
        const val = this.foot_btn.theOnlyElement('Редактировать', this.table.headersLength-1, this.table.headersLength);
        val.setClassList('add', 'btn');
        val.setAttribute('editing', 0);
        val.on('click', () => this.edit());

        const addClk = this.foot_btn.insert('[+]', this.foot_btn.getLength()-2);
        addClk.setClassList('add', 'btn');
        addClk.on('click', () => this.addRow());

        return this
    }

    edit() {
        const editing = this.foot_btn.cols[this.foot_btn.getLength()-1].attributes.editing;
        if (!editing)
        {
            this.table.bodyContainer.rows.forEach(row => {
                const edClk = new ColumnElement('[...]', row.id, row.getLength());
                edClk.dataset.type = 'editRow';
                edClk.setAttribute('editing', 0)
                edClk.setClassList('add', 'btn');
                edClk.on('click', () => this.editRow(row));
                row.append(edClk)
            });

            this.table.bodyContainer.rows.forEach(row => {
                const rmClk = new ColumnElement('[x]', row.id, row.getLength());
                rmClk.dataset.type = 'deleteRow';
                rmClk.setClassList('add', 'btn');
                rmClk.on('click', () => this.table.bodyContainer.deleteRow(row.id));
                row.append(rmClk)
            }); 

            this.foot_btn.cols[this.foot_btn.getLength()-1].on('click', this.closeEdits)
            console.log(this.foot_btn.cols[this.foot_btn.getLength()-1])

            this.foot_btn.cols[this.foot_btn.getLength()-1].setAttribute('editing', 1)
        } else {
            this.table.bodyContainer.rows.forEach(row => {
                if (row.cols[row.getLength()-2].attributes.editing) this.editRow(row);
                row.deleteCell(row.cols[row.getLength()-1].id)
                row.deleteCell(row.cols[row.getLength()-1].id)
            }); 

            this.foot_btn.cols[this.foot_btn.getLength()-1].setAttribute('editing', 0)
        }
    }

    addRow() {
        if (this.foot_btn.cols[this.foot_btn.getLength()-1].attributes.editing) this.edit();
        this.table.createRows([{}]);
        this.edit();
        this.editRow(this.table.bodyContainer.rows[this.table.bodyContainer.getLength()-1]);
    }

    editRow(row) {
        const edHdrs = this.table.headersRow.getEditableHeaders();
        const editing = row.cols[row.cols.length-2].attributes.editing;

        if (!editing) {
            edHdrs.forEach((hdr, ind) => {
                const inp = new Input('text', row.cols[ind].id, 0, row.cols[ind].data)
                row.cols[ind].append(inp);
            });
            row.cols[row.cols.length-2].edit('[v]')
            row.cols[row.cols.length-2].setAttribute('editing', 1)
        } else {
            let editData = [];
            edHdrs.forEach((hdr, ind) => {
                editData[ind] = row.cols[ind].children[0].getValue();
            });
            
            
            for (let i = 0; i < this.table.headersLength; i++) {
                const type = this.table.headersRow.head.cols[i].attributes['type'];
                if (type == 'rendering') row.cols[i].edit(this.table.headersRow.renderfuncs[i](row));
                else if (type == 'autoincrement') continue;
                else row.cols[i].edit(editData[i]);
            }

            row.cols[row.cols.length-2].edit('[...]')
            row.cols[row.cols.length-2].setAttribute('editing', 0)
        }
    }

    render() {
        const rend = this.foot_btn.render('tfoot', 'td');
        return rend;
    }
}