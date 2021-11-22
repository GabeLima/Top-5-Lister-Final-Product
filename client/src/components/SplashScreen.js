import { Fab} from '@mui/material'
import { useHistory } from 'react-router-dom'
export default function SplashScreen() {
    const history = useHistory();

    const handleLogin = (event) => {
        history.push('/login');
    };

    const handleRegister = (event) => {
        history.push('/register');
    };


    return (
        <div id="splash-screen">
            <div id = "splash-screen-welcome-text">
                <h4 >Welcome! </h4>
            </div>
            <div id = "splash-screen-welcome-text-small">
                <h4 >To the Top 5 Lister! </h4>
            </div>
            <div id = "splash-screen-body-text">
                <p >Welcome to the Top 5 Lister! Here we rank your favorite artists, 
                    places to eat, and the silliest movies to watch from 1-5!<br></br> Lists 
                    are created by the users, for the users. All you have to do is create a list, 
                    publish it, and vote on other peoples lists! </p>
            </div>
            <div id = "splash-screen-login-button">
                <Fab
                    color="primary" 
                    aria-label="add"
                    id="login-user-button"
                    onClick={handleLogin}
                >
                    Login
                </Fab>
            </div>
            <div id = "splash-screen-register-button">
                <Fab
                    color="primary" 
                    aria-label="add"
                    id="login-user-button"
                    onClick={handleRegister}
                >
                    Register
                </Fab>
            </div>
            <div id = "splash-screen-guest-button">
                <Fab
                    color="disabled" 
                    aria-label="add"
                    id="login-user-button"
                    //onClick={handleCreateNewList}
                >
                    Guest
                </Fab>
            </div>
        </div>
    )
}