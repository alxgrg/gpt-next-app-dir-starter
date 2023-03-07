import Chat from "./Chat";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col">
      <h1 className="text-center text-2xl font-bold">Hello world!</h1>
      <Chat />
    </main>
  );
}
