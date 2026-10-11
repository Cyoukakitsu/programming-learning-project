import Hello from "../../components/hello";
import Books from "./books/page";

const Home = () => {
  console.log("Home");
  return (
    <main>
      <div className="text-3xl underline">Home</div>
      <Hello />
      <Books />
    </main>
  );
};

export default Home;
