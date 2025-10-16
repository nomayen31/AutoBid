import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider'

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext)

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
      {/* Inner content - 80% width */}
      <div className="mx-auto w-4/5 flex items-center justify-between py-4">
        {/* Left: Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight text-amber-400">
            AutiBid
          </span>
        </Link>

        {/* Right: Menu */}
        <div className="flex items-center gap-6">
          {/* Public Links */}
          <Link
            to="/"
            className="text-sm font-medium text-gray-200 hover:text-amber-400 transition"
          >
            Home
          </Link>
          <Link
            to="/all-cars"
            className="text-sm font-medium text-gray-200 hover:text-amber-400 transition"
          >
            All Cars
          </Link>
          <Link
            to="/auctions"
            className="text-sm font-medium text-gray-200 hover:text-amber-400 transition"
          >
            Live Auctions
          </Link>

          {/* Login Button */}
          {!user && (
            <Link
              to="/login"
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
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
                className="btn btn-ghost btn-circle avatar hover:ring hover:ring-amber-400/40 transition"
                title={user?.displayName}
              >
                <div className="w-10 h-10 rounded-full ring ring-amber-400/40 ring-offset-2 ring-offset-gray-900 overflow-hidden">
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
                className="menu menu-sm dropdown-content mt-3 w-56 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-xl"
              >
                <li>
                  <Link
                    to="/add-car"
                    className="rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    Add Car
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-posted-cars"
                    className="rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    My Posted Cars
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-bids"
                    className="rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    My Bids
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bid-requests"
                    className="rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    Bid Requests
                  </Link>
                </li>
                <li className="mt-2">
                  <button
                    onClick={logOut}
                    className="w-full rounded-lg border border-amber-400 px-3 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-400 hover:text-black transition"
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
