class Input{
    constructor(type, container_id, numb, data = ''){
        this.type = type;
        this.id = container_id + '-inp' + numb;
        this.data = data;
    }

    render() {
        const el = document.createElement('input');
        el.type = this.type;
        el.id = this.id;
        el.value = this.data;
        this.rendered = 1;
        return el;
    }

    getValue() {
        if (this.rendered) {
            const htmEl = document.getElementById(this.id);
            this.data = htmEl.value;
            return htmEl.value;
        } else {
            console.error('Ошибка. Элемента INPUT не существует на странице.')
        }
    }
}