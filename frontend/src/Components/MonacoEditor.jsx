import Editor from "@monaco-editor/react";
const MonacoEditor = ({ code, setCode, language, height }) => {

  const options = {
    minimap: { enabled: false },
    fontSize: 16,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 4,
  };

  return (
    <Editor
      height={!(height=="full")? "100%":"calc(100vh - 100px)"}
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={options}
    />
  );
};

export default MonacoEditor;