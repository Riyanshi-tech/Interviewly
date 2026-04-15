import { useEffect, useState } from "react";
import CodeEditor from "../components/editor";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Room() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const roomId = "test-room"; 
  useEffect(() => {
    socket.emit("join-room", roomId);
  }, []);
  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);
  const handleCodeChange = (value: string) => {
    setCode(value);

    socket.emit("code-change", {
      roomId,
      code: value,
    });
  };
  const runCode = async () => {
  const res = await fetch("http://localhost:5000/api/code/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();
  setOutput(data.stdout || data.stderr);
};

  return (
    <div>
      <h1>Live Coding Room </h1>

      <CodeEditor code={code} setCode={handleCodeChange} />
      <div style={{ marginTop: "20px" }}>
        <button onClick={runCode}>Run Code</button>
      </div>

      {output && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#1e1e1e", color: "#d4d4d4", borderRadius: "5px" }}>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}