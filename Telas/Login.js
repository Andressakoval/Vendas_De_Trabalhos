import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { auth } from '../Servicos/firebase';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const auth = getAuth();

  const ValidaComFirebase = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        navigation.replace('Proposta');
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Erro', 'Email ou senha inválidos. Tente novamente.');
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Venda de Trabalhos</Text>
      <Text style={styles.subtitle}>Faça seu Login</Text>
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={text => setEmail(text)} 
        style={styles.input} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Senha" 
        value={senha} 
        secureTextEntry={true} 
        onChangeText={text => setSenha(text)} 
        style={styles.input} 
      />
      <View style={styles.viewText}>
        <Text style={styles.newAccountText}>Ainda não possui conta?{''}</Text>
        <Text onPress={() => navigation.navigate('Cadastro')} style={styles.newAccountLink}>Cadastre-se</Text>
      </View>
      <TouchableOpacity style={styles.buttonPrimary} onPress={ValidaComFirebase}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewText: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  newAccountText: {
    fontSize: 18,
    color: '#555',
  },
  newAccountLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    textDecorationLine: 'none',
    marginTop: 10,
  }
});
