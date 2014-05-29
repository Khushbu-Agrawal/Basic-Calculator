function Controller() {
    function validateOperands() {
        if ("" == $.txtField1.value || "" == $.txtField2.value) {
            alert("Enter both the operands");
            return false;
        }
        return true;
    }
    function validateResult() {
        if ("" == $.txtResult.value) {
            alert("Error: Please perform some operation first !");
            return false;
        }
        return true;
    }
    function onAddClick() {
        if (!validateOperands()) return;
        $.txtResult.value = parseInt($.txtField1.value) + parseInt($.txtField2.value);
        lastOperand = "ADD";
    }
    function onSubstractClick() {
        if (!validateOperands()) return;
        $.txtResult.value = parseInt($.txtField1.value) - parseInt($.txtField2.value);
        lastOperand = "SUB";
    }
    function onMultiplyClick() {
        if (!validateOperands()) return;
        $.txtResult.value = parseInt($.txtField1.value) * parseInt($.txtField2.value);
        lastOperand = "MUL";
    }
    function onDivisionClick() {
        if (!validateOperands()) return;
        var input2 = parseInt($.txtField2.value);
        if (0 == input2) $.txtResult.value = "Error: Divide by Zero !!!"; else {
            $.txtResult.value = parseInt($.txtField1.value) / input2;
            lastOperand = "DIV";
        }
    }
    function onSaveClick() {
        if (!validateOperands()) return;
        if (!validateResult()) return;
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
        if (!Cloud.sessionId) {
            alert("Please loging first");
            return;
        }
        saveToACS();
    }
    function onLoginClick() {
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
        if (!Cloud.sessionId) {
            Ti.API.info("Setting Cloud.sessionId ... ");
            Cloud.sessionId = "3vXCiZ1hqdlgBxnVZ1dDkd1Z8Os";
            Ti.API.info("Cloud.sessionId = " + Cloud.sessionId);
            Cloud.Users.login({
                login: "khushbu.agrawal1@gmail.com",
                password: "pass123"
            }, function(e) {
                if (e.success) {
                    var user = e.users[0];
                    Ti.API.info("Success:\nid: " + user.id + "\n" + "sessionId: " + Cloud.sessionId + "\n" + "first name: " + user.first_name + "\n" + "last name: " + user.last_name);
                } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
            });
        }
    }
    function saveToACS() {
        Ti.API.info("Saving data to Cloud ...");
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        var inputView = Titanium.UI.createView({
            backgroundColor: "#111"
        });
        var locField = Titanium.UI.createTextField({
            hintText: "Enter Name",
            height: 35,
            width: 250,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        });
        inputView.add(locField);
        var dialog = Titanium.UI.createOptionDialog({
            androidView: inputView,
            buttonNames: [ "OK" ],
            title: "Save to ACS"
        });
        dialog.show();
        dialog.addEventListener("click", function(e) {
            Titanium.API.info("Dialog Click : " + JSON.stringify(e));
            if (true == e.button && 0 == e.index) {
                Ti.API.info("Operand while saving data = " + lastOperand);
                Ti.API.info("Save to ACS name: " + locField.value);
                if ("" == locField.value) {
                    alert("Error: Name is empty !");
                    return;
                }
                Cloud.Objects.create({
                    classname: "Calculator",
                    fields: {
                        operand1: $.txtField1.value,
                        operand2: $.txtField2.value,
                        operator: lastOperand,
                        result: $.txtResult.value,
                        name: locField.value
                    }
                }, function(e) {
                    if (e.success) {
                        var calculator = e.Calculator[0];
                        Ti.API.info("Success:\noperand1: " + calculator.operand1 + "\n" + "operand2: " + calculator.operand2 + "\n" + "operator: " + calculator.operator + "\n" + "result: " + calculator.result + "\n" + "name: " + calculator.name);
                    } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
                });
            }
        });
    }
    function onRetriveClick() {
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        Cloud.Objects.query({
            classname: "Calculator",
            page: 1,
            per_page: 100
        }, function(e) {
            if (e.success) {
                Ti.API.info("Success: \nCount: " + e.Calculator.length);
                var row;
                var displayData = [];
                for (var i = 0; e.Calculator.length > i; i++) {
                    var calculator = e.Calculator[i];
                    Ti.API.info("id: " + calculator.id + "\n" + "operand1: " + calculator.operand1 + "\n" + "operand2: " + calculator.operand1 + "\n" + "operator: " + calculator.operator + "\n" + "result: " + calculator.result + "\n" + "name: " + calculator.name);
                    row = Ti.UI.createTableViewRow({
                        height: 35,
                        backgroundColor: "black",
                        font: {
                            fontSize: 20
                        },
                        title: "Calculator_Data"
                    });
                    operand1Label = Ti.UI.createLabel({
                        text: calculator.operand1,
                        font: {
                            fontSize: 20
                        },
                        color: "white",
                        left: 5,
                        width: Ti.UI.FILL
                    });
                    row.add(operand1Label);
                    operatorLabel = Ti.UI.createLabel({
                        text: calculator.operator,
                        font: {
                            fontSize: 20
                        },
                        color: "white",
                        left: 50,
                        width: Ti.UI.FILL
                    });
                    row.add(operatorLabel);
                    operand2Label = Ti.UI.createLabel({
                        text: calculator.operand2,
                        font: {
                            fontSize: 20
                        },
                        color: "white",
                        left: 100,
                        width: Ti.UI.FILL
                    });
                    row.add(operand2Label);
                    resultLabel = Ti.UI.createLabel({
                        text: calculator.result,
                        font: {
                            fontSize: 20
                        },
                        color: "white",
                        left: 150,
                        width: Ti.UI.FILL
                    });
                    row.add(resultLabel);
                    nameLabel = Ti.UI.createLabel({
                        text: calculator.name,
                        font: {
                            fontSize: 20
                        },
                        color: "white",
                        left: 200,
                        width: Ti.UI.FILL
                    });
                    row.add(nameLabel);
                    displayData.push(row);
                }
                var tableView = Ti.UI.createTableView({
                    scrollable: true,
                    width: "100%",
                    height: "100%",
                    minRowHeight: "25"
                });
                tableView.setData(displayData);
                var inputView = Titanium.UI.createView({
                    backgroundColor: "black",
                    width: "100%",
                    height: "100%"
                });
                inputView.add(tableView);
                var data_window = Titanium.UI.createOptionDialog({
                    androidView: inputView,
                    buttonNames: [ "OK" ],
                    title: "Calculator Data"
                });
                data_window.show();
            } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        title: "Calculator",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.lblInput1 = Ti.UI.createLabel({
        id: "lblInput1",
        text: "Input 1",
        top: "30",
        left: "10",
        width: "60",
        height: "35",
        textAlign: "left"
    });
    $.__views.index.add($.__views.lblInput1);
    $.__views.txtField1 = Ti.UI.createTextField({
        id: "txtField1",
        top: "20",
        left: "80",
        width: "100",
        height: "35",
        color: "#336699",
        textAlign: "left",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DONE
    });
    $.__views.index.add($.__views.txtField1);
    $.__views.lblInput2 = Ti.UI.createLabel({
        id: "lblInput2",
        text: "Input 2",
        top: "70",
        left: "10",
        width: "60",
        height: "35",
        textAlign: "left"
    });
    $.__views.index.add($.__views.lblInput2);
    $.__views.txtField2 = Ti.UI.createTextField({
        id: "txtField2",
        top: "60",
        left: "80",
        width: "100",
        height: "35",
        color: "#336699",
        textAlign: "left",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DONE
    });
    $.__views.index.add($.__views.txtField2);
    $.__views.lblResult = Ti.UI.createLabel({
        id: "lblResult",
        text: "Result",
        top: "110",
        left: "10",
        width: "60",
        height: "35",
        textAlign: "left"
    });
    $.__views.index.add($.__views.lblResult);
    $.__views.txtResult = Ti.UI.createTextField({
        id: "txtResult",
        top: "100",
        left: "80",
        width: "100",
        height: "35",
        color: "#336699",
        textAlign: "left"
    });
    $.__views.index.add($.__views.txtResult);
    $.__views.btnAdd = Ti.UI.createButton({
        id: "btnAdd",
        title: "ADD",
        top: "160",
        left: "20",
        width: "65",
        height: "40"
    });
    $.__views.index.add($.__views.btnAdd);
    onAddClick ? $.__views.btnAdd.addEventListener("click", onAddClick) : __defers["$.__views.btnAdd!click!onAddClick"] = true;
    $.__views.btnSub = Ti.UI.createButton({
        id: "btnSub",
        title: "SUB",
        top: "160",
        left: "100",
        width: "65",
        height: "40"
    });
    $.__views.index.add($.__views.btnSub);
    onSubstractClick ? $.__views.btnSub.addEventListener("click", onSubstractClick) : __defers["$.__views.btnSub!click!onSubstractClick"] = true;
    $.__views.btnMul = Ti.UI.createButton({
        id: "btnMul",
        title: "MUL",
        top: "160",
        left: "180",
        width: "65",
        height: "40"
    });
    $.__views.index.add($.__views.btnMul);
    onMultiplyClick ? $.__views.btnMul.addEventListener("click", onMultiplyClick) : __defers["$.__views.btnMul!click!onMultiplyClick"] = true;
    $.__views.btnDiv = Ti.UI.createButton({
        id: "btnDiv",
        title: "DIV",
        top: "160",
        left: "260",
        width: "65",
        height: "40"
    });
    $.__views.index.add($.__views.btnDiv);
    onDivisionClick ? $.__views.btnDiv.addEventListener("click", onDivisionClick) : __defers["$.__views.btnDiv!click!onDivisionClick"] = true;
    $.__views.btnLogin = Ti.UI.createButton({
        id: "btnLogin",
        title: "Login",
        top: "220",
        left: "20",
        width: "80",
        height: "40"
    });
    $.__views.index.add($.__views.btnLogin);
    onLoginClick ? $.__views.btnLogin.addEventListener("click", onLoginClick) : __defers["$.__views.btnLogin!click!onLoginClick"] = true;
    $.__views.btnSaveACS = Ti.UI.createButton({
        id: "btnSaveACS",
        title: "Save",
        top: "220",
        left: "110",
        width: "80",
        height: "40"
    });
    $.__views.index.add($.__views.btnSaveACS);
    onSaveClick ? $.__views.btnSaveACS.addEventListener("click", onSaveClick) : __defers["$.__views.btnSaveACS!click!onSaveClick"] = true;
    $.__views.btnACSRetrieve = Ti.UI.createButton({
        id: "btnACSRetrieve",
        title: "Retrieve",
        top: "220",
        left: "200",
        width: "100",
        height: "40"
    });
    $.__views.index.add($.__views.btnACSRetrieve);
    onRetriveClick ? $.__views.btnACSRetrieve.addEventListener("click", onRetriveClick) : __defers["$.__views.btnACSRetrieve!click!onRetriveClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var lastOperand = "";
    $.index.open();
    __defers["$.__views.btnAdd!click!onAddClick"] && $.__views.btnAdd.addEventListener("click", onAddClick);
    __defers["$.__views.btnSub!click!onSubstractClick"] && $.__views.btnSub.addEventListener("click", onSubstractClick);
    __defers["$.__views.btnMul!click!onMultiplyClick"] && $.__views.btnMul.addEventListener("click", onMultiplyClick);
    __defers["$.__views.btnDiv!click!onDivisionClick"] && $.__views.btnDiv.addEventListener("click", onDivisionClick);
    __defers["$.__views.btnLogin!click!onLoginClick"] && $.__views.btnLogin.addEventListener("click", onLoginClick);
    __defers["$.__views.btnSaveACS!click!onSaveClick"] && $.__views.btnSaveACS.addEventListener("click", onSaveClick);
    __defers["$.__views.btnACSRetrieve!click!onRetriveClick"] && $.__views.btnACSRetrieve.addEventListener("click", onRetriveClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;