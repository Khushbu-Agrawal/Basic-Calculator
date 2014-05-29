var lastOperand = "";

function validateOperands() {
	if( $.txtField1.value == "" ||
		$.txtField2.value == "")
	{
		alert('Enter both the operands');
		return false;
	}
	return true;
}

function validateResult() {
	if( $.txtResult.value == "")
	{
		alert('Error: Please perform some operation first !');
		return false;
	}
	return true;
}

function onAddClick(e) {
	if(!validateOperands())
		return;
	
	$.txtResult.value = parseInt($.txtField1.value) + parseInt($.txtField2.value);
	lastOperand = "ADD";
}

function onSubstractClick(e) {
	if(!validateOperands())
		return;
    $.txtResult.value = parseInt($.txtField1.value) - parseInt($.txtField2.value);
    lastOperand = "SUB";
}

function onMultiplyClick(e) {
	if(!validateOperands())
		return;
    $.txtResult.value = parseInt($.txtField1.value) * parseInt($.txtField2.value);
    lastOperand = "MUL";
}

function onDivisionClick(e) {
	if(!validateOperands())
		return;
	
	var input2 = parseInt($.txtField2.value);
	
	// Handle divide by zero condition
	if (input2 == 0)
	{
		$.txtResult.value = "Error: Divide by Zero !!!";
	}
	else
	{
		$.txtResult.value = parseInt($.txtField1.value) / input2;
		lastOperand = "DIV";
	}
}

function onSaveClick(e)
{
	// Validate operand
	if(!validateOperands())
		return;
	
	// Valdiate txtResult
	if(!validateResult())
		return;

	// Created variable to hold cloud module
    var Cloud = require('ti.cloud');
	Cloud.debug = true;

	// Check sessionId
	Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
	if(!Cloud.sessionId)
	{
		alert("Please loging first");
		return;
	}

	// Lets save data now...
	saveToACS();
}

