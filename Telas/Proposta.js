import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import CustomCheckBox from '../components/CustomCheckBox';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, onValue, push } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';
import app from '../Servicos/firebase';

export default function Proposta({ navigation }) {
  const [image, setImage] = useState(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]);

  useEffect(() => {
    const database = getDatabase(app);
    const disciplinasRef = dbRef(database, 'disciplinas');
    
    onValue(disciplinasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const disciplinasArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          name: value,
          selected: false,
        }));
        setDisciplinas(disciplinasArray);
      }
    });
  }, []);

  const coletarFoto = async () => {
    const permissaoResultado = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissaoResultado.granted) {
      alert('É necessário permitir o acesso à câmera!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleDisciplinaSelection = (id) => {
    setDisciplinas((prevDisciplinas) =>
      prevDisciplinas.map((disciplina) =>
        disciplina.id === id ? { ...disciplina, selected: !disciplina.selected } : disciplina
      )
    );
  };

  const salvarPropostaFireBase = async () => {
    const selecionadas = disciplinas
      .filter((disciplina) => disciplina.selected)
      .map((disciplina) => disciplina.name);

    if (!image || !nome || !telefone || !valor || selecionadas.length === 0) {
      alert('Preencha todos os campos, capture uma foto e selecione pelo menos uma disciplina antes de salvar!');
      return;
    }

    try {
      const storage = getStorage(app);
      const fileName = `propostas/${Date.now()}.jpg`;
      const imageRef = ref(storage, fileName);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);

      const database = getDatabase(app);
      const propostasRef = dbRef(database, 'propostas');
      await push(propostasRef, {
        nome,
        telefone,
        valor,
        disciplinas: selecionadas,
        foto: downloadURL,
      });

      alert('Proposta salva com sucesso no Firebase!');
    } catch (error) {
      console.error('Erro ao enviar a proposta:', error);
      alert('Erro ao enviar a proposta!');
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      alert('Erro ao deslogar.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={[{ key: 'header' }, ...disciplinas, { key: 'footer' }]}
        keyExtractor={(item, index) => item.key || index.toString()}
        renderItem={({ item }) => {
          if (item.key === 'header') {
            return (
              <View>
                <Text style={styles.title}>Faça sua Proposta</Text>
                <TextInput
                  placeholder="Nome completo"
                  value={nome}
                  onChangeText={setNome}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Telefone"
                  value={telefone}
                  onChangeText={setTelefone}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
                <TextInput
                  placeholder="Valor"
                  value={valor}
                  onChangeText={setValor}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <Text style={styles.label}>Selecione as disciplinas:</Text>
              </View>
            );
          } else if (item.key === 'footer') {
            return (
              <View>
                <View style={styles.card}>
                  <Text style={styles.label}>Tire uma foto da proposta</Text>
                  <TouchableOpacity style={styles.buttonSecondary} onPress={coletarFoto}>
                    <Text style={styles.buttonText}>Capturar Foto</Text>
                  </TouchableOpacity>
                </View>
                {image && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  </View>
                )}
                <TouchableOpacity style={styles.buttonPrimary} onPress={salvarPropostaFireBase}>
                  <Text style={styles.buttonText}>Enviar Proposta</Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return (
              <CustomCheckBox
                title={item.name}
                checked={item.selected}
                onPress={() => toggleDisciplinaSelection(item.id)}
              />
            );
          }
        }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});
