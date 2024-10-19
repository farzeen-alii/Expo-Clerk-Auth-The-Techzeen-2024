import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import React, {useCallback, useState} from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        setError('Sign in failed. Please check your credentials')
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
        if(err.errors){
            const identifierError = err.errors.find(error => error.code === 'form_identifier_invalid');
            const passwordError = err.errors.find(error => error.code === 'form_password_incorrect');
            setError(null);
            if(identifierError){
                setError('User does not exist')
            }
            else if(lengthError){
                setError('Your password is incorrect')
            }
            else {
                setError('Sign in failed')
            }
          }
          else{
            setError('Unknown Error occurred')
      console.error(JSON.stringify(err, null, 2))
    }
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-4xl font-extrabold text-teal-600 mb-6">Sign in</Text>
        {
            error && (
                <Text className="text-red-500 mb-4 text-center">{error}</Text>
            )
        }
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
          <TouchableOpacity className="bg-teal-600 py-4 rounded-full shadow-lg w-full" onPress={onSignInPress}>
            <Text className="text-white text-center text-lg font-bold">Sign in</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Don't have an Account?</Text>
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
                <Text className="text-teal-600 font-semibold ml-1">Sign up</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-6">
          <TouchableOpacity onPress={() => router.push('/')}>
                <Text className="text-teal-600 font-semibold ml-1">Go to Home</Text>
            </TouchableOpacity>
          </View>
    </View>
  )
}