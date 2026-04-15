import { useEffect, useState, useRef, useCallback } from "react";
import CodeEditor from "../components/editor";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Room() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const roomId = "test-room";
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  }, [roomId]);

  useEffect(() => {
    peerRef.current = createPeerConnection();

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        mediaStream.getTracks().forEach((track) => {
          peerRef.current?.addTrack(track, mediaStream);
        });
      });

    socket.emit("join-room", roomId);

    socket.on("user-joined", async () => {
      const offer = await peerRef.current?.createOffer();
      if (offer) {
        await peerRef.current?.setLocalDescription(offer);
        socket.emit("offer", { offer, roomId });
      }
    });

    socket.on("offer", async ({ offer }) => {
      await peerRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current?.createAnswer();
      if (answer) {
        await peerRef.current?.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId });
      }
    });

    socket.on("answer", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("code-update");
      peerRef.current?.close();
    };
  }, [createPeerConnection, roomId]);

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
    <div style={{ color: "white", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Live Coding Room</h1>

      <div style={{ display: "flex", gap: "20px", width: "100%", height: "calc(100vh - 250px)" }}>
        <div style={{ flex: 1, minWidth: "0", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, borderRadius: "10px", overflow: "hidden", border: "1px solid #334155" }}>
            <CodeEditor code={code} setCode={handleCodeChange} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={runCode}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
            >
              Run Code
            </button>
          </div>
        </div>

        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", borderRadius: "12px", backgroundColor: "#1e293b", border: "2px solid #334155" }}
            />
            <span style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>You</span>
          </div>
          <div style={{ position: "relative" }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", borderRadius: "12px", backgroundColor: "#1e293b", border: "2px solid #334155" }}
            />
            <span style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>Peer</span>
          </div>
        </div>
      </div>

      {output && (
        <div
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#1e293b",
            color: "#e2e8f0",
            borderRadius: "12px",
            border: "1px solid #334155",
            maxHeight: "200px",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#94a3b8" }}>Output:</h3>
          <pre style={{ margin: 0, fontFamily: "monospace", color: "#f8fafc" }}>{output}</pre>
        </div>
      )}
    </div>
  );
}

