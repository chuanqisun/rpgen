import PartySocket from "partysocket";

export function startParty() {
  const conn = new PartySocket({
    // host: "https://server.chuanqisun.partykit.dev",
    host: import.meta.env.VITE_PARTYKIT_HOST,
    room: "my-new-room",
  });

  return conn;
}
