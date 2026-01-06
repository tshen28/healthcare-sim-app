//route: "/"
import { useAuth } from '@/src/context/AuthContext';
import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Healthcare Simulation App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'black',
    },
})