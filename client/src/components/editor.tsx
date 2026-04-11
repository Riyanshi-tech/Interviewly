import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

export default function CodeEditor({ code, setCode }: Props) {
  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  );
}