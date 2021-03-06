let myName = $("<h4>Elad David</h4>").addClass("Name").attr('id',"Name");
let upperLine = $("<div></div>").addClass("upperLine");
let content = $("<div></div>").addClass("content").attr('id',"content");
let table_content = $("<div></div>").attr('id',"tableCont");
let details_content = $("<div></div>").attr('id',"details_cont");
let display_table = $("<table></table>").addClass("table");
let row_cell = row = $("<tr></tr>");
let right_col = $("<td></td>");
let left_col = $("<td></td>").addClass("left_col");
upperLine.append(myName);

let countries_table = $("<table></table>");
let deatails_table = $("<table></table>");

//update buttons letters:
let buttons = [];
const upperCaseAlp = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for(let i = 0; i<26; i++){
    buttons[i] = $("<button></button>").addClass("button").text(upperCaseAlp[i]);
    buttons[i].click(loadContriesTable);
    content.append(buttons[i]);
}

function addDetailsTableRow(first_col_val,sec_col_val){
    let row = $("<tr></tr>");
    let first_col = $("<td></td>").text(first_col_val);
    let sec_col;
    if(typeof(sec_col_val) == "array")
        sec_col = $("<td></td>").text(sec_col_val.join(', '));
    else
        sec_col = $("<td>"+sec_col_val+"</td>");
    row.append(first_col);       
    row.append(sec_col);
    deatails_table.append(row);
}

let contry_details;
let country_url;
function displayDeatails(event){ // display the contry deatails after clicking for more deatials
    deatails_table.empty();
    let country_url = event.target.id;
    $.ajax({
        url: country_url,
        "dataType": "json",
        success: function(result){

            let country_language_arr = [];
            for(let i = 0; i < result.language.length; i++){
                country_language_arr.push(result.language[i].language);
            }
            let country_currency_name = result.currency.name;
            if(country_currency_name == null)
                country_currency_name = "";
            let country_currency_symbol = result.currency.symbol;
            if(country_currency_symbol == null || country_currency_symbol == "???" || country_currency_symbol == "??" || country_currency_symbol == '?')
                country_currency_symbol = "";
            let country_currency_rate = result.currency.rate;
            if(country_currency_rate == null)
                country_currency_rate = "";

            let month = currMonth();
            let country_temperature_this_month = result.weather[month].tAvg;

            let country_neighbors_arr = [];
            for(let i = 0; i < result.neighbors.length; i++){
                country_neighbors_arr.push(result.neighbors[i].name);
            }

            addDetailsTableRow("Language:", country_language_arr);
            addDetailsTableRow("Currency name:", country_currency_name);
            addDetailsTableRow("Currency symbol:", country_currency_symbol);
            addDetailsTableRow("Currency rate:", country_currency_rate);
            addDetailsTableRow("Country temperature ave this month:", country_temperature_this_month);
            addDetailsTableRow("Neighbor countries:", country_neighbors_arr);

            details_content.empty();
            details_content.append(deatails_table);


        },
        error: function (jqXhr, status, errorM){ // Error case
            console.log("Error: " + errorM)   
        }
    });
}

function currMonth(){
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[d.getMonth()];
}

function loadContriesTable(event){ //display all the countries that start with the selected letter
    deatails_table.empty();
    let letter = event.target.textContent;
    countries_table.empty();
    let counties_by_letter = [];
    countries_arr.forEach((item) => letter === item.name.charAt(0) ? counties_by_letter.push(item) : null);
    let row;
    counties_by_letter.forEach((item) => { 
        row = $("<tr></tr>");
        let first_col = $("<td></td>").text(item.name);
        let more_details = $("<button></button>").text("click for details").attr('id',item.url).addClass("details_button");
        more_details.click(displayDeatails);
        let sec_col = $("<td></td>");
        sec_col.append(more_details);
        row.append(first_col);       
        row.append(sec_col);
        countries_table.append(row);
    });

    table_content.append(countries_table);
}

let countries_arr = [];
$(document).ready(function() {
    $("#date").load("get_current_date.php");

    $.ajax({
        url: "https://travelbriefing.org/countries.json",
        success: function(countries_list){
            countries_arr = countries_list;
        },
        error: function (jqXhr, status, errorM){ // Error case
            console.log("Error: " + errorM)   
        }
    });

    $("body").append(upperLine);

    left_col.append(table_content);
    right_col.append(details_content);
    row_cell.append(left_col);
    row_cell.append(right_col);
    display_table.append(row_cell);
    content.append(display_table);
    $("body").append(content);
});