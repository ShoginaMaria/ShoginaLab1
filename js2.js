

function workWithXML(){

	var xml = new XMLHttpRequest();
	xml.open( 'GET', 'input.xml' , false );
	xml.send();
  	var pars = new DOMParser();
  	var info = pars.parseFromString( xml.responseText, 'text/xml' );
  	var infoList = info.getElementsByTagName( 'Parameter' );
	var row = '';
	for( var i = 0; i < infoList.length; i++ ){

		var value = infoList[i].getElementsByTagName( 'Value' )[0].textContent;
		var type = infoList[i].getElementsByTagName( 'Type' )[0].textContent;
		row += '<tr>';
		row += '<td>' + infoList[i].getElementsByTagName( 'Id' )[0].textContent; + '</td>';
		row += '<td>' + infoList[i].getElementsByTagName( 'Name' )[0].textContent; + '</td>';
		row += '<td>' + infoList[i].getElementsByTagName( 'Description' )[0].textContent; + '</td>';
		row += '<td>' + createValueField( type, value ) + '</td>';		
		row += '<td><input  type=\'image\' src=\'corz.png\' width=\'40px\' onclick=\'deleteRow(this)\'></td>';
		//row += '<td><input  type=\'button\' value=\'Clear\' width=\'40px\' onclick=\'clearRow(this)\'></td>';
		row += '</tr>';
	}		
	document.getElementById( 'Info' ).innerHTML += row;
}

function addRow(){
//var index1 = field.selectionStart ;
	var selInd = document.getElementById('newType');
	var type = selInd.options[selInd.selectedIndex].value;
	var row = '';
	var field = document.getElementById('newValue');
   if (document.getElementById( 'newName' ).value.length=="")
   {
	   alert('Error row must have Name');
	   return;
   }
	if (field.value.length === 0) 
{
	field.style.borderColor = "red";
	alert('Empty value in "Enter value"!');
	field.style.borderColor = "white";
	return;
}

if (field.value.length <= 5)
{ 
   // field.selectionStart=indexOf.field+1 ;
	field.style.borderColor = "white";
	row += '<tr>';
	row += '<td>' + document.getElementById( 'newId' ).value + '</td>';
	row += '<td>' + document.getElementById( 'newName' ).value + '</td>';
	row += '<td>' + document.getElementById( 'newDescription' ).value + '</td>';
	row += '<td>' + valueFromNewField( type, field ) + '</td>';	
	row += '<td><input  type=\'image\' src=\'corz.png\' width=\'40px\' onclick=\'deleteRow(this)\'></td>';
//	row += '<td><input  type=\'button\' value=\'Clear\' width=\'40px\' onclick=\'clearRow(this)\'></td>';
	row += '</tr>';
	document.getElementById( 'Info' ).innerHTML += row;
}
//if (field.value.length > 10)
//{
//	field.style.borderColor = "red";
//	alert('Can not add value int more 10 sumbols!');
//	 field.style.borderColor = "white";
//}

        field.value='';
 
}

function createOutput()
{
	//var flag=false;
	var info = document.getElementById( 'Info' );
	var rowsList = info.getElementsByTagName("tr");
	var output = '<?xml version=\"1.0\"?>\n';

	// if ((isValueValid(fieldsList[3].childNodes[0], type) === true) && (type === 'System.Boolean')) {
            //fieldsList[3].childNodes[0].setAttribute('id', 'complete');
      //      flag = true;
		//	alert('ytyjtrfyhhr');
       // }
	output += "<Parameters>\n";
	for( var i = 0; i < rowsList.length; i++ )
	{
		
		var fieldsList = rowsList[i].getElementsByTagName("td");
		output += "<Parameter>\n\r";
		output += "<Id>" + fieldsList[0].textContent + "</Id>\n";
		output += "<Name>" + fieldsList[1].textContent + "</Name>\n";
		output += "<Description>" + fieldsList[2].textContent + "</Description>\n";
		output += "<Type>" + getOutputType(fieldsList[3].childNodes[0].getAttribute("type")) + "</Type>\n";

		output += "<Value>" + getOutputValue(fieldsList[3]) + "</Value>\n";
		output += "</Parameter>\n";
	}
	output += "</Parameters>";
	return output;
}


function createXML( name, type ) {
	if( !checkTable() )
  {
	alert( "Can not add info if all combobox have value false" );
		return;
  }
  var text = createOutput();
  
  var link = document.getElementById("download_link");
  var file = new Blob([text], {type: type});
  
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.style.display = '';
}

function clearValue(field){
	var field = document.getElementById('newValue');

	return field.value='';
}
function clearAllValue(field){
	clearValue(field);
	clearId(field);
	clearName(field);
	clearDescription(field);
	

}
function getOutputValue( field ){

	switch ( field.childNodes[0].getAttribute("type") ) {
		case 'text':
			return field.childNodes[0].value;
		case 'checkbox':
			if ( field.childNodes[0].checked ) 
				return 'True';
			else 
				return 'False';
		case 'number':
			return field.childNodes[0].value;
		
	}
}


function createValueField( type, value ){
	switch ( type ) {
		case 'System.String':
			return '<input type=\'text\' maxlength="7" onchange="changeValueInField(this)" value=' + value + '>';
		case 'System.Boolean':
			if ( value === 'False' )
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" >';
			else
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" checked>';
		case 'System.Int32':
			return '<input type=\'number\' maxlength="5"  oninput="checkNumberInField(this);changeValueInField(this)" value=' + value + '>'; // поменять местами онпуты
		
	}
}

