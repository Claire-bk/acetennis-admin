import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();

    function handleGoHome() {
        navigate("/dashboard", { replace: true });
    }

    function handleLogout() {
        localStorage.setItem('TOKEN', "");
        sessionStorage.setItem('isLogin', "");
        sessionStorage.setItem('username', "");
        navigate("/", { replace: true });
    }

    function handleSignup() {
        navigate("/signup", { replace: true });
    }

    return (
        <header className='header flex justify-between bg-gradient-to-r from-color-dark-yellow to-color-orange p-4'>
            <div className='logo'>
                <span className="material-icons text-4xl text-white pr-2">sports_tennis</span>
                <span className='text-white text-4xl pl-2'>Ace Tennis</span>
            </div>
            <ul className="navBar__menu flex">
                <li className="p-2 text-white hover:text-fuchsia-600 hover:cursor-pointer" onClick={handleGoHome}>Home</li>
                {/* <li className="p-2 text-white hover:text-fuchsia-600 hover:cursor-pointer" onClick={handleSignup}>Signup</li> */}
                <li className="p-2 text-white hover:text-fuchsia-600 hover:cursor-pointer" onClick={handleLogout}>Logout</li>
            </ul>        
        </header>
    )
};
