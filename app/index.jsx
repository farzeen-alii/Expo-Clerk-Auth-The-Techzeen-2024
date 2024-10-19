import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, View, TouchableOpacity } from 'react-native'

export default function Page() {
  const router = useRouter();
  const { user } = useUser()
  const {signOut} = useClerk();

  const handleLogout = async () =>{
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <SignedIn>
        <View className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-md">
          <Text className="text-teal-600 text-3xl font-bold mb-4 text-center">Welcome Back!</Text>
          <Text className="text-gray-700 text-lg mb-6">Hello {user?.emailAddresses[0].emailAddress}</Text>
          <TouchableOpacity className="bg-teal-600 mt-4 py-2 rounded-lg shadow-lg" onPress={handleLogout}>
            <Text className="text-white text-center text-lg font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </SignedIn>
      <SignedOut>
        <View className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-md">
          <Text className="text-teal-600 text-3xl font-bold mb-4 text-center">Welcome!</Text>
          <Text className="text-gray-700 text-lg mb-6">Please sign in or sign up to continue</Text>
          <View className="flex-row justify-between mt-2">
          <TouchableOpacity className="bg-teal-600 py-2 px-4 rounded-lg shadow-lg mr-2" onPress={() => router.push('/sign-in')}>
            <Text className="text-white text-center text-lg font-bold">Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-teal-600 py-2 px-4 rounded-lg shadow-lg mr-2" onPress={() => router.push('/sign-up')}>
            <Text className="text-white text-center text-lg font-bold">Sign up</Text>
          </TouchableOpacity>
          </View>
        </View>
      </SignedOut>
    </View>
  )
}