function onLoginClick()
{
	// Created variable to hold cloud module
    var Cloud = require('ti.cloud');
	Cloud.debug = true;

	Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
	if(!Cloud.sessionId)
	{
		Ti.API.info("Setting Cloud.sessionId ... ");
		Cloud.sessionId = "3vXCiZ1hqdlgBxnVZ1dDkd1Z8Os";
		Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
		
		// Login into Cloud
		Cloud.Users.login(
		{ 
		    login: "khushbu.agrawal1@gmail.com",
		    password: "pass123"
		}, function(e)
		{
		    if (e.success)
		    {
		        var user = e.users[0];
		        Ti.API.info('Success:\n' +
		            'id: ' + user.id + '\n' +
		            'sessionId: ' + Cloud.sessionId + '\n' +
		            'first name: ' + user.first_name + '\n' +
		            'last name: ' + user.last_name);
		    } else {
		        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
}

function saveToACS()
{
	Ti.API.info("Saving data to Cloud ...");
	
	var Cloud = require('ti.cloud');
	Cloud.debug = true;

	//Creating optionDialog with View	
	var inputView = Titanium.UI.createView({
        backgroundColor:'#111'
    });
 
	// Create TextField
    var locField = Titanium.UI.createTextField({
        hintText:'Enter Name',
        height:35,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    inputView.add(locField);
    
    // Create Dialog
    var dialog = Titanium.UI.createOptionDialog({
        androidView: inputView,
        buttonNames: ['OK'],
        title: 'Save to ACS'
    });
 
    // Show dialog
    dialog.show();
    dialog.addEventListener('click', function(e)
    {
		Titanium.API.info("Dialog Click : " + JSON.stringify(e));
	    if (e.button == true && e.index == 0)
	    {
	    	// Info
	    	Ti.API.info("Operand while saving data = " + lastOperand);
	    	Ti.API.info("Save to ACS name: " + locField.value);
	    	
	    	// Validate Name
	    	if(locField.value == "")
	    	{
	    		alert ("Error: Name is empty !");
	    		return;
	    	}
		    
		    // Create custom object
			Cloud.Objects.create({
			    classname: 'Calculator',
			    fields: {
			        operand1: $.txtField1.value,
			        operand2: $.txtField2.value,
			        operator: lastOperand,
			        result: $.txtResult.value,
			        name: locField.value
			    }
			}, function (e) {
			    if (e.success) {
			        var calculator = e.Calculator[0];
			        Ti.API.info('Success:\n' +
			            'operand1: ' + calculator.operand1 + '\n' +
			            'operand2: ' + calculator.operand2 + '\n' +
			            'operator: ' + calculator.operator + '\n' +
			            'result: ' + calculator.result + '\n' + 
			            'name: ' + calculator.name);
			    } else {
			        alert('Error:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});            
		}
	});	
}

function onRetriveClick(n) {
    var Cloud = require('ti.cloud');
	Cloud.debug = true;
		
	// Query Data
    Cloud.Objects.query({
	    classname: 'Calculator',
	    page: 1,
	    per_page: 100,
	    /*
	    where: {
	        operator: 'ADD'
	    }*/
	}, function (e) {
	    if (e.success) {
	        Ti.API.info('Success: \n' +
	            'Count: ' + e.Calculator.length);
			
			var row, dateField, placeLabel, reviewLabel;
			var displayData = [];
			    
	        for (var i = 0; i < e.Calculator.length; i++) {
	            var calculator = e.Calculator[i];
	            // Info
	            Ti.API.info('id: ' + calculator.id + '\n' +
	                'operand1: ' + calculator.operand1 + '\n' +
		            'operand2: ' + calculator.operand1 + '\n' +
		            'operator: ' + calculator.operator + '\n' +
		            'result: ' + calculator.result + '\n' + 
		            'name: ' + calculator.name);
		        
	            // create table row
	            row = Ti.UI.createTableViewRow({
	                height:35,
	                backgroundColor : 'black',
	                font: {fontSize:20},
	                title: "Calculator_Data"
	            });
	            
	            // create operand1Label
	            operand1Label = Ti.UI.createLabel({
	                text: calculator.operand1,
	                font: {fontSize:20}, 
	                color:'white', 
	                left:5, 
	                width:Ti.UI.FILL
	            });
	            row.add(operand1Label);
	
	            // create operatorLabel
	            operatorLabel = Ti.UI.createLabel({
	                text: calculator.operator,
	                font: {fontSize:20}, 
	                color:'white',
	                left:50,
	                width:Ti.UI.FILL
	            });
	            row.add(operatorLabel);
	
	            // create operand2Label
	            operand2Label = Ti.UI.createLabel({
	                text: calculator.operand2,
	                font: {fontSize:20}, 
	                color:'white', 
	                left:100, 
	                width:Ti.UI.FILL
	            });
	            row.add(operand2Label);
	            
	            // create resultLabel
	            resultLabel = Ti.UI.createLabel({
	                text: calculator.result,
	                font: {fontSize:20}, 
	                color:'white', 
	                left:150, 
	                width:Ti.UI.FILL
	            });
	            row.add(resultLabel);
	            
	            // create nameLabel
	            nameLabel = Ti.UI.createLabel({
	                text: calculator.name,
	                font: {fontSize:20}, 
	                color:'white', 
	                left:200, 
	                width:Ti.UI.FILL
	            });
	            row.add(nameLabel);
	
	            displayData.push(row);
	        }
	
        	// create table
		    var tableView = Ti.UI.createTableView({
		        scrollable: true,
		        width: '100%',
		        height: '100%',
		        minRowHeight: '25',
		    });
		    tableView.setData(displayData);

	        //Creating optionDialog with View	
			var inputView = Titanium.UI.createView({
		        backgroundColor:'black',
		        width: '100%',
		        height: '100%'
		    });
            inputView.add(tableView);

            // Create Dialog
		    var data_window = Titanium.UI.createOptionDialog({
		        androidView: inputView,
		        buttonNames: ['OK'],
		        title: 'Calculator Data'
		    });

		    // Show dialog
			data_window.show();
	    } else {
	        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}


$.index.open();
