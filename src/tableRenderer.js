import React from 'react';
import './tableRenderer.css'


export default class TableRenderer extends React.Component{ 
    constructor(props){
        super(props);
        this.state={
            users:[],
            orgUsers:[],
            newItem:{
                name:"",
                address:{city:""},
                phone:""
            }
        }
    }
    componentDidMount=()=>{
        console.log("componentDidMount from TableRenderer");
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json)=>{
                console.log("MEGALA==>componentDidMount", json);
                if(!Array.isArray(json)){
                    this.setState({users:[this.updateStateValues(json)],orgUsers:[this.updateStateValues(json)]});
                }else{
                    this.setState({users:this.updateStateValues(json),orgUsers:this.updateStateValues(json)});
                }                
            });
    }
    updateempRecords=(event)=>{
        console.log("Am Entered!!!");
       var myUsers = this.state.users;
       var index=event.target.attributes["data-index"].nodeValue;
       var parentObj=event.target.attributes["data-parentobj"];
       var user = myUsers[index];
       var name=event.target.name;
       if(parentObj !== undefined){
            parentObj = parentObj.nodeValue;
            user[parentObj][name] = event.target.value;
       }else{
            user[name] = event.target.value;
       }        
       console.log("MEGALA========>B4Update:",this.state.users);
        this.setState({users:myUsers});
    }
    changesUpdatedCheck(event){
        var tbody=event.target.parentElement.parentElement.parentElement;
        var saveBtnLen = tbody.getElementsByClassName("saveButtonAlive").length;
        if(saveBtnLen > 0){
            alert("Please Save/Cancel the highlighted record")
            return false;
        }
        return true;
    }
    editCurrentRecord=(event)=>{
        if(this.changesUpdatedCheck(event)){   
            var curItem = event.target;
            curItem.setAttribute("class","hideButton");
            curItem.nextElementSibling.setAttribute("class","hideButton");
            curItem.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.setAttribute("class","saveButtonAlive");
            this.changeInputEdit(curItem,false);
        }
    }
    deleteCurrentRecord=(event)=>{
        if(this.changesUpdatedCheck(event)){   
            var name=event.target.parentElement.parentElement.getAttribute("name");
            var id=event.target.attributes["data-id"].nodeValue;
            var index=event.target.attributes["data-index"].nodeValue;
            var users = this.state.users;
            var newArr=[];
            for(var user in users){
                if(index !== user){
                    newArr[newArr.length] = this.updateStateValues(users[user]);
                }
            }
            var url="https://jsonplaceholder.typicode.com/users/"+id;
            if(window.confirm("Are you sure to delete '"+name+"' Record?")){
                fetch(url, {
                    method: 'DELETE',
                })
                .then(()=>{
                    var newArr2 = this.updateStateValues(newArr);
                    this.setState({users:newArr,orgUsers:newArr2});
                    console.log("Deleted Successfully!!!");
                });
            }
        }
    }
    updateStateValues(users){
        if (users === null || typeof users !== 'object') {
            return users;
        }
        var storage = users.constructor(); 
        for (var key in users) {
           storage[key] = this.updateStateValues(users[key]);
        }
        return storage;
    }
    changeInputEdit(curItem,setAttr){
        var inputEle = curItem.parentElement.parentElement.getElementsByClassName("nonEditable");
        var len=inputEle.length;
        for(var i=0;i<len;i++){
            if(setAttr){
                inputEle[i].setAttribute("readonly",true);
                inputEle[i].removeAttribute("style");
            }else{
                inputEle[i].removeAttribute("readonly");
                inputEle[i].setAttribute("style","border:2px solid black !important")
            }           
        }
    }
    cancelCurrentUpdate=(event)=>{
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.previousElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.previousElementSibling.removeAttribute("class");
        var users = this.state.orgUsers;
        console.log("MEGALA===>orgUsers",users);
        var newArr = this.updateStateValues(users);
        var newArr2 = this.updateStateValues(users);
        console.log("MEGALA===>newArr",newArr);
        this.setState({users:newArr,orgUsers:newArr2});
        this.changeInputEdit(curItem,true);
    }
    saveCurrentRecord=(event)=>{
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.nextElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        var id=curItem.attributes["data-id"].nodeValue;
        var index=curItem.attributes["data-index"].nodeValue;
        var users = this.state.users;
        var user = users[index];
        var newArr = this.updateStateValues(users);
        var url="https://jsonplaceholder.typicode.com/users/"+id;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => 
        {
            console.log("Changes Updated!!!",json);
            this.setState({orgUsers:newArr});
            this.changeInputEdit(curItem,true);
            alert("Changes Updated!!!");
        });
        
    }
    onChangeNewItem=(event)=>{
        var itemObj = this.state.newItem;
        itemObj = this.updateStateValues(itemObj);
        if(event.target.name === "city"){
            itemObj["address"][event.target.name] = event.target.value;
        }else{
            itemObj[event.target.name] = event.target.value;
        }        
        this.setState({
            newItem : itemObj
        });
    }
    createNewItem=(event)=>{
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
    }
    saveNewItem=(event)=>{
        if(this.state.newItem.name === "" || this.state.newItem.address.city === "" || this.state.newItem.phone === ""){
            alert("Please fill all input box");
            return false;
        }
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");

        curTarget.nextElementSibling.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.nextElementSibling.childNodes[0];
        this.clearAllInpBox(dv);
        var itemObj = this.state.newItem;
        var newObject = this.updateStateValues(itemObj);
        var idLen=this.state.orgUsers.length;
        newObject["id"] = parseInt(this.state.orgUsers[idLen-1].id,10)+1;
        var url="https://jsonplaceholder.typicode.com/users";
        fetch(url,{
            method:"POST",
            body: JSON.stringify(newObject),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => 
        {
            console.log("New Item Added!!!",json);
            var myusers = this.state.users;
            var myorgUsers = this.state.orgUsers;
            var newObject2 = this.updateStateValues(newObject);
            myusers[myusers.length] = newObject;
            myorgUsers[myorgUsers.length] = newObject2;
            var newArray = {
                name:"",
                address:{city:""},
                phone:""
            };
            this.setState({users:myusers,orgUsers:myorgUsers,newArr:newArray});
            alert("New Item Added!!!");
        });
    }
    clearAllInpBox(dv){
        var htmlColl = dv.children;
        var len = dv.childElementCount;
        for(var i=0;i<len;i++){
            htmlColl[i].value="";
        }
    }
    cancelNewItem=(event)=>{
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.childNodes[0];
        this.clearAllInpBox(dv);
        var newArray = {
            name:"",
            address:{city:""},
            phone:""
        };
        this.setState({newArr:newArray});
    }
    render(){
        console.log("MEGALA==> render() from TableRenderer ",this.state);
        return (<React.Fragment>
            <div className="pageHeader">Employee Records</div><br></br>
            <div id="addNewItem" >
                <input id="btn_newItem" type="button" value="NewItem" onClick={this.createNewItem} />
                <input id="btn_saveItem" type="button" className="hideBtn" value="Save" onClick={this.saveNewItem} />
                <input id="btn_cancelItem" type="button" className="hideBtn" value="Cancel" onClick={this.cancelNewItem} />
                <div id="newItemInputSet" className="hideBtn"  >
                    <div id="innerDiv" >
                    <input type="text" placeholder="Enter Name" name="name" maxLength="25" onChange={this.onChangeNewItem} />
                    <input type="text" placeholder="Enter Address" name="city" maxLength="50" onChange={this.onChangeNewItem} />
                    <input type="text" placeholder="Enter Phone Number" name="phone" maxLength="30" onChange={this.onChangeNewItem} />
                    </div>
                </div>
            </div><br></br>
        <div style={{marginLeft:'23%'}}>

            <table border="1">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Phone Number</th>
                    <th>Edit / Delete Record</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.users.map((user,index)=>{ return (  
                    <tr name={user.name} key={index} >
                        <td className="identityNumber" ><input type="text" readOnly={true} style={{border:'0px'}} name="id" value={user.id} /></td>
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.name} name="name" onChange={this.updateempRecords} /></td>
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} data-parentobj="address" value={user.address.city} name="city" onChange={this.updateempRecords}  /></td>
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.phone} name="phone" onChange={this.updateempRecords} /></td>
                        <td><input type="button" value="Edit" onClick={this.editCurrentRecord} />
                        <input type="button" value="Delete" data-id={user.id} data-index={index} onClick={this.deleteCurrentRecord} />
                        <input type="button" className="hideButton" value="Save" data-id={user.id} data-index={index} onClick={this.saveCurrentRecord} />
                        <input type="button" className="hideButton" value="Cancel" data-id={user.id} data-index={index} onClick={this.cancelCurrentUpdate} /></td>
                    </tr>)
                    })
                }
                </tbody>
            </table>
        </div></React.Fragment>);
    }
}