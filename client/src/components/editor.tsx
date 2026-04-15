import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

export default function CodeEditor({ code, setCode }: Props) {
  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  );
}