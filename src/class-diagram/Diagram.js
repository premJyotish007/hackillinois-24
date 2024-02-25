import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const ObjectDiagram = ({ classData, setClassInfo, functionInfo, setFunctionInfo }) => {
  const deleteClass = (index) => {
    const updatedClassData = [...classData];
    const name_class = updatedClassData[index].name;
    console.log('deleting class', name_class);

    updatedClassData.splice(index, 1);
    // delete all the functions in the class from the functionInfo

    const updatedFunctionInfo = [...functionInfo];
    for (var i = 0; i < updatedFunctionInfo.length; i++) {
        if (updatedFunctionInfo[i].class === name_class) {
            console.log('deleting function', updatedFunctionInfo[i].name, updatedFunctionInfo[i].class);
            updatedFunctionInfo.splice(i, 1);
        }
    }
    console.log('after deleting class');
    console.log(updatedFunctionInfo);

    setClassInfo(updatedClassData);
    setFunctionInfo(updatedFunctionInfo);
  };

  const deleteFunction = (classIndex, functionIndex) => {
    const updatedClassData = [...classData];
    const name_class = classData[classIndex].name;
    const name_function = classData[classIndex].functions[functionIndex].name;
    updatedClassData[classIndex].functions.splice(functionIndex, 1);
    // remove the function from the functionInfo
    const updatedFunctionInfo = [...functionInfo];
    console.log(name_function)
    for (var i = 0; i < updatedFunctionInfo.length; i++) {
      if (updatedFunctionInfo[i].class === name_class && updatedFunctionInfo[i].name === name_function) {
        updatedFunctionInfo.splice(i, 1);
      }
    }
    setFunctionInfo(updatedFunctionInfo);
    setClassInfo(updatedClassData);
  };

  return (
    <div>
      {classData.map((classItem, classIndex) => (
        <Card key={classIndex} style={{ margin: '4px', padding: '4px', backgroundColor: '#e0e0e0', position: 'relative', resize:'both' }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {classItem.name}
            {/*nest the function cards inside */}
            {classItem.functions.map((functionItem, functionIndex) => (
              <Card key={functionIndex} style={{ margin: '4px', padding: '4px', backgroundColor: '#f0f0f0', position: 'relative'}}>
                <CardContent>
                  <Typography variant="body1" component="div">
                    {functionItem.name}
                  </Typography>
                </CardContent>
                <IconButton
                  style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '12px' }}
                  onClick={() => deleteFunction(classIndex, functionIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
            </Typography>
          </CardContent>
          {/* Add the trash can icon */}
          <IconButton
            style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '12px' }}
            onClick={() => deleteClass(classIndex)}
          >
            <DeleteIcon />
          </IconButton>
          {/* Add the nested card for the parent class */}
          {classItem.parent && (
            <Card style={{ margin: '4px', padding: '4px', backgroundColor: '#f0f0f0', position: 'relative' }}>
              <CardContent>
                <Typography variant="body1" component="div">
                  {classItem.parent}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ObjectDiagram;
