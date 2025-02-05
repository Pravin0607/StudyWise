import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <h1 className="text-2xl font-mono">My App</h1>
      <Button>Click me</Button>
    </div>
  );
}
