import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";

export default function Topbar() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <header
      className={`flex justify-between items-center px-6 py-3 border-b ${
        darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
      }`}
    >
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="px-3 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
