import React, { useState, useEffect } from 'react';
import { User, Phone, MessageCircle, CheckCircle, BarChart3, Users, Database } from 'lucide-react';

const RadarPreConexao = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [currentLead, setCurrentLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para as diferentes telas
  const [cadastroData, setCadastroData] = useState({
    nome: '',
    whatsapp: '',
    social: '',
    origem: '',
    obs_inicial: '',
    data_call: '',
    hora_call: ''
  });

  const [preQualData, setPreQualData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  });

  const [socialData, setSocialData] = useState({
    sinais_d: false,
    sinais_i: false,
    sinais_s: false,
    sinais_c: false,
    velocidade_resposta: '',
    pontuacao_textual: '',
    formatacao: ''
  });

  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [perfilProbavel, setPerfilProbavel] = useState(null);
  const [confianca, setConfianca] = useState('baixa');

  // Carregar dados ao inicializar
  useEffect(() => {
    loadLeads();
  }, []);

  // Carregar leads do localStorage
  const loadLeads = () => {
    try {
      const savedLeads = localStorage.getItem('radar_leads');
      if (savedLeads) {
        const parsedLeads = JSON.parse(savedLeads);
        setLeads(parsedLeads);
        console.log(`✅ ${parsedLeads.length} leads carregadas do localStorage`);
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      setLeads([]);
    }
  };

  // Salvar leads no localStorage
  const saveToLocalStorage = (updatedLeads) => {
    try {
      localStorage.setItem('radar_leads', JSON.stringify(updatedLeads));
      console.log('✅ Dados salvos no localStorage');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  // Salvar nova lead
  const saveLead = async (leadData) => {
    setIsLoading(true);
    try {
      const newLead = {
        ...leadData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
      saveToLocalStorage(updatedLeads);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Lead salva:', newLead.nome);
      return newLead;
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar lead existente
  const updateLead = async (leadId, updatedData) => {
    setIsLoading(true);
    try {
      const updatedLead = {
        ...updatedData,
        updated_at: new Date().toISOString()
      };
      
      const updatedLeads = leads.map(l => 
        l.id === leadId ? updatedLead : l
      );
      
      setLeads(updatedLeads);
      saveToLocalStorage(updatedLeads);
      
      // Simular delay de API  
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Lead atualizada:', updatedLead.nome);
      return updatedLead;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Templates de mensagens
  const templates = {
    aquecimento: {
      D: "{{nome}}, direto ao ponto: tenho um plano pra gerar {{roi_previsto}} em {{prazo}}. Pode falar {{data_call}} às {{hora_call}}?",
      I: "{{nome}}, adorei sua vibe e seu trabalho. Tenho ideias pra amplificar isso. Fechamos um papo {{data_call}} às {{hora_call}}?",
      S: "{{nome}}, quero te ouvir com calma e montar um passo a passo seguro. Pode ser {{data_call}} às {{hora_call}}?",
      C: "{{nome}}, deixei dados e comparativos prontos pra você decidir com clareza. Confirmamos {{data_call}} às {{hora_call}}?"
    },
    abertura: {
      D: "{{nome}}, pra otimizar seu tempo: quero confirmar meta, remover gargalo e te mostrar um plano com ROI. Pode ser assim?",
      I: "{{nome}}, amei seu projeto. Quero te ouvir e trocar ideias pra subir sua energia e seus resultados.",
      S: "{{nome}}, sem pressa: quero entender seu ritmo e montar algo que te dê paz e constância.",
      C: "{{nome}}, preparei dados e um comparativo objetivo. Posso te mostrar a estrutura e benchmarks?"
    },
    confirmacao: {
      D: "Confirmando nossa conversa {{data_call}} às {{hora_call}}. Roteiro direto e plano com ROI.",
      I: "Tô animada pra nossa conversa {{data_call}} às {{hora_call}} ✨ vai ser massa.",
      S: "Confirmado nosso encontro {{data_call}} às {{hora_call}}. Vamos no seu ritmo.",
      C: "Confirmado {{data_call}} às {{hora_call}}. Levo dados e comparativos claros."
    }
  };

  const perguntasAbertas = {
    D: [
      "Qual foi sua maior vitória recente?",
      "Se eu eliminasse um gargalo hoje, qual escolheria?",
      "Qual número quer bater em 90 dias e por quê?"
    ],
    I: [
      "O que tem te dado mais tesão no negócio?",
      "Qual história recente te orgulhou?",
      "Quando tudo estiver redondo, como você quer se sentir?"
    ],
    S: [
      "O que hoje te dá tranquilidade na rotina?",
      "O que precisa ficar mais leve?",
      "O que você considera essencial em quem te acompanha?"
    ],
    C: [
      "Quais métricas você acompanha semanalmente?",
      "Que critérios usa pra validar um investimento?",
      "Qual gargalo técnico mais impacta o resultado hoje?"
    ]
  };

  // Função para calcular perfil
  const calcularPerfil = () => {
    let newScores = { D: 0, I: 0, S: 0, C: 0 };

    // Pontuação do questionário
    if (preQualData.q1 === 'direto') {
      newScores.D += 2;
      newScores.C += 1;
    } else if (preQualData.q1 === 'conversar') {
      newScores.I += 2;
      newScores.S += 1;
    }

    if (preQualData.q2 === 'decido') {
      newScores.D += 2;
      newScores.C += 1;
    } else if (preQualData.q2 === 'alinho') {
      newScores.S += 2;
      newScores.I += 1;
    }

    if (preQualData.q5 === 'retorno') newScores.D += 2;
    else if (preQualData.q5 === 'reconhecimento') newScores.I += 2;
    else if (preQualData.q5 === 'estabilidade') newScores.S += 2;
    else if (preQualData.q5 === 'processo') newScores.C += 2;

    if (preQualData.q6 === 'curto') {
      newScores.D += 1;
      newScores.C += 1;
    } else if (preQualData.q6 === 'audio') {
      newScores.I += 1;
    } else if (preQualData.q6 === 'detalhado') {
      newScores.S += 1;
      newScores.C += 1;
    }

    // Pontuação das observações sociais
    if (socialData.sinais_d) newScores.D += 2;
    if (socialData.sinais_i) newScores.I += 2;
    if (socialData.sinais_s) newScores.S += 2;
    if (socialData.sinais_c) newScores.C += 2;

    setScores(newScores);

    // Determinar perfil provável
    const maxScore = Math.max(...Object.values(newScores));
    const perfil = Object.keys(newScores).find(key => newScores[key] === maxScore);
    
    // Calcular confiança
    const sortedScores = Object.values(newScores).sort((a, b) => b - a);
    const conf = sortedScores[0] >= (sortedScores[1] + 3) ? 'alta' : 
                 sortedScores[0] >= (sortedScores[1] + 1) ? 'média' : 'baixa';

    setPerfilProbavel(perfil);
    setConfianca(conf);

    return { perfil, confianca: conf, scores: newScores };
  };

  // Componente Dashboard
  const Dashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{color: '#d2bc8f'}}>🧭 Radar Pré-Conexão</h1>
            <p className="text-white">Sistema de pré-qualificação e preparação de calls por perfil DISC</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2" style={{color: '#d2bc8f'}}>
              <Database className="w-4 h-4" />
              <span className="text-sm">Dados locais</span>
            </div>
            {leads.length > 0 && (
              <div className="text-xs text-gray-400 ml-2">
                {leads.length} leads
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(210, 188, 143, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}>
          <Users className="w-8 h-8 mb-3" style={{color: '#d2bc8f'}} />
          <h3 className="text-xl font-semibold text-white">Total de Leads</h3>
          <p className="text-3xl font-bold" style={{color: '#d2bc8f'}}>{leads.length}</p>
        </div>
        
        <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
          <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-xl font-semibold text-white">Prontos p/ Call</h3>
          <p className="text-3xl font-bold text-green-400">
            {leads.filter(l => l.estado === 'pronto_para_call').length}
          </p>
        </div>
        
        <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)'}}>
          <BarChart3 className="w-8 h-8 text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold text-white">Em Qualificação</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {leads.filter(l => l.estado === 'pre_qualificado').length}
          </p>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(210, 188, 143, 0.2)'}}>
        <h2 className="text-xl font-semibold mb-4" style={{color: '#d2bc8f'}}>Ações Rápidas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentScreen('cadastro')}
            className="px-6 py-3 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-2 text-white font-medium"
            style={{backgroundColor: '#d2bc8f'}}
          >
            <User className="w-5 h-5" />
            Nova Lead
          </button>
          <button
            onClick={() => setCurrentScreen('leads')}
            className="px-6 py-3 rounded-lg border-2 text-white hover:bg-white hover:bg-opacity-10 transition-all flex items-center gap-2"
            style={{borderColor: '#d2bc8f'}}
          >
            <Users className="w-5 h-5" />
            Ver Todas as Leads
          </button>
        </div>
      </div>

      {leads.length > 0 && (
        <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(210, 188, 143, 0.2)'}}>
          <h2 className="text-xl font-semibold mb-4" style={{color: '#d2bc8f'}}>Últimas Leads</h2>
          <div className="space-y-3">
            {leads.slice(-5).reverse().map(lead => (
              <div key={lead.id} className="flex justify-between items-center p-3 rounded" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
                <div>
                  <p className="font-medium text-white">{lead.nome}</p>
                  <p className="text-sm text-gray-300">
                    {lead.perfil_probavel ? `Perfil: ${lead.perfil_probavel}` : 'Sem perfil'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    lead.estado === 'novo' ? 'bg-gray-600 text-gray-300' :
                    lead.estado === 'pre_qualificado' ? 'bg-yellow-600 text-yellow-100' :
                    'bg-green-600 text-green-100'
                  }`}>
                    {lead.estado ? lead.estado.replace('_', ' ') : 'novo'}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentLead(lead);
                      if (!lead.estado || lead.estado === 'novo') setCurrentScreen('pre-qualificacao');
                      else if (lead.estado === 'pre_qualificado') setCurrentScreen('observacao');
                      else setCurrentScreen('mensagens');
                    }}
                    className="hover:opacity-80 transition-opacity"
                    style={{color: '#d2bc8f'}}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg flex items-center gap-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)'}}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{borderColor: '#d2bc8f'}}></div>
            <span className="text-white">Salvando dados...</span>
          </div>
        </div>
      )}
    </div>
  );

  // T1 - Cadastro
  const Cadastro = () => (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" style={{color: '#d2bc8f'}}>📝 Cadastro de Nova Lead</h1>
      
      <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(210, 188, 143, 0.2)'}}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Nome *</label>
            <input
              type="text"
              value={cadastroData.nome}
              onChange={(e) => setCadastroData({...cadastroData, nome: e.target.value})}
              className="w-full p-3 rounded-lg focus:ring-2 text-white placeholder-gray-400"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)', focusRingColor: '#d2bc8f'}}
              placeholder="Nome da lead"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>WhatsApp *</label>
            <input
              type="text"
              value={cadastroData.whatsapp}
              onChange={(e) => setCadastroData({...cadastroData, whatsapp: e.target.value})}
              className="w-full p-3 rounded-lg focus:ring-2 text-white placeholder-gray-400"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Social</label>
            <input
              type="text"
              value={cadastroData.social}
              onChange={(e) => setCadastroData({...cadastroData, social: e.target.value})}
              className="w-full p-3 rounded-lg focus:ring-2 text-white placeholder-gray-400"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
              placeholder="@instagram ou LinkedIn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Origem *</label>
            <select
              value={cadastroData.origem}
              onChange={(e) => setCadastroData({...cadastroData, origem: e.target.value})}
              className="w-full p-3 rounded-lg focus:ring-2 text-white"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
            >
              <option value="" style={{backgroundColor: '#0c121c'}}>Selecione...</option>
              <option value="site" style={{backgroundColor: '#0c121c'}}>Site</option>
              <option value="evento" style={{backgroundColor: '#0c121c'}}>Evento</option>
              <option value="indicacao" style={{backgroundColor: '#0c121c'}}>Indicação</option>
              <option value="anuncio" style={{backgroundColor: '#0c121c'}}>Anúncio</option>
              <option value="organico" style={{backgroundColor: '#0c121c'}}>Orgânico</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Data da Call</label>
              <input
                type="date"
                value={cadastroData.data_call}
                onChange={(e) => setCadastroData({...cadastroData, data_call: e.target.value})}
                className="w-full p-3 rounded-lg focus:ring-2 text-white"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Hora da Call</label>
              <input
                type="time"
                value={cadastroData.hora_call}
                onChange={(e) => setCadastroData({...cadastroData, hora_call: e.target.value})}
                className="w-full p-3 rounded-lg focus:ring-2 text-white"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#d2bc8f'}}>Observações Iniciais</label>
            <textarea
              value={cadastroData.obs_inicial}
              onChange={(e) => setCadastroData({...cadastroData, obs_inicial: e.target.value})}
              className="w-full p-3 rounded-lg focus:ring-2 text-white placeholder-gray-400"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(210, 188, 143, 0.3)'}}
              rows="3"
              placeholder="Qualquer observação relevante..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="px-6 py-3 border-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-white"
            style={{borderColor: '#d2bc8f'}}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (!cadastroData.nome || !cadastroData.whatsapp || !cadastroData.origem) {
                alert('Preencha os campos obrigatórios');
                return;
              }
              
              const newLead = {
                ...cadastroData,
                estado: 'novo',
                score_D: 0,
                score_I: 0,
                score_S: 0,
                score_C: 0,
                perfil_probavel: null,
                confianca: null
              };
              
              try {
                const savedLead = await saveLead(newLead);
                setCurrentLead(savedLead);
                setCadastroData({
                  nome: '', whatsapp: '', social: '', origem: '', 
                  obs_inicial: '', data_call: '', hora_call: ''
                });
                setCurrentScreen('pre-qualificacao');
              } catch (error) {
                alert('Erro ao salvar lead. Tente novamente.');
              }
            }}
            className="px-6 py-3 rounded-lg hover:opacity-80 transition-opacity text-white font-medium"
            style={{backgroundColor: '#d2bc8f'}}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar & Avançar'}
          </button>
        </div>
      </div>
    </div>
  );

  // Tela simples para outras funcionalidades
  const OutraTela = ({ titulo, descricao }) => (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" style={{color: '#d2bc8f'}}>{titulo}</h1>
      <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(210, 188, 143, 0.2)'}}>
        <p className="text-white mb-4">{descricao}</p>
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="px-6 py-3 rounded-lg hover:opacity-80 transition-opacity text-white font-medium"
          style={{backgroundColor: '#d2bc8f'}}
        >
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );

  // Lista de Leads
  const LeadsList = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{color: '#d2bc8f'}}>Todas as Leads</h1>
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="hover:opacity-80 transition-opacity"
          style={{color: '#d2bc8f'}}
        >
          ← Voltar
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white">Nenhuma lead cadastrada ainda</p>
          <button
            onClick={() => setCurrentScreen('cadastro')}
            className="mt-4 px-6 py-2 rounded hover:opacity-80 transition-opacity text-white font-medium"
            style={{backgroundColor: '#d2bc8f'}}
          >
            Cadastrar primeira lead
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map(lead => (
            <div key={lead.id} className="p-6 rounded-lg shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(210, 188, 143, 0.2)'}}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{lead.nome}</h3>
                  <p className="text-gray-300">{lead.whatsapp}</p>
                  <p className="text-sm text-gray-400">Origem: {lead.origem}</p>
                  {lead.data_call && (
                    <p className="text-sm" style={{color: '#d2bc8f'}}>
                      Call: {lead.data_call} às {lead.hora_call}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    !lead.estado || lead.estado === 'novo' ? 'bg-gray-600 text-gray-300' :
                    lead.estado === 'pre_qualificado' ? 'bg-yellow-600 text-yellow-100' :
                    'bg-green-600 text-green-100'
                  }`}>
                    {lead.estado ? lead.estado.replace('_', ' ') : 'novo'}
                  </span>
                  {lead.perfil_probavel && (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      lead.perfil_probavel === 'D' ? 'bg-red-600 text-red-100' :
                      lead.perfil_probavel === 'I' ? 'bg-yellow-600 text-yellow-100' :
                      lead.perfil_probavel === 'S' ? 'bg-green-600 text-green-100' :
                      'bg-blue-600 text-blue-100'
                    }`}>
                      Perfil {lead.perfil_probavel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render principal
  const renderScreen = () => {
    switch (currentScreen) {
      case 'cadastro': 
        return <Cadastro />;
      case 'leads': 
        return <LeadsList />;
      case 'pre-qualificacao': 
        return <OutraTela titulo="🎯 Pré-Qualificação" descricao="Questionário DISC em desenvolvimento" />;
      case 'observacao': 
        return <OutraTela titulo="🔍 Observação Social" descricao="OSINT e sinais comportamentais" />;
      case 'mensagens': 
        return <OutraTela titulo="💬 Mensagens" descricao="Templates personalizados por perfil" />;
      case 'preparacao': 
        return <OutraTela titulo="🎯 Preparação" descricao="Roteiros de call por perfil" />;
      case 'confirmacao': 
        return <OutraTela titulo="✅ Confirmação" descricao="Mensagens de confirmação" />;
      default: 
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0c121c'}}>
      {renderScreen()}
    </div>
  );
};

export default RadarPreConexao;
