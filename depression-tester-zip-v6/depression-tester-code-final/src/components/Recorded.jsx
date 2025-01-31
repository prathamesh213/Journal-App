import start from "../assets/start.png";
export default function Recorded() {
  return (
    <div className="flex border-2 h-20 hover:border-2 hover:border-black bg-white p-4 rounded-md text-xl font-bold hover:bg-zinc-200 ">
      <button className="px-2 ">Record Again</button>
      <img src={start} alt="start"></img>
    </div>
  );
}
