import React, { useState } from 'react';
import CodeEditorWindow from './CodeEditor';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavBar from './navbar/NavBar';
import TextField from '@mui/material/TextField';


import './App.css';
import NestedCards from './class-diagram/Diagram';
function App() {
  const [code, setCode] = useState('# Enter code here!');
  const [classInfo, setClassInfo] = useState([]);
  const [functionInfo, setFunctionInfo] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  
  
  
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const writeCode = async () => {
    console.log('in writeCode function');

    try {
      const response = await fetch('http://localhost:8000/write-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: {classInfo: classInfo, functionInfo: functionInfo} }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      
    } catch (error) {
      console.error('Error making POST request:', error);
    }
    try {
      const response = await fetch('http://localhost:8000/unparse-code?file=input.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      console.log(data);
      setCode(data);
    } catch (error) {
      console.error('Error making GET request:', error);
    }

    // fetch('code_unparse.txt') // Assuming code.txt is in your public directory
    // .then(response => response.text())
    // .then(content => {setFileContent(content)
    //   setCode(content)})
    // .catch(error => console.error('Error reading file:', error));

    // console.log(classInfo, functionInfo);

  }


  const handleSyncClassChanges = (newClassInfo) => {
    setClassInfo(newClassInfo);
    console.log('class data')
    console.log(newClassInfo);
  }
  const handleSyncFunctionChanges = async (newFunctionInfo) => {
    setFunctionInfo(newFunctionInfo);
    console.log('function data')
    console.log(newFunctionInfo);
    
  }

  const handleRefreshClick = async () => {
    // write code to a file called code.txt without using the server
    
    try {
      const response = await fetch('http://localhost:8000/write-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      
    } catch (error) {
      console.error('Error making POST request:', error);
    }
    
    // call the server to parse the code and return the output
    try {
      const response = await fetch('http://localhost:8000/parse-code?file=code.txt');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setClassInfo(data["classes"]);
      setFunctionInfo(data["functions"]);
      console.log(data);
    } catch (error) {
      
      console.error('Error making GET request:', error);
    }

  };

  return (
    <div className="App">
      <div className="left-window">
        <NavBar setClassInfo={handleSyncClassChanges} classInfo={classInfo} setFunctionInfo={handleSyncFunctionChanges} functionInfo={functionInfo}/>
        <NestedCards classData={classInfo} setClassInfo={handleSyncClassChanges} functionInfo={functionInfo} setFunctionInfo={handleSyncFunctionChanges}/>
        <div className="Button-left">
            <Button onClick={writeCode} label="Click here to write code.">
              <RefreshIcon />
            </Button>
          </div>
        <div className="class-list">
      </div>
      </div>
      <div className="right-window">
        <div className="right-window-headers">
          <div className="Title">
            <p>Python Source Code</p>
          </div>
          <div className="Button-right">
            <Button onClick={handleRefreshClick}>
              <RefreshIcon />
            </Button>
          </div>
        </div>
        <CodeEditorWindow code={code} onChange={handleCodeChange} />
      </div>
    </div>
  );
}

export default App;