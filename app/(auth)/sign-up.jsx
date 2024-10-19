import  React, {useState} from 'react'
import { TextInput, View, TouchableOpacity, Text } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
      setError(null)
    } catch (err) {
      if(err.errors){
        const passwordError = err.errors.find(error => error.code === 'form_password_pwned');
        const lengthError = err.errors.find(error => error.code === 'form_password_length_too_short');
        setError(null);
        if(passwordError){
            setError('Your password has been found in a data breach, Please use a different password')
        }
        else if(lengthError){
            setError('Your password must be at least 8 characters long')
        }
        else {
            setError('Sign up failed')
        }
      }
      setError('Unknown Error occurred')
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }
    setError(null);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/sign-in')
      } else {
        setError('Verification Error')
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError('Verification Error')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-4xl font-extrabold text-teal-600 mb-6">Sign up</Text>
        {
            error && (
                <Text className="text-red-500 mb-4 text-center">{error}</Text>
            )
        }
      {!pendingVerification && (
        <>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-sm"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={setEmailAddress}
            keyboardType='email-address'
          />
          <TextInput
            className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-sm"
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <TouchableOpacity className="bg-teal-600 py-4 rounded-full shadow-lg w-full" onPress={onSignUpPress}>
            <Text className="text-white text-center text-lg font-bold">Sign up</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Already have an Account?</Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
                <Text className="text-teal-600 font-semibold ml-1">Sign in</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
           className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-sm"
          value={code} 
          placeholder="Code..." 
          onChangeText={setCode} 
          />
          <TouchableOpacity className="bg-teal-600 py-4 rounded-full shadow-lg w-full" onPress={onPressVerify}>
            <Text className="text-white text-center text-lg font-bold">Verify Email</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
          <TouchableOpacity onPress={() => router.push('/')}>
                <Text className="text-teal-600 font-semibold ml-1">Go to Home</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}