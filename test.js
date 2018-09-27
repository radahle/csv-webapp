



d3.csv('iris.csv',function (data) {
    var body = d3.select('body');


    var selectData1 = [ { "text" : "Annualized Return" },
        { "text" : "Annualized Standard Deviation" },
        { "text" : "Maximum Drawdown" },
    ]

    var selectData = d3.keys(data[0]);


    var span = body.append('span')
        .text('Select X-Axis variable: ');
    var yInput = body.append('select')
        .append('option')
        .data()
    body.append('br');

})