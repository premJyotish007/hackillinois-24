import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorWindow = ({ language, code, theme, onChange }) => {
  const [value, setValue] = useState(code || '');

  useEffect(() => {
    setValue(code || '');
  }, [code]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || 'python'}
        value={value}
        theme={theme}
        defaultValue="# Enter code here!"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
