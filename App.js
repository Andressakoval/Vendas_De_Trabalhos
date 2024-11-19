import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Telas/Login";
import Proposta from "./Telas/Proposta";
import Cadastro from "./Telas/Cadastro";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './Servicos/firebase';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Se o usuário estiver logado, setamos o usuário no estado
    });

    return () => unsubscribe(); // Limpar a assinatura quando o componente for desmontado
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Proposta' : 'Login'}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Proposta" component={Proposta} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

