import { 
  Text, View, StyleSheet, TextInput, Pressable, 
  FlatList, Alert, ImageBackground, TouchableOpacity 
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const [lista, setLista] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [prioridade, setPrioridade] = useState('Média'); 
  const [filtro, setFiltro] = useState('Todas'); 


  function logar() {
    if ((usuario === 'admin' || usuario === '123.456.789-00') && senha === '123') {
      setLogado(true);
    } else {
      Alert.alert("Erro", "Login ou Senha incorretos!");
    }
  }

  function adicionar() {
    if (novaTarefa.trim() === "") return;

    const existe = lista.some(t => t.nome.toLowerCase() === novaTarefa.toLowerCase().trim());
    if (existe) {
      Alert.alert("Aviso", "Esta tarefa já existe!");
      return;
    }

    const novoItem = {
      id: Date.now().toString(), 
      nome: novaTarefa,
      concluida: false,
      prioridade: prioridade
    };

    setLista([...lista, novoItem]);
    setNovaTarefa("");
  }

  function remover(id) {
    setLista(lista.filter(t => t.id !== id));
  }

  function inverterConcluida(id) {
    const atualizada = lista.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    );
    setLista(atualizada);
  }

  function limparConcluidas() {
    setLista(lista.filter(t => !t.concluida));
  }

  const tarefasFiltradas = lista.filter(t => {
    if (filtro === 'Pendentes') return !t.concluida;
    if (filtro === 'Concluídas') return t.concluida;
    return true;
  });

  const totalConcluidas = lista.filter(t => t.concluida).length;

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg?w=740' }}
        style={styles.bg}>
        
        {!logado ? (
          <View style={styles.cardLogin}>
            <Text style={styles.titulo}>LOGIN</Text>
            <TextInput
              style={styles.input}
              placeholder="CPF ou Usuário"
              onChangeText={setUsuario}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              onChangeText={setSenha}
            />
            <Pressable style={styles.botaoLogin} onPress={logar}>
              <Text style={styles.txtBotao}>ENTRAR</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardApp}>
            <View style={styles.header}>
              <Text style={styles.subtitulo}>Tarefas de {usuario}</Text>
              <Text style={styles.contador}>Concluídas: {totalConcluidas}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nova tarefa..."
              value={novaTarefa}
              onChangeText={setNovaTarefa}
            />

            <View style={styles.row}>
              {['Baixa', 'Média', 'Alta'].map(p => (
                <TouchableOpacity 
                  key={p} 
                  onPress={() => setPrioridade(p)} 
                  style={[styles.btnPrio, prioridade === p && styles.prioAtiva]}
                >
                  <Text style={{fontSize: 10}}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Pressable style={styles.botaoAdd} onPress={adicionar}>
              <Text style={styles.txtBotao}>ADICIONAR</Text>
            </Pressable>

            <View style={styles.filtrosRow}>
              {['Todas', 'Pendentes', 'Concluídas'].map(f => (
                <Text 
                  key={f} 
                  onPress={() => setFiltro(f)} 
                  style={[styles.txtFiltro, filtro === f && styles.filtroAtivo]}
                >
                  {f}
                </Text>
              ))}
            </View>

            <FlatList
              data={tarefasFiltradas}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.vazio}>Nenhuma tarefa encontrada! ✨</Text>}
              renderItem={({ item }) => (
                <View style={[
                  styles.itemContainer, 
                  { borderLeftColor: item.prioridade === 'Alta' ? 'red' : item.prioridade === 'Média' ? 'orange' : 'green' },
                  item.concluida && { opacity: 0.4 }
                ]}>
                  <TouchableOpacity onPress={() => inverterConcluida(item.id)} style={{ flex: 1 }}>
                    <Text style={[styles.itemTexto, item.concluida && styles.riscado]}>
                      {item.nome} ({item.prioridade})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => remover(item.id)}>
                    <Text style={{color: 'red'}}>Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity onPress={limparConcluidas} style={{marginTop: 10}}>
              <Text style={styles.limparTxt}>Limpar Concluídas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLogado(false)} style={{marginTop: 15}}>
              <Text style={{textAlign: 'center', color: '#666'}}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardLogin: { backgroundColor: 'white', padding: 25, borderRadius: 15, width: '85%' },
  cardApp: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: '90%', height: '80%' },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitulo: { fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 10 },
  botaoLogin: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
  botaoAdd: { backgroundColor: 'green', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  txtBotao: { color: 'white', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  btnPrio: { padding: 5, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, width: '30%', alignItems: 'center' },
  prioAtiva: { backgroundColor: '#eee' },
  filtrosRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  txtFiltro: { fontSize: 12, color: '#999' },
  filtroAtivo: { fontWeight: 'bold', color: '#007bff', textDecorationLine: 'underline' },
  itemContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 8, borderLeftWidth: 6, alignItems: 'center' },
  itemTexto: { fontSize: 16 },
  riscado: { textDecorationLine: 'line-through', color: 'gray' },
  vazio: { textAlign: 'center', marginTop: 30, color: 'gray' },
  limparTxt: { textAlign: 'center', color: 'blue', fontSize: 12 },
  contador: { color: 'green', fontWeight: 'bold' }
});