import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn auth.loggedInAsGuest: " + auth.loggedIn + '*' + auth.loggedInAsGuest);
    
    if (auth.loggedIn)
        return <HomeScreen />
    else if (auth.loggedInAsGuest)
        return <HomeScreen />
    else
        return <SplashScreen />
}