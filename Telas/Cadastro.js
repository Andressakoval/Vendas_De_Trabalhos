import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import app from '../Servicos/firebase';

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const auth = getAuth(app);

  const CadastrarUsuario = () => {
    if (!nome || !email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao cadastrar. Tente novamente.');
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Venda de Trabalhos</Text>
      <Text style={styles.subtitle}>Crie sua conta</Text>

      <TextInput 
        placeholder="Nome" 
        value={nome} 
        onChangeText={text => setNome(text)} 
        style={styles.input} 
      />
      
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
        onChangeText={text => setSenha(text)} 
        style={styles.input} 
        secureTextEntry 
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={CadastrarUsuario}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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
});
