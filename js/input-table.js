class InputTable {

    constructor (table) {
        if (!(table instanceof Table)) {
            throw new Error(`${table} не является объектом класса Table.`)
        }

        this.table = table.table;
        this.table_obj = table;
        
        const tfoot = document.createElement("tfoot");
         
        const row = document.createElement("tr");

        let defs = [];
        for (let i = 0; i < this.table.tHead.children[0].children.length; i++) {
            defs[i] = document.createElement("td");
            defs[i].style.visibility = 'hidden';
            row.append(defs[i]);
        }
        const add_btn = defs[defs.length-1];
        add_btn.style.visibility = '';
        add_btn.classList.add('btn');
        add_btn.innerHTML = 'Редактировать';
        add_btn.addEventListener('click', () => this.createInput(row));
        tfoot.append(row);
        this.table.append(tfoot);
    }

    createInput(first_row) {
        const tfoot = this.table.tFoot;
        const headers = this.table.tHead.children[0].children;
       
        first_row.hidden = true;
        
        const row = document.createElement("tr");
        for (let i = 0; i < headers.length; i++) {
            const td = document.createElement("td");
            if (headers[i].dataset.key) {
                const inp = document.createElement("input");
                inp.type = 'text';
                td.append(inp);
                td.dataset.key = headers[i].dataset.key;
                
                for (let row of this.table.tBodies[0].children) {
                    row.children[i].addEventListener('click', this.editElement);
                }
            } else {
                td.style.visibility = 'hidden';
            }
            row.append(td);
        }
        
        
        
        this.inpRow = row;
        const btn = document.createElement("td");
        btn.classList.add('btn');
        btn.innerHTML = 'Добавить / Ок';
        
        this.makeEdits(btn);
        btn.addEventListener('click', () => this.editDone(first_row));
        
        row.append(btn)
        tfoot.append(row);        
    }

    editDone(first_row) {
        result = {};
        for (let i = 0; i < this.table.tHead.children[0].children.length; i++) {
            const input_td = this.inpRow.children[i];
            if (input_td.style.visibility != 'hidden') {
                const inp_data = input_td.children[0].value;
                if (inp_data) result[input_td.dataset.key] = inp_data;
            } else continue;
        }
        this.table.tFoot.deleteRow(this.inpRow.sectionRowIndex);
    
        if (Object.keys(result).length) this.table_obj.createRows([result])
        first_row.hidden = false;
    }

    makeEdits(close_btn) {
        for (let row of this.table.tBodies[0].children) {
            const del_td = document.createElement("td");
            del_td.innerHTML = '[X]';
            del_td.classList.add('remove-row');
            del_td.addEventListener("click", () => this.table_obj.deleteRow(row.sectionRowIndex));
            row.append(del_td);

            const ed_td = document.createElement("td");
            ed_td.innerHTML = '[...]';
            ed_td.classList.add('edit-row');
            ed_td.dataset.editing = -1;
            ed_td.addEventListener("click", (event) => editRow(event));
            row.append(ed_td);
            
        }

        const editRow = (event) => {
            const headers = this.table.tHead.children[0].children;
            const tds = event.target.parentElement.children;
            
            const editing = (event.target.dataset.editing = -(event.target.dataset.editing || -1))

            let edits = {};
            for (let i = 0; i < headers.length; i++) {
                if (headers[i].dataset.key) {
                    if (editing < 0) {    
                        const inp = tds[i].children[0];
                        edits[headers[i].dataset.key] = inp.value;
                    } else {
                        const inp = document.createElement("input")
                        inp.type = 'text';
                        inp.value = tds[i].innerText;
                        tds[i].innerText = '';
                        tds[i].append(inp);
                    }
                }
            }
            if (editing < 0) this.table_obj.editRow({
                'index': event.target.parentElement.sectionRowIndex,
                'edit': edits
            });
        }

        close_btn.addEventListener("click", () => {
            for (let row of this.table.tBodies[0].children) {
                row.deleteCell(this.table.tHead.children[0].children.length);
                if (row.children[this.table.tHead.children[0].children.length].dataset.editing > 0)
                    row.children[this.table.tHead.children[0].children.length].dispatchEvent(new Event("click"));
                row.deleteCell(this.table.tHead.children[0].children.length);
            }
        });
    }
}