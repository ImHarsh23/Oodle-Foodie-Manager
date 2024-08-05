import { useOutletContext } from "react-router-dom";

const Search = () => {
  const [callback] = useOutletContext();
  return (
    <div className="w-11/12 sm:max-w-sm md:max-w-md mx-auto mt-10 rounded-2xl">
      <div className="relative flex items-center w-full h-11 sm:h-[52px] rounded-lg focus-within:shadow-lg bg-[#F0F0F5] overflow-hidden">
        <div className="grid place-items-center h-full w-16 text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          className="peer h-full w-full outline-none text-base font-medium text-gray-700 pr-2 bg-[#F0F0F5]"
          type="text"
          id="search"
          placeholder="Search restaurants.."
          onChange={(e) => {
            callback(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
