import { useEffect, useState } from "react";
import "./App.css";

interface GreetingData {
  name?: string;
  greeting?: string;
  timestamp?: string;
}

function App() {
  const [greetingData, setGreetingData] = useState<GreetingData>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let rpcId = 0;
    const pendingRequests = new Map<
      number,
      { resolve: (value: any) => void; reject: (error: any) => void }
    >();

    const rpcNotify = (method: string, params?: any) => {
      window.parent.postMessage({ jsonrpc: "2.0", method, params }, "*");
    };

    const rpcRequest = (method: string, params?: any) =>
      new Promise((resolve, reject) => {
        const id = ++rpcId;
        pendingRequests.set(id, { resolve, reject });
        window.parent.postMessage(
          { jsonrpc: "2.0", id, method, params },
          "*"
        );
      });

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const message = event.data;
      if (!message || message.jsonrpc !== "2.0") return;

      // Handle responses
      if (typeof message.id === "number") {
        const pending = pendingRequests.get(message.id);
        if (!pending) return;
        pendingRequests.delete(message.id);

        if (message.error) {
          pending.reject(message.error);
          return;
        }

        pending.resolve(message.result);
        return;
      }

      // Handle notifications
      if (typeof message.method === "string") {
        if (message.method === "ui/notifications/tool-result") {
          const structuredContent = message.params?.structuredContent;
          if (structuredContent) {
            setGreetingData(structuredContent);
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Initialize the MCP Apps bridge
    const initializeBridge = async () => {
      const appInfo = { name: "greeting-widget", version: "1.0.0" };
      const appCapabilities = {};
      const protocolVersion = "2026-01-26";

      try {
        await rpcRequest("ui/initialize", {
          appInfo,
          appCapabilities,
          protocolVersion,
        });
        rpcNotify("ui/notifications/initialized", {});
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize the MCP Apps bridge:", error);
      }
    };

    initializeBridge();

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const displayGreeting = greetingData.greeting || "Welcome to ChatAppDemo! 👋";
  const emoji = "👋";

  return (
    <div className="app">
      <div className="gradient-bg"></div>
      <div className="content">
        <div className="emoji">{emoji}</div>
        <h1 className="greeting">{displayGreeting}</h1>
        {!isInitialized && <p className="status">Initializing...</p>}
      </div>
    </div>
  );
}

export default App;