function getOutputType( type ) {
	switch ( type ) {
		case 'text':
			return 'System.String';
		case 'checkbox':
			return 'System.Boolean';
		case 'number':
			return 'System.Int32';
		
	}
}

function valueFromNewField( type, field ){
	switch ( type ) {
		case 'System.String':
			return '<input type=\'text\' maxlength="7" onchange="changeValueInField(this)" value=' + field.value + '>';
		case 'System.Boolean':
			if ( field.checked == false )
				return '<input type=\'checkbox\' onchange="changeValueInField(this)'  + field.value + ' >';
	//alert(field.value);
			else
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" checked>';
		case 'System.Int32':
			return '<input type=\'number\' maxlength="5"  oninput="checkNumberInField(this);changeValueInField(this)" value=' + field.value + '>';  // поменять местами онпуты
		
	}
}

function changeFieldType( field ){
	var type = field.options[field.selectedIndex].value;
	var newValueField = document.getElementById('newValue');

	switch ( type ) {
		case 'System.String':
			newValueField.setAttribute('type', 'text');
			newValueField.removeAttribute('oninput');
			break;
		case 'System.Boolean':
			newValueField.setAttribute('type', 'checkbox');
			newValueField.removeAttribute('oninput');
			break;
		case 'System.Int32':
			newValueField.setAttribute('type', 'number');
			newValueField.setAttribute('oninput', 'checkNumberInField(this)');
			break;
		
		}
}




function deleteRow(d){

	var row = d.parentNode.parentNode;
	document.getElementById('Info').deleteRow(row.rowIndex);
}
//function clearRow(field){
//if ( field.getAttribute("type") === 'text'){
//field.value='';
//return;
//}
//if ( field.getAttribute("type") === 'number'){
//	field.value='';
//return;
//}
//}


function changeValueInField( field ){

//var i=0;
var index1 = field.selectionStart;
//if ( field.getAttribute("type") === 'text')
	//{ 
 //if (field.value.length>=7){
	// field.style.borderColor = "red";
	//alert('Can not add value int more 7 sumbols!');
	// field.style.borderColor = "white";
//	 field.value='';
// }
	 
	//}
	if ( field.getAttribute("type") === 'checkbox')
	{ 


//var flag=false;
        //    if(field.value = field.getAttribute('value');)
       //     isBool = true;
        
		if( field.checked == true )
			field.setAttribute('checked', true);
	//	i++;
	//	alert(i);}
		if( field.checked == false )
			field.removeAttribute('checked');
	}
	if ( field.getAttribute("type") === 'number')
	{
	//	var index1 = field.selectionStart;
	//	var index2 = field.selectionEnd;
		if (field.value.length <= 5){
		field.setAttribute("value", field.value);
	//	checkIndex( field );
	//	i++;
	//	if (i>0) checkNumberInField(field);
		}
	else {
		field.style.borderColor = "red";
	alert('Can not add value int more 5 sumbols!');
	 field.style.borderColor = "white";
	 field.value='';

	}
	//for (var i=0;field.value.length<=5;i++)
	//{
		//if 
	
		field.selectionStart = index1-1;
           field.selectionEnd = index1-1;
	//field.selectionStart = 1;
//field.selectionEnd = index1;
//	}
	}
//	alert(i);
	//return i;
}

function checkNumberInField( field ){	
var index = field.selectionStart;
	//var regular = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$");
	var regular = new RegExp("^([+-]?)[0-9]+$|^0$");
	//var regular1 = new RegExp("^([+-]?)[0-9]+$");
    if (!regular.test(field.value) )
	{ 

		//alert('It\'s not a number!');
		field.value = field.getAttribute('value');
	}

//field.selectionStart = index;
//field.selectionEnd = index;
//if (!regular1.test(field.value) )
//var str = field.value.toString();
//var  str1 = str.split('-',2); 
//alert('Индекс позиции курсора ' +index + "\n"); 
//if (i == 0){
 field.selectionStart = index;
field.selectionEnd = index;
//}
//else {
	//field.selectionStart = index+1;
//field.selectionEnd = index-1;
//}
}
function checkTable()
{
	var	table =	document.getElementById( 'Info' );
    var rowsList = table.getElementsByTagName("tr");
	var boolExist = false;
	for( var i = 1; i < rowsList.length; i++ )
	{
		var fieldsList = rowsList[i].getElementsByTagName("td");
		var xmlType = getXMLType( fieldsList[3].childNodes[0] );
		if( xmlType == "System.Boolean" )
		{
			boolExist = true;
			var xmlValue = getXMLValueType( fieldsList[3].childNodes[0] );
			if( xmlValue == "True" )
				return true;
		}
	}
	return boolExist ? false : true;
}


	function getXMLType( field )
{
	switch ( field.getAttribute('type') ) 
	{
		case 'text':
		{
		    if( field.getAttribute('digit') == "true") 
				return "System.Int32";
			else
				return "System.String";
		}
		case 'checkbox':
			return "System.Boolean";
	}
}

function getXMLValueType( field )
{
	if( field.type == "checkbox" && field.checked == true )
		return "True";
	if( field.type == "checkbox" && field.checked == false )
		return "False";
	
	return field.value;
}

function clearId(field){
	var field = document.getElementById('newId');

	return field.value='';
}
function clearName(field){
	var field = document.getElementById('newName');

	return field.value='';
}
function clearDescription(field){
	var field = document.getElementById('newDescription');

	return field.value='';
}
