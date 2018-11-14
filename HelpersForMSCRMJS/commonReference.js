// JavaScript source code
var debugMode = true;

function fnGetFiscalYear() {
    var dt = new Date();
    var fy = dt.getFullYear(), month = dt.getMonth() + 1;
    if (month > 6) {
        fy += 1;
    }
    return fy;
}

function fnGetODataServiceUrl() {
    return Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc/';
}

function fnRetrieveSingleRecord(query) {
    if (debugMode) {
        console.log('Using ODATA for data retrieval (single record)', query);
    }
    var clientUrl = fnGetODataServiceUrl();
    var req = new XMLHttpRequest();
    var results = null;
    req.open("GET", clientUrl + query, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.send(null);
    if (debugMode) {
        console.log('Response', req.responseText);
    }
    var returned = JSON.parse(req.responseText);
    if (debugMode) {
        console.log('Parsed JSON', returned);
    }
    if (fnIsDefined(returned) && fnIsDefined(returned.d)) {
        return returned.d;
    }
    return null;
}

function fnRetrieveRecords(query) {
    if (debugMode) {
        console.log('Using ODATA for data retrieval', query);
    }
    var clientUrl = fnGetODataServiceUrl();
    var req = new XMLHttpRequest();
    var results = null;
    req.open("GET", clientUrl + query, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.send(null);
    if (debugMode) {
        console.log('Response', req.responseText);
    }
    var returned = JSON.parse(req.responseText);
    if (debugMode) {
        console.log('Parsed JSON', returned);
    }
    if (fnIsDefined(returned) && fnIsDefined(returned.d) && fnIsDefined(returned.d.results)) {
        return returned.d.results;
    }
    return null;
}

function fnGetAPIServiceUrl() {
    return Xrm.Page.context.getClientUrl() + '/api/data/v8.2/';
}

function fnRetrieveRecordsWithFetchXml(entitySetName, fetch) {
    if (debugMode) {
        console.log('Using FetchXML for data retrieval', fetch);
    }
    fetch = escape(fetch);
    var req = new XMLHttpRequest();
    var results = null;
    req.open("GET", fnGetAPIServiceUrl() + entitySetName + "?fetchXml=" + fetch, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; odata.metadata=minimal");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.send(null);
    if (debugMode) {
        console.log('Response', req.responseText);
    }
    results = JSON.parse(req.responseText).value;
    if (debugMode) {
        console.log('Parsed JSON', results);
    }
    return results;
}

function fnUpdateRecord(entitySetName, id, object) {
    if (debugMode) {
        console.log('Using API for update', entitySetName, id, object);
    }
    var req = new XMLHttpRequest();
    var results = null;
    req.open("PATCH", fnGetAPIServiceUrl() + entitySetName + '(' + id + ')', false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; odata.metadata=minimal");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.send(JSON.stringify(object));
    if (debugMode) {
        console.log('Response', req.responseText);
    }
    if (req.status === 204) {
        if (debugMode) {
            console.log('Updated record for ' + entitySetName + ', id[' + id + ']');
        }
    } else {
        console.log('Failed to update record for ' + entitySetName + ', id[' + id + ']', object);
        if (debugMode) {
            console.log(req.responseText);
        }
    }
}

function fnGetAttributeValue(attributeName) {
    var attributeValue = null;
    if (fnIsDefined(attributeName)) {
        var object = Xrm.Page.getAttribute(attributeName);
        if (fnIsDefined(object)) {
            attributeValue = object.getValue();
        }
    }
    return attributeValue;
}

function fnSetAttributeValue(attributeName, attributeValue) {
    if (fnIsDefined(attributeName)) {
        var object = Xrm.Page.getAttribute(attributeName);
        if (fnIsDefined(object)) {
            attributeValue = object.setValue(attributeValue);
        }
    }
}

function fnGetLookupAttribute(attributeName) {
    var lookupObject = fnGetAttributeValue(attributeName);
    if (fnIsDefinedArray(lookupObject, 1)) {
        if (debugMode) {
            console.log('Lookup is', lookupObject[0]);
        }
        return lookupObject[0];
    }
    return null;
}

function fnGetLookupAttributeId(attributeName) {
    var id = null;
    var lookupObject = fnGetAttributeValue(attributeName);
    if (fnIsDefinedArray(lookupObject, 1)) {
        if (debugMode) {
            console.log('Lookup is', lookupObject[0]);
        }
        id = lookupObject[0].id;
    }
    return id;
}

function fnGetLookupAttributeName(attributeName) {
    var name = null;
    var lookupObject = fnGetAttributeValue(attributeName);
    if (fnIsDefinedArray(lookupObject, 1)) {
        if (debugMode) {
            console.log('Lookup is', lookupObject[0]);
        }
        name = lookupObject[0].name;
    }
    return name;
}

function fnSetLookupAttributeDetails(attributeName, detailsObject, forceReset) {
    var lookupObject = fnGetAttributeValue(attributeName);
    forceReset = ((forceReset === undefined) || (forceReset === null) || (forceReset === false)) ? false : true;
    if (!fnIsDefined(lookupObject) || (forceReset && fnIsDefined(lookupObject))) {
        var lookupData = new Array();
        lookupData[0] = detailsObject;
        fnSetAttributeValue(attributeName, lookupData);
    }
}

function fnDefaultToday(attributeName) {
    if (fnIsDefined(attributeName)) {
        var dateObject = Xrm.Page.getAttribute(attributeName);
        if (fnIsDefined(dateObject)) {
            dateObject.setValue(new Date());
        }
    }
}

function fnGetCurrentUserId() {
    return Xrm.Page.context.getUserId();
}

function fnGetCurrentUsername() {
    return Xrm.Page.context.getUserName();
}

function fnDefaultCurrentUser(attributeName) {
    if (fnIsDefined(attributeName)) {
        var userObject = Xrm.Page.getAttribute(attributeName);
        if (fnIsDefined(userObject)) {
            userObject.setValue(fnGetCurrentUserId());
        }
    }
}

function fnDefaultCurrentUserLookup(attributeName) {
    var detailsObject = {};
    detailsObject.id = fnGetCurrentUserId();
    detailsObject.entityType = 'systemuser';
    detailsObject.name = fnGetCurrentUsername();
    fnSetLookupAttributeDetails(attributeName, detailsObject);
}

function fnPadLeft(text, padWith, padLength) {
    var paddedText = text;
    if (fnIsDefined(text) && (text.length > 0)) {
        if (fnIsDefined(padWith) && (padWith.length === 1)) {
            if (fnIsDefined(padLength) && (padLength > text.length)) {
                for (var ctr = 0; ctr < padLength - text.length; ctr++) {
                    paddedText = '0' + paddedText;
                }
            }
        }
    }
    return paddedText;
}

function fnIsDefined(object) {
    return ((object !== undefined) && (object !== null));
}

function fnIsDefinedArray(object, length) {
    if (fnIsDefined(object)) {
        if (fnIsDefined(length) && !isNaN(length)) {
            return (fnIsDefined(object.length) && (parseInt(object.length) === parseInt(length)));
        } else {
            return fnIsDefined(object.length);
        }
    }
    return false;
}

function fnIsCreateForm() {
    return Xrm.Page.ui.getFormType() === 1;
}

function fnGenerateRequestNumber(recordType) {
    // Allow only predefined types.
    if (!fnIsDefined(recordType)) return;
    if ((recordType !== 'PROMOREQ') && (recordType !== 'XFERREQ')) return;

    if (debugMode) {
        console.log('Generating request number for ', recordType);
    }
    var ctr = 1, requestNo = 'TBD', dt = new Date();
    var fy = fnGetFiscalYear(), month = dt.getMonth() + 1;
    var query = '', padLength = 5;
    switch (recordType) {
        case 'PROMOREQ':
            query = 'hrauto_promoreqSet?$select=hrauto_promoreqno&$orderby=hrauto_promoreqfy desc,hrauto_promoreqcounter desc&$top=1';
            break;
        case 'XFERREQ':
            query = 'hrauto_xferreqSet?$select=hrauto_xferreqno&$orderby=hrauto_xferreqfy desc,hrauto_xferreqcounter desc&$top=1';
            break;
    }
    var lastRequestNos = fnRetrieveRecords(query);
    if (debugMode) {
        console.log('Last request number', lastRequestNos);
    }
    if (fnIsDefinedArray(lastRequestNos, 1)) {
        var lastRequestNo = '', lastRequestCtr = 0;
        switch (recordType) {
            case 'PROMOREQ': lastRequestNo = lastRequestNos[0].hrauto_promoreqno; break;
            case 'XFERREQ': lastRequestNo = lastRequestNos[0].hrauto_xferreqno; break;
        }
        lastRequestCtr = parseInt(lastRequestNo.slice(4));
        var lastRequestFY = parseInt(lastRequestNo.slice(0, 4));
        if (debugMode) {
            console.log(lastRequestNo, lastRequestFY, lastRequestCtr);
        }
        if (lastRequestFY === fy) {
            // same fiscal year as last request, just increment counter
            requestNo = lastRequestFY.toString() + fnPadLeft((lastRequestCtr + 1).toString(), '0', padLength);
        } else {
            // not the same fiscal year, create new request number for fiscal year
            requestNo = fy.toString() + fnPadLeft((1).toString(), '0', padLength);
        }
    } else {
        // first request for the fiscal year
        requestNo = fy.toString() + fnPadLeft((1).toString(), '0', padLength);
    }
    if (debugMode) {
        console.log('New request number for', recordType, requestNo);
    }
    return requestNo;
}

function fnGetQuickCreateParentEntity(parentEntityName) {
    var parentEntity = null;
    for (var ctr = 0; ctr < window.top.length; ctr++) {
        if ((window.top[ctr].Xrm !== undefined) && (window.top[ctr].Xrm !== null)) {
            if ((window.top[ctr].Xrm.Page !== undefined) && (window.top[ctr].Xrm.Page !== null)) {
                if ((window.top[ctr].Xrm.Page.data !== undefined) && (window.top[ctr].Xrm.Page.data !== null)) {
                    if ((window.top[ctr].Xrm.Page.data.entity !== undefined) && (window.top[ctr].Xrm.Page.data.entity !== null)) {
                        var entityName = window.top[ctr].Xrm.Page.data.entity.getEntityName();
                        if (debugMode) {
                            console.log('top ' + ctr.toString() + ' data is ' + entityName);
                        }
                        if (entityName === parentEntityName) {
                            parentEntity = window.top[ctr].Xrm.Page;
                        }
                    }
                }
            }
        }
    }
    return parentEntity;
}

function fnGetOptionSetSelectedItem(attributeName) {
    var item = null;
    if (fnIsDefined(attributeName)) {
        item = Xrm.Page.getAttribute(attributeName).getSelectedOption();
    }
    return item;
}

function fnGetOptionSetSelectedText(attributeName) {
    var text = '';
    if (fnIsDefined(attributeName)) {
        text = Xrm.Page.getAttribute(attributeName).getText();
    }
    return text;
}

function fnSetOptionSetSelectedText(attributeName, optionText) {
    if (fnIsDefined(attributeName)) {
        var options = Xrm.Page.getAttribute(attributeName).getOptions();
        for (i = 0; i < options.length; i++) {
            if (options[i].text == optionText) {
                Xrm.Page.getAttribute(attributeName).setValue(options[i].value);
            }
        }
    }
}

function fnGetEmployeeDetails(empId) {
    var employeeDetails = null;
    if (debugMode) {
        console.log('Retrieving employee', empId);
    }
    if (empId.substring(0, 1) === '{') {
        empId = empId.substring(1, empId.length - 1);
    }
    empId = empId.toLowerCase();
    var query = 'hrauto_employeeSet(guid\'' + empId + '\')';
    employeeDetails = fnRetrieveSingleRecord(query);
    if (debugMode) {
        console.log('Employee Details', employeeDetails);
    }
    return employeeDetails;
}

function fnGetCivilServiceTitleDetails(titleId) {
    var titleDetails = null;
    if (debugMode) {
        console.log('Retrieving civil service title details', titleId);
    }
    if (titleId.substring(0, 1) === '{') {
        titleId = titleId.substring(1, titleId.length - 1).toLowerCase();
    }
    titleId = titleId.toLowerCase();
    var query = 'hrauto_cstitleSet(guid\'' + titleId + '\')';
    titleDetails = fnRetrieveSingleRecord(query);
    if (debugMode) {
        console.log('Civil Service Title Details', titleDetails);
    }
    return titleDetails;
}

function fnDisableForm() {

}

function fnToggleTabDisabled(tabName, disabled) {
    var tab = Xrm.Page.ui.tabs.get(tabName);
    if ((tab !== undefined) && (tab !== null)) {
        var sections = tab.sections.get();
        for (var i in sections) {
            var sectionName = sections[i].getName();
            fnToggleTabSectionDisabled(sectionName, disabled);
        }
    }
}

function fnToggleTabVisibility(tabName, visible) {
    var tab = Xrm.Page.ui.tabs.get(tabName);
    if ((tab !== undefined) && (tab !== null)) {
        tab.setVisible(visible);
    }
}

function fnToggleTabSectionDisabled(tabName, sectionName, disabled) {
    var controls = Xrm.Page.ui.controls.get();
    if ((controls !== undefined) && (controls !== null)) {
        for (var i in controls) {
            var ctrl = controls[i];
            var ctrlSection = ctrl.getParent().getName();
            if (ctrlSection === sectionName) {
                ctrl.setDisabled(disabled);
            }
        }
    }
}

function fnToggleTabSectionVisibility(tabName, sectionName, visible) {
    var tab = Xrm.Page.ui.tabs.get(tabName);
    if ((tab !== undefined) && (tab !== null)) {
        var section = tab.sections.get(sectionName);
        if ((section !== undefined) && (section !== null)) {
            section.setVisible(visible);
        }
    }
}

function fnToggleAttributeDisabled(attributeName, disabled) {
    var ctrl = Xrm.Page.getControl(attributeName);
    if ((ctrl !== undefined) && (ctrl !== null)) {
        ctrl.setDisabled(disabled);
    }
}

function fnToggleAttributeVisibility(attributeName, visible) {
    var ctrl = Xrm.Page.getControl(attributeName);
    if ((ctrl !== undefined) && (ctrl !== null)) {
        ctrl.setVisible(visible);
    }
}

function fnToggleAttributeRequired(attributeName, option) {
    var attribute = Xrm.Page.getAttribute(attributeName);
    if ((attribute !== undefined) && (attribute !== null)) {
        attribute.setRequiredLevel(option);
    }
}

function fnToggleAttributeSubmitMode(attributeName, option) {
    var attribute = Xrm.Page.getAttribute(attributeName);
    if ((attribute !== undefined) && (attribute !== null)) {
        attribute.setSubmitMode(option);
    }
}

function fnPreventAutoSave(context) {
    var eventArgs = context.getEventArgs();
    if (eventArgs.getSaveMode() === 70) {
        eventArgs.preventDefault();
        return false;
    }
    return true;
}

function fnGetActiveStageName() {
    var activeStage = Xrm.Page.data.process.getActiveStage();
    var activeStageName = activeStage.getName();
    return activeStageName;
}

function fnHideStageNextPrevious() {
    for (var ctr = 0; ctr < window.top.length; ctr++) {
        if ((window.top[ctr].document !== undefined) && (window.top[ctr].document !== null)) {
            var elem = window.top[ctr].document.getElementById('processActionsContainer');
            if ((elem !== undefined) && (elem !== null)) {
                elem.style.disabled = true;
            }
        }
    }
}

function fnTriggerCustomAction(entityName, entityId, actionName, data, successFunction, errorFunction) {
    if (entityId.substring(0, 1) === '{') {
        entityId = entityId.substring(1, entityId.length - 1);
    }
    var query = entityName + 's(' + entityId + ')/Microsoft.Dynamics.CRM.' + actionName;
    var req = new XMLHttpRequest();
    req.open('POST', fnGetAPIServiceUrl() + query, true);
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    req.setRequestHeader('OData-MaxVersion', '4.0');
    req.setRequestHeader('OData-Version', '4.0');
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            req.onreadystatechange = null;
            if (this.status == 204) {
                console.log(actionName + ' called successfully');
                if ((successFunction !== undefined) && (successFunction !== null)) {
                    successFunction();
                }
            } else {
                var error = JSON.parse(this.response).error;
                console.log(actionName + ' call failed');
                console.log(error.message);
                if ((errorFunction !== undefined) && (errorFunction !== null)) {
                    errorFunction();
                }
            }
        }
    };
    if ((data !== undefined) && (data !== null)) {
        req.send(JSON.stringify(data));
    } else {
        req.send();
    }
}

//Calculate Boolean Count
function fnCalculateBoolCount(Array, bool) {
    var count = 0;
    for (var i = 0; i < Array.length; i++) {
        if (Array[i] == bool)
            count++;
    }
    return count;
}

//Numbers only validation
function fnNumberOnly(attributename, digit, digit_min) {
    var res = false,
        regexp = /^\d+$/,
        input = Xrm.Page.getAttribute(attributename).getValue();
    if (input == null)
        return;
    res = regexp.test(input);

    if (fnIsDefined(digit_min)) {
        if ((input.length <= digit) && (input.length >= digit_min)) {
            res = regexp.test(input);
        }
    }
    else {
        if (fnIsDefined(digit)) {
            if (input.length != digit)
                res = false;
        }
    }
    if (!res) {
        if (!fnIsDefined(digit_min)) {
            if (fnIsDefined(digit))
                Xrm.Page.getControl(attributename).setNotification("Please enter a " + digit + "-digit number. ", "numberonly_field");
            else
                Xrm.Page.getControl(attributename).setNotification("Please enter a number. ", "numberonly_field");
        }
        else
            Xrm.Page.getControl(attributename).setNotification("Please enter a " + digit_min + " to " + digit + " digit number. ", "numberonly_field");
    }
    else {
        Xrm.Page.getControl(attributename).clearNotification("numberonly_field");
    }
}

//Alphabets only validation
function fnAlphaOnly(attributename, digit, space_bool) {
    var res = false,
        regexp = /^[a-zA-Z\s]*$/,
        input = Xrm.Page.getAttribute(attributename).getValue();

    if (input == null)
        return;

    if (fnIsDefined(space_bool)) {
        if (space_bool == false)
            regexp = /^[a-zA-Z]+$/;
    }
    res = regexp.test(input);
    if (fnIsDefined(digit)) {
        if (input.length != digit)
            res = false;
    }

    if (!res) {
        if (fnIsDefined(digit)) {
            Xrm.Page.getControl(attributename).setNotification("Please enter " + digit + "-digit letters. ", "letteronly_field");
        }
        else {
            Xrm.Page.getControl(attributename).setNotification("Please enter only letters. ", "letteronly_field");
        }
    }
    else {
        Xrm.Page.getControl(attributename).clearNotification("letteronly_field");
    }

}