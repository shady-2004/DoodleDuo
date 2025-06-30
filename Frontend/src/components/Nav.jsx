import { Link } from "react-router-dom";
import useAuth from "../contexts/useAuth";

function Nav() {
  const { isAuthenticated, logout } = useAuth();

  const navItemClasses =
    "bg-indigo-500 p-2 rounded-xl text-white hover:bg-indigo-600 transition duration-200";
  console.log(isAuthenticated);
  return (
    <div className="bg-gray-50 flex flex-col sm:flex-row justify-between items-center p-4 shadow-md border-b-2 border-gray-300 ">
      <Link to="/">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <h1 className="text-2xl font-semibold text-gray-800 hover:cursor-pointer">
            DoodleDuo
          </h1>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
        {isAuthenticated && (
          <Link to="/">
            <div
              onClick={logout}
              className={`${navItemClasses} bg-red-400 hover:bg-red-600`}
            >
              Logout
            </div>
          </Link>
        )}

        {!isAuthenticated && (
          <Link to="/signup">
            <div className={navItemClasses}>Signup</div>
          </Link>
        )}

        {/* <Link to="/sketches">
          <div className={navItemClasses}>Sketches</div>
        </Link> */}
      </div>
    </div>
  );
}

export default Nav;
