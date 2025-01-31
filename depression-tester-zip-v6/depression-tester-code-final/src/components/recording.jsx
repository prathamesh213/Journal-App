import recording from "../assets/recording.gif";
export default function Recording() {
  return (
    <div className="flex border-2 h-20 hover:border-2 hover:border-red-500 bg-red-500 p-4 rounded-md text-xl text-white font-bold hover:bg-red-500 ">
      <button className="px-2 "> Recording...</button>
      <img src={recording} alt="start"></img>
    </div>
  );
}
