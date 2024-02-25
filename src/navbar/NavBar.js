import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import './Navbar.css';

export default function NavBar({classInfo, setClassInfo, functionInfo, setFunctionInfo}) {
    const [className, setClassName] = useState('');
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isFunctionDropdownOpen, setIsFunctionDropdownOpen] = useState(false);
    const [parentClass, setParentClass] = React.useState('');
    const [classes, setClasses] = React.useState([]);
    const [functions, setFunctions] = React.useState([]);
    const [functionName, setFunctionName] = useState('');
    const [functionArguments, setFunctionArguments] = useState('');
    const [functionClass, setFunctionClass] = useState('');
    const [isMemberFunction, setIsMemberFunction] = useState(false);
    const [isConstructor, setIsConstructor] = useState(false);
    const handleSyncClassChanges = () => {
        // Pass the information to the parent component
        // You can use props or context to pass the information to the parent component
        var to_set = [...classInfo, {name: className, parent: parentClass, functions: []}];
        setClasses(to_set);
        setClassInfo(to_set);
        setIsClassDropdownOpen(false);
    };
    
    const handleSyncFunctionChanges = () => {
        // Pass the information to the parent component
        // You can use props or context to pass the information to the parent component

        var fun_args = functionArguments.split(",").map(arg => arg.trim());
        var to_set = [...functionInfo, {name: functionName, arguments: fun_args, class: functionClass, member: isMemberFunction, body: ""}];
        setFunctions(to_set);
        setFunctionInfo(to_set);
        // append this function to a list of functions in the class if its a class function
        console.log(functionClass);
        if (functionClass) {
            var new_classes = classInfo;
            for (var i = 0; i < new_classes.length; i++) {
                if (new_classes[i].name === functionClass) {
                    new_classes[i].functions.push({name: functionName});
                    break;
                }
            }
            setClasses(new_classes);
            setClassInfo(new_classes);

        }

        setIsFunctionDropdownOpen(false);
    };

    const handleParentClassChange = (event) => {
        const value = event.target.value;
        setParentClass(value === "" ? "None" : value);
    }
    
    const handleFunctionClassChange = (event) => {
        const value = event.target.value;
        setFunctionClass(value === "" ? "None" : value);
    }
    


    const handleClassMenuItemClick = () => {
        if (isFunctionDropdownOpen)
            setIsFunctionDropdownOpen(false);
        setIsClassDropdownOpen(!isClassDropdownOpen);
    };

    const handleFunctionMenuItemClick = () => {
        if (isClassDropdownOpen)
            setIsClassDropdownOpen(false);
        setIsFunctionDropdownOpen(!isFunctionDropdownOpen);
    };

    return (
        <Sidebar >
            <Menu iconShape="square">
                <MenuItem onClick={handleClassMenuItemClick} style = {{color: 'navy'}}>Create class</MenuItem>
                {isClassDropdownOpen && (
                    <div className="dropdown-content">
                        <TextField id="standard-basic" label="Class Name" variant="standard" onChange={(e) => setClassName(e.target.value)}/>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Inherits</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={parentClass}
                                onChange={handleParentClassChange}
                                label="ClassName"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {classInfo.map((className, index) => (
                                    <MenuItem key={index} value={className.name}>{className.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleSyncClassChanges}>Sync Changes</Button>
                    </div>

                )}
                <MenuItem onClick={handleFunctionMenuItemClick} style = {{color: 'navy'}}>Define function</MenuItem>
                {isFunctionDropdownOpen && (
                    <div className="dropdown-content">
                    <TextField id="function-name" label="Function Name" variant="standard" value={functionName} onChange={(e) => setFunctionName(e.target.value)} />
                    <TextField id="function-arguments" label="Comma separated args" variant="standard" value={functionArguments} onChange={(e) => setFunctionArguments(e.target.value)} />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Class</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={functionClass}
                            onChange={handleFunctionClassChange}
                            label="Class"
                        >
                            <MenuItem >None</MenuItem>
                            {classInfo.map((className, index) => (
                                <MenuItem key={index} value={className.name}>{className.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {functionClass && 
                    (<>
                    <FormControlLabel
                        control={<Checkbox checked={isMemberFunction} onChange={() => setIsMemberFunction(!isMemberFunction)} />}
                        label="Member Function"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isConstructor} onChange={() => setIsConstructor(!isConstructor)} />}
                        label="Constructor"
                    />
                    </>
                    )}
                    <Button onClick={handleSyncFunctionChanges}>Sync Changes</Button>
                </div>
                
                )}
            </Menu>
        </Sidebar>
    );
}
