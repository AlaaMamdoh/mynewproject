import { createStackNavigator } from 'react-navigation-stack'
import SignIn from './SignIn'
import SignUp from './SignUp'
import VerifyEmail from './VerifyEmail'

const authStack = createStackNavigator(
    {
        SignUp,
        SignIn,
        VerifyEmail,
        //ForgotPassword,
        //SetNewPassword,
    },
    {
        headerMode: 'none'
    }
)

export default authStack