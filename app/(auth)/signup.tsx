//route: "/signup"
import { signup } from "@/src/services/auth.service";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SinupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await signup(email, password);
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Signup failed', error.message);
        }
    };

    return (
        <View style="">
            <Text style="">Signup</Text>

            <TextInput 
                placeholder="Email"
                autoCapitalize="none"
                style=""
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style=""
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style="" onPress={handleSignup}>
                <Text style="">Create Account</Text>
            </TouchableOpacity>

        </View>
    )
}