import PartySocket from "partysocket";

export function startParty() {
  let pingInterval: ReturnType<typeof setInterval>;

  // Let's append all the messages we get into this DOM element
  const output = document.getElementById("app") as HTMLDivElement;

  // Helper function to add a new line to the DOM
  function add(text: string) {
    console.log(`[p2p]`, text);
  }

  // A PartySocket is like a WebSocket, except it's a bit more magical.
  // It handles reconnection logic, buffering messages while it's offline, and more.
  const conn = new PartySocket({
    host: "https://server.chuanqisun.partykit.dev",
    // host: PARTYKIT_HOST,
    room: "my-new-room",
  });

  // You can even start sending messages before the connection is open!
  conn.addEventListener("message", (event) => {
    add(`Received -> ${event.data}`);
  });

  // Let's listen for when the connection opens
  // And send a ping every 2 seconds right after
  conn.addEventListener("open", () => {
    add("Connected!");
    add("Sending a ping every 2 seconds...");
    // TODO: make this more interesting / nice
    clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      conn.send("ping");
    }, 1000);
  });

  return conn;
}
