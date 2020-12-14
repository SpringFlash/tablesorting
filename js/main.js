document.addEventListener("DOMContentLoaded", () => {
	const first_tables = Table.parseAll('.tab', true);

	const new_table = new Table().init({
		'root': '#table-cont',
		'editable': true,
		'headers': [
			{
				'label': '№',
				'sortable': false,
			},
			{
				'key': 'state',
				'label': 'Штат'
			},
			{
				'key': 'count',
				'label': 'Количество выборщиков'
			},
			{
				'key': 'date',
				'label': 'Дата принятия',
			},
			{
				'label': 'Сумма букв',
				'render': function(row) {
					result = row[1].length;
					return result;
				}
			}
		]
	});

	new_table.createRows([
		{
			'state': 'Мэриленд',
			'count': '10',
			'date': '10.04.2007'
		},
		{
			'state': 'Нью-Джерси',
			'count': '14',
			'date': '13.01.2008'
		},
		{
			'state': 'Иллинойс',
			'count': '20',
			'date': '7.04.2008'
		},
		{
			'state': 'Гавайи',
			'count': '4',
			'date': '1.05.2008'
		},
		{
			'state': 'Вашингтон',
			'count': '12',
			'date': '28.04.2009'
		},
		{
			'state': 'Массачусетс',
			'count': '11',
			'date': '4.08.2010'
		},
		{
			'state': 'Округ Колумбия',
			'count': '3',
			'date': '7.12.2011'
		},
		{
			'state': 'Вермонт',
			'count': '3',
			'date': '22.04.2011'
		},
		{
			'state': 'Калифорния',
			'count': '55',
			'date': '8.06.2011'
		},
		{
			'state': 'Род Айленд',
			'count': '4',
			'date': '12.07.2013'
		},
		{
			'state': 'Нью-Йорк',
			'count': '29',
			'date': '15.04.2014'
		},
		{
			'state': 'Коннектикут',
			'count': '7',
			'date': '24.05.2018'
		},
		{
			'state': 'Колорадо',
			'count': '9',
			'date': '15.04.2019'
		},
		{
			'state': 'Делавэр',
			'count': '3',
			'date': '28.04.2019'
		},
		{
			'state': 'Нью-Мексико',
			'count': '5',
			'date': '3.04.2019'
		},
		{
			'state': 'Орегон',
			'count': '7',
			'date': '12.06.2019'
		}
	]);

});

