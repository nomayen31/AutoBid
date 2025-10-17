import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider'

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext)

  return (
    <nav className="sticky top-0 z-50 w-full shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Inner content - 80% width */}
      <div className="flex items-center justify-between w-4/5 py-4 mx-auto">
        {/* Left: Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-amber-400">
            AutoBid
          </span>
        </Link>

        {/* Right: Menu */}
        <div className="flex items-center gap-6">
          {/* Public Links */}
          <Link
            to="/"
            className="text-sm font-medium text-gray-200 transition hover:text-amber-400"
          >
            Home
          </Link>
          <Link
            to="/all-cars"
            className="text-sm font-medium text-gray-200 transition hover:text-amber-400"
          >
            All Cars
          </Link>
       

          {/* Login Button */}
          {!user && (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-black transition rounded-full bg-amber-500 hover:bg-amber-400"
            >
              Login
            </Link>
          )}

          {/* Authenticated User Dropdown */}
          {user && (
            <div className="relative dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="transition btn btn-ghost btn-circle avatar hover:ring hover:ring-amber-400/40"
                title={user?.displayName}
              >
                <div className="w-10 h-10 overflow-hidden rounded-full ring ring-amber-400/40 ring-offset-2 ring-offset-gray-900">
                  <img
                    referrerPolicy="no-referrer"
                    alt="User Profile"
                    src={user?.photoURL}
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="w-56 p-2 mt-3 bg-gray-900 border border-gray-700 shadow-xl menu menu-sm dropdown-content rounded-xl"
              >
                <li>
                  <Link
                    to="/add-car"
                    className="px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-amber-400"
                  >
                    Add Car
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-posted-cars"
                    className="px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-amber-400"
                  >
                    My Posted Cars
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-bids"
                    className="px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-amber-400"
                  >
                    My Bids
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bid-requests"
                    className="px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-amber-400"
                  >
                    Bid Requests
                  </Link>
                </li>
                <li className="mt-2">
                  <button
                    onClick={logOut}
                    className="w-full px-3 py-2 text-sm font-semibold transition border rounded-lg border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
