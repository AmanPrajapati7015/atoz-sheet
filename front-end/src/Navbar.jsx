import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const backendURI = 'http://atoz-sheet-env.eba-4sn9xnkt.ap-south-1.elasticbeanstalk.com'


const Navbar = ({ user, setUser }) => {

    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const code = authResult['code'];
                const resp = await axios.get(`${backendURI}/auth/google?code=${code}`)
                localStorage.setItem('user', JSON.stringify(resp.data));
                setUser(resp.data);
            }
        }
        catch (error) {
            console.error('Error while requesting google code', error);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code',
    });

    const logOut = () => {
        localStorage.removeItem('user');
        setUser({});
        // setIsDone(Array.from({ length: 455 }, () => false));
    }
    console.log(user);


    return (
        <nav className="py-3 bg-[#2E3136] text-white px-5">
            <div className='flex items-center justify-between m-auto max-w-[1300px]'>
                <div className='text-2xl font-bold'>My App</div>
                {localStorage.getItem('user') ?
                    <div className='flex gap-3 items-center'>
                        <span>{"Welcome, " + user.name} </span>
                        <img className='w-[40px] rounded-full' src={user.picture} alt="" />
                        <button className='py-1 px-3 bg-white text-black rounded cursor-pointer hover:bg-black hover:text-white border border-white '
                            onClick={logOut}
                        >
                            Log Out
                        </button>
                    </div>
                    :

                    <button className='py-1 px-3 bg-blue-500 text-white rounded cursor-pointer hover:bg-white hover:text-blue-500 border border-white'
                        onClick={googleLogin}
                    >
                        Login with Google
                    </button>
                }
            </div>
        </nav>
    );
};

export default Navbar;