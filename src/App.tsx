// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const SECTIONS = ["Aulas", "Exercícios", "Afinador", "Rotina Vocal", "Consoantes", "Área do Aluno", "IA Professora", "Sobre Mim"];

const AULAS = [
  {
    id: 1,
    titulo: "Respiração Diafragmática",
    nivel: "Iniciante",
    duracao: "5 min",
    emoji: "🌬️",
    descricao: "A base de tudo no canto é a respiração correta. Aprenda a usar o diafragma como motor da sua voz.",
    topicos: [
      "Coloque uma mão no abdômen e outra no peito.",
      "Inspire lentamente pelo nariz, sentindo o abdômen expandir — não o peito.",
      "Expire devagar pela boca, como se fosse soprar uma vela sem apagá-la.",
      "Pratique 5 min por dia antes de qualquer exercício vocal.",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    titulo: "Postura e Ressonância",
    nivel: "Iniciante",
    duracao: "5 min",
    emoji: "🧍",
    descricao: "Seu corpo é o instrumento. Postura correta libera a ressonância natural da sua voz.",
    topicos: [
      "Fique em pé com os pés na largura dos ombros.",
      "Relaxe os ombros para baixo e para trás.",
      "Mantenha a cabeça alinhada com a coluna — queixo paralelo ao chão.",
      "Sinta a vibração no peito ao falar 'mmmmm' em voz baixa.",
    ],
    video: null,
  },
  {
    id: 3,
    titulo: "Extensão Vocal e Registros",
    nivel: "Intermediário",
    duracao: "5 min",
    emoji: "🎵",
    descricao: "Entenda voz de peito, voz de cabeça e como fazer a passagem (passaggio) sem quebrar.",
    topicos: [
      "Voz de peito: notas graves, vibração sentida no peito.",
      "Voz de cabeça: notas agudas, vibração sentida na cabeça/crânio.",
      "Passagem (Passaggio): zona de transição — o ponto frágil de todo cantor.",
      "Pratique glissandos (deslizamentos) para suavizar a transição.",
    ],
    video: null,
  },
  {
    id: 4,
    titulo: "Interpretação e Emoção",
    nivel: "Avançado",
    duracao: "5 min",
    emoji: "🎭",
    descricao: "Técnica sem emoção é vazia. Aprenda a contar histórias com a sua voz.",
    topicos: [
      "Leia a letra da música antes de cantá-la — entenda o que está dizendo.",
      "Identifique o clímax emocional da música.",
      "Use dinâmica (forte e piano) para expressar sentimentos.",
      "Grave-se cantando e assista para perceber sua expressão facial.",
    ],
    video: null,
  },
];

const EXERCICIOS = [
  { id: 1, nome: "Sirene", descricao: "Glissando do grave ao agudo em 'wooo'", duracao: 300, emoji: "🚨", instrucao: "Faça um som de sirene, subindo do grave ao agudo e voltando suavemente. Mantenha a boca relaxada." },
  { id: 2, nome: "Lip Trill", descricao: "Vibração dos lábios em escala", duracao: 300, emoji: "💋", instrucao: "Solte os lábios vibrando como um motor enquanto canta uma escala. Ajuda a relaxar a laringe." },
  { id: 3, nome: "Vocalise Mi-Ma-Mo", descricao: "Articulação e abertura da boca", duracao: 300, emoji: "🗣️", instrucao: "Cante 'mi-ma-mo' em cada nota de uma escala. Exagere na abertura da boca no 'ma'." },
  { id: 4, nome: "Escala de Dó", descricao: "Escala maior ascendente e descendente", duracao: 300, emoji: "🎼", instrucao: "Sobe: Dó Ré Mi Fá Sol Lá Si Dó. Desce: Dó Si Lá Sol Fá Mi Ré Dó. Use vogal 'A' aberta." },
  { id: 5, nome: "Staccato", descricao: "Notas curtas e articuladas em 'ha'", duracao: 300, emoji: "⚡", instrucao: "Cante 'ha-ha-ha-ha-ha' rápido e articulado, cada nota separada. Fortalece o suporte do diafragma." },
  { id: 6, nome: "Messa di Voce", descricao: "Crescendo e decrescendo em uma nota", duracao: 300, emoji: "🌊", instrucao: "Sustente uma nota começando suave (piano), aumente até forte (forte), depois volte ao suave. Controle total do fôlego." },
];

const NOTAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const PILARES = [
  { icon: "🌬️", titulo: "Respiração", texto: "O suporte respiratório adequado fornece estabilidade para a emissão vocal." },
  { icon: "💧", titulo: "Hidratação", texto: "Uma musculatura vocal bem hidratada responde com mais eficiência e conforto." },
  { icon: "🧘", titulo: "Relaxamento Corporal", texto: "Tensões no corpo podem limitar a liberdade vocal." },
  { icon: "🎯", titulo: "Técnica", texto: "A técnica organiza e potencializa os recursos naturais da voz." },
  { icon: "✨", titulo: "Expressão", texto: "A arte acontece quando a técnica encontra a emoção." },
];

const PERIODOS = [
  {
    nome: "Manhã",
    emoji: "🌅",
    subtitulo: "Despertando a Voz",
    blocos: [
      { titulo: "Silêncio Inicial", texto: "Ao acordar, procure permanecer em silêncio por aproximadamente 30 minutos. Assim como o corpo, a voz necessita de um período gradual de ativação." },
      { titulo: "Preparação Corporal", texto: "Realize movimentos suaves para liberar tensões:", lista: ["Rotação dos ombros", "Alongamento da cervical", "Movimentos de \"sim\", \"não\" e inclinações laterais", "Alongamento geral do corpo"], obs: "Objetivo: promover mobilidade e preparar a musculatura para a emissão vocal." },
      { titulo: "Respiração Consciente", texto: "Respire profundamente observando:", lista: ["Expansão abdominal", "Expansão das costelas inferiores", "Relaxamento dos ombros"], obs: "Evite elevar os ombros durante a inspiração." },
      { titulo: "Exercícios Respiratórios", sons: ["S Sustentado — Sssssssssssss", "S/X Staccato — S! S! S! S! X! X! X! X!"], obs: "Objetivos: controle do fluxo de ar · fortalecimento do suporte · coordenação respiratória · agilidade muscular" },
      { titulo: "Aquecimento Vocal — Ressonância Nasal", sons: ["Mmmmmmmmm", "Mmmmmmmmm (mastigado)"], obs: "Objetivos: ativação suave da voz · melhor percepção da ressonância" },
      { titulo: "Exercícios de Vibração Sonora", sons: ["Vvvvvvvvvv", "Zzzzzzzzzz", "Jjjjjjjjjjj"], obs: "Explore gradualmente: graves · médios · agudos — sempre sem esforço." },
      { titulo: "Exercício de Consciência Vocal", texto: "Escolha uma música simples e cante-a inteiramente utilizando apenas o som:", sons: ["Mmmmm"], obs: "Desenvolve: afinação · apoio respiratório · ressonância · uniformidade vocal" },
    ],
  },
  {
    nome: "Tarde",
    emoji: "☀️",
    subtitulo: "Coordenação e Flexibilidade",
    blocos: [
      { titulo: "Vibração de Língua / Vibração de Lábios", sons: ["Trrrrrrrrrrrr (língua)", "Brrrrrrrrrrrr (lábios)"] },
      { titulo: "Sequências Vocálicas", sons: ["Trrrrrá · Trrrrré · Trrrrrê · Trrrrrí · Trrrrró · Trrrrrô · Trrrrrú", "Brrrrrá · Brrrrré · Brrrrrê · Brrrrrí · Brrrrró · Brrrrrô · Brrrrrú"], obs: "Coordenação vocal · Equilíbrio respiratório · Flexibilidade muscular · Redução de tensões" },
    ],
  },
  {
    nome: "Noite",
    emoji: "🌙",
    subtitulo: "Relaxamento Vocal",
    blocos: [
      { titulo: "Bocejos Sonorizados Descendentes", texto: "Ao final do dia, permita que a musculatura vocal retorne ao estado de repouso.", sons: ["Ahhhh · Éhhhh · Êhhhh · Ihhhh · Óhhhh · Ôhhhh · Úhhhh"], obs: "Execute sem esforço, associando os sons a movimentos de espreguiçamento. Relaxamento laríngeo · Redução de tensões · Recuperação vocal" },
    ],
  },
];

const CUIDADOS = [
  { icon: "😴", titulo: "Sono", texto: "O descanso adequado favorece a recuperação física e vocal." },
  { icon: "💧", titulo: "Hidratação", texto: "Mantenha água por perto durante todo o dia. Pequenas quantidades consumidas regularmente são mais eficazes do que grandes volumes de uma só vez." },
  { icon: "🔇", titulo: "Ambientes Barulhentos", texto: "Evite competir com ruídos intensos. Quando necessário, aproxime-se da pessoa com quem está conversando." },
  { icon: "👔", titulo: "Vestuário", texto: "Evite roupas que comprimam excessivamente o pescoço, o tórax ou o abdômen." },
  { icon: "📅", titulo: "Prática Diária", texto: "O desenvolvimento vocal é resultado da repetição consciente. Poucos minutos diários produzem resultados mais consistentes do que longos períodos esporádicos de estudo." },
  { icon: "🍽️", titulo: "Alimentação (antes de cantar)", texto: "Prefira refeições leves. Observe alimentos que provocam refluxo ou desconforto. Conheça as respostas do seu próprio organismo." },
];

const ALERTAS = [
  "Rouquidão persistente",
  "Dor ao falar ou cantar",
  "Quebras frequentes da voz",
  "Sensação constante de esforço vocal",
  "Perda de extensão vocal",
];

const CONSOANTES_TABELA = {
  colunas: ["FRICATIVAS", "MODERADAS", "DURAS/PLOSIVAS"],
  linhas: [
    ["f, s, x, j, z, v", "m, n, nh, lh", "g, k, c, p, b, t, d"],
    ["Aumento do fluxo aéreo", "Regula fluxo aéreo", "Diminui fluxo aéreo"],
    ["Reduzem adução", "Equilibra adução", "Aumenta adução"],
    ["Alivia resistência PV", "Melhora resistência PV", "Estimula resistência PV"],
    ["Facilita alongamento PV", "Regula contração e alonga PV", "Facilita o encurtamento e contração PV"],
  ],
};

const NIVEL_OPTIONS = ["Iniciante", "Intermediário", "Avançado"];
const FREQ_OPTIONS = ["Raramente", "Às vezes", "Com frequência", "Sempre"];
const STATUS_OPTIONS = ["Em andamento", "Dominada", "Revisitar"];
const EVOLUCAO_OPTIONS = [
  { v: 1, label: "Ainda não senti" },
  { v: 2, label: "Um pouco" },
  { v: 3, label: "Sinto evolução" },
  { v: 4, label: "Muita evolução" },
];

const voxInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(180,120,255,0.2)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#f0e6ff",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
};

const voxFieldLabelStyle = { color: "#a085cc", fontSize: 13, marginBottom: 6, display: "block" };
const voxCardStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(180,120,255,0.15)", borderRadius: 20, padding: 24, marginBottom: 16 };
const voxEyebrowStyle = { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#a855f7", fontWeight: "bold", marginBottom: 4 };
const voxCardTitleStyle = { fontSize: 18, fontWeight: "bold", color: "#e0c8ff", marginBottom: 18 };

function CustomSelectVox({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ ...voxInputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        <span>{value}</span>
        <span style={{ color: "#a085cc", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: 12 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, marginTop: 6, zIndex: 30,
          background: "#1a0f2e", border: "1px solid rgba(180,120,255,0.25)", borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                cursor: "pointer",
                background: opt === value ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent",
                color: opt === value ? "#fff" : "#c0b0d8",
                fontWeight: opt === value ? "bold" : "normal",
              }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDataRegistro(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function getFrequency(note, octave) {
  const semitones = NOTAS.indexOf(note) - NOTAS.indexOf("A") + (octave - 4) * 12;
  return 440 * Math.pow(2, semitones / 12);
}

function detectNote(frequency) {
  if (!frequency || frequency < 80) return null;
  const semitones = Math.round(12 * Math.log2(frequency / 440));
  const noteIndex = ((semitones % 12) + 12) % 12;
  const octave = 4 + Math.floor((semitones + 9) / 12);
  const freq_target = getFrequency(NOTAS[noteIndex], octave);
  const cents = Math.round(1200 * Math.log2(frequency / freq_target));
  return { note: NOTAS[noteIndex], octave, cents, frequency };
}

export default function AulasCanto() {
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem("vox_welcome_seen");
    } catch (e) {
      return true;
    }
  });
  const [section, setSection] = useState("Aulas");
  const [aulaAberta, setAulaAberta] = useState(null);
  const [exAtivo, setExAtivo] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [afinando, setAfinando] = useState(false);
  const [periodoAtivo, setPeriodoAtivo] = useState("Manhã");

  // Área do Aluno
  const [alunoProfile, setAlunoProfile] = useState({ nome: "", inicio: "", objetivo: "", nivel: "Iniciante", estilos: "" });
  const [alunoSaude, setAlunoSaude] = useState({ queixas: "", frequencia: "Às vezes", observacoes: "" });
  const [alunoEvolucao, setAlunoEvolucao] = useState(3);
  const [alunoRelato, setAlunoRelato] = useState("");
  const [repertorio, setRepertorio] = useState([{ id: 1, musica: "", status: "Em andamento" }]);
  const [alunoSalvo, setAlunoSalvo] = useState(false);
  const [historico, setHistorico] = useState(() => {
    try {
      const saved = localStorage.getItem("vox_aluno_historico");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! Sou a professora Maria Diniz 🎤 Como posso te ajudar hoje? Pode me perguntar sobre técnica vocal, respiração, como melhorar seu agudo, ou qualquer dúvida sobre canto!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);
  const freqHistoryRef = useRef([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, timerRunning]);

  const startExercicio = (ex) => {
    setExAtivo(ex);
    setTimer(ex.duracao);
    setTimerRunning(true);
  };

  const stopExercicio = () => {
    setTimerRunning(false);
    setExAtivo(null);
    setTimer(0);
  };

  // Área do Aluno - handlers
  const addMusica = () => {
    setRepertorio(r => [...r, { id: Date.now(), musica: "", status: "Em andamento" }]);
  };
  const updateMusica = (id, field, value) => {
    setRepertorio(r => r.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };
  const removeMusica = (id) => {
    setRepertorio(r => r.filter(m => m.id !== id));
  };
  const handleSalvarAluno = () => {
    const novoRegistro = {
      id: Date.now(),
      data: new Date().toISOString(),
      nome: alunoProfile.nome,
      nivel: alunoProfile.nivel,
      objetivo: alunoProfile.objetivo,
      queixas: alunoSaude.queixas,
      frequenciaQueixas: alunoSaude.frequencia,
      evolucao: alunoEvolucao,
      relato: alunoRelato,
      repertorio: repertorio.filter(m => m.musica.trim()),
    };
    setHistorico(h => {
      const novo = [novoRegistro, ...h];
      try { localStorage.setItem("vox_aluno_historico", JSON.stringify(novo)); } catch (e) {}
      return novo;
    });
    setAlunoSalvo(true);
    setTimeout(() => setAlunoSalvo(false), 2500);
  };

  const removeRegistro = (id) => {
    setHistorico(h => {
      const novo = h.filter(r => r.id !== id);
      try { localStorage.setItem("vox_aluno_historico", JSON.stringify(novo)); } catch (e) {}
      return novo;
    });
  };

  // Afinador
  const startAfinador = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 4096;
      analyserRef.current.smoothingTimeConstant = 0.2;
      source.connect(analyserRef.current);
      freqHistoryRef.current = [];
      setAfinando(true);
      detectPitch();
    } catch (e) {
      alert("Permita o acesso ao microfone para usar o afinador.");
    }
  };

  const stopAfinador = () => {
    cancelAnimationFrame(rafRef.current);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    freqHistoryRef.current = [];
    setAfinando(false);
    setPitch(null);
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    const tick = () => {
      analyser.getFloatTimeDomainData(buffer);
      const freq = autoCorrelate(buffer, audioCtxRef.current.sampleRate);

      if (freq > 0) {
        const hist = freqHistoryRef.current;
        hist.push(freq);
        if (hist.length > 8) hist.shift();

        const sorted = [...hist].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];

        if (hist.length < 3 || Math.abs(1200 * Math.log2(freq / median)) < 150) {
          setPitch(detectNote(median));
        }
      } else {
        freqHistoryRef.current = [];
        setPitch(null);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  function autoCorrelate(buffer, sampleRate) {
    let SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.015) return -1;

    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length;
    if (SIZE < 8) return -1;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] += buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (d + 1 < SIZE && c[d] > c[d + 1]) d++;

    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    if (maxpos <= 0) return -1;

    let T0 = maxpos;
    const x1 = c[T0 - 1] ?? c[T0];
    const x2 = c[T0];
    const x3 = c[T0 + 1] ?? c[T0];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    const freqOut = sampleRate / T0;

    if (freqOut < 70 || freqOut > 1100) return -1;

    return freqOut;
  }

  // IA Chat
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.reply || "Desculpa, não consegui responder agora.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Ops, tive um problema de conexão com a IA. Verifique se configurou a API Key no Vercel!" }]);
    }
    setLoading(false);
  };

  const centsColor = (cents) => {
    if (!cents && cents !== 0) return "#888";
    const abs = Math.abs(cents);
    if (abs < 10) return "#4ade80";
    if (abs < 25) return "#facc15";
    return "#f87171";
  };

  const centsLabel = (cents) => {
    if (!cents && cents !== 0) return "";
    if (Math.abs(cents) < 10) return "Afinado! 🎯";
    if (cents > 0) return `+${cents}¢ (alto demais)`;
    return `${cents}¢ (baixo demais)`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c1a 0%, #1a0f2e 50%, #0f1a2e 100%)",
      fontFamily: "'Georgia', serif",
      color: "#f0e6ff",
    }}>
      {/* Modal de Boas-vindas */}
      {showWelcome && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,6,20,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: 24,
        }}>
          <div style={{
            background: "linear-gradient(160deg, #1a0f2e, #150c26)",
            border: "1px solid rgba(180,120,255,0.25)",
            borderRadius: 24,
            padding: "36px 28px",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎤</div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#e0c8ff", marginBottom: 14 }}>Boas vindas</div>
            <div style={{ color: "#c0b0d8", lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
              Bem-vindo ao seu app de canto! Aqui você pratica técnica vocal, afinação, respiração e interpretação — tudo cronometrado. Anota seu desenvolvimento, repertório e tons favoritos. E tem uma assistente IA para responder todas as suas dúvidas sobre técnica e Canto. Bons treinos!
            </div>
            <button onClick={() => {
              try { localStorage.setItem("vox_welcome_seen", "1"); } catch (e) {}
              setShowWelcome(false);
            }} style={{
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              border: "none",
              color: "#fff",
              borderRadius: 24,
              padding: "12px 36px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: "bold",
              boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
            }}>Começar</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(180,120,255,0.2)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontSize: 32 }}>🎤</span>
        <div>
          <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 1, color: "#e0c8ff" }}>MARIA DINIZ</div>
          <div style={{ fontSize: 12, color: "#a085cc", letterSpacing: 2 }}>APP DE CANTO</div>
        </div>
      </div>

      {/* Nav */}
      <style>{`.vox-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div className="vox-nav-scroll" style={{
        display: "flex",
        gap: 8,
        padding: "16px 24px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)} style={{
            background: section === s ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.06)",
            color: section === s ? "#fff" : "#c0a0e0",
            border: section === s ? "none" : "1px solid rgba(180,120,255,0.2)",
            borderRadius: 24,
            padding: "10px 20px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            whiteSpace: "nowrap",
            fontWeight: section === s ? "bold" : "normal",
            transition: "all 0.2s",
            boxShadow: section === s ? "0 4px 20px rgba(168,85,247,0.4)" : "none",
          }}>{s}</button>
        ))}
      </div>

      <div style={{ padding: "0 24px 40px" }}>

        {/* ===== AULAS ===== */}
        {section === "Aulas" && (
          <div>
            {aulaAberta ? (
              <div>
                <button onClick={() => setAulaAberta(null)} style={{
                  background: "none", border: "1px solid rgba(180,120,255,0.3)", color: "#c0a0e0",
                  borderRadius: 20, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", marginBottom: 20
                }}>← Voltar</button>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 24, border: "1px solid rgba(180,120,255,0.15)" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{aulaAberta.emoji}</div>
                  <div style={{ fontSize: 22, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>{aulaAberta.titulo}</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <span style={{ background: "rgba(124,58,237,0.3)", color: "#c0a0e0", borderRadius: 12, padding: "4px 12px", fontSize: 12 }}>{aulaAberta.nivel}</span>
                    <span style={{ background: "rgba(255,255,255,0.08)", color: "#c0a0e0", borderRadius: 12, padding: "4px 12px", fontSize: 12 }}>⏱ {aulaAberta.duracao}</span>
                  </div>
                  <p style={{ color: "#c0b0d8", lineHeight: 1.7, marginBottom: 20 }}>{aulaAberta.descricao}</p>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: "#e0c8ff", marginBottom: 12 }}>📋 Passo a passo:</div>
                  {aulaAberta.topicos.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ color: "#c0b0d8", lineHeight: 1.6, paddingTop: 4 }}>{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Suas Aulas</div>
                  <div style={{ color: "#a085cc", fontSize: 14 }}>Do iniciante ao avançado</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {AULAS.map(a => (
                    <div key={a.id} onClick={() => setAulaAberta(a)} style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(180,120,255,0.15)",
                      borderRadius: 18,
                      padding: 20,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    >
                      <div style={{ fontSize: 36 }}>{a.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>{a.titulo}</div>
                        <div style={{ color: "#a085cc", fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>{a.descricao.substring(0, 70)}...</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span style={{ background: "rgba(124,58,237,0.25)", color: "#c0a0e0", borderRadius: 10, padding: "3px 10px", fontSize: 11 }}>{a.nivel}</span>
                          <span style={{ background: "rgba(255,255,255,0.07)", color: "#a085cc", borderRadius: 10, padding: "3px 10px", fontSize: 11 }}>⏱ {a.duracao}</span>
                        </div>
                      </div>
                      <div style={{ color: "#7c3aed", fontSize: 20 }}>›</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== EXERCÍCIOS ===== */}
        {section === "Exercícios" && (
          <div>
            {exAtivo ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>{exAtivo.emoji}</div>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#e0c8ff", marginBottom: 8 }}>{exAtivo.nome}</div>
                <div style={{ color: "#a085cc", marginBottom: 24, lineHeight: 1.6 }}>{exAtivo.instrucao}</div>
                <div style={{
                  width: 160, height: 160, borderRadius: "50%", margin: "0 auto 24px",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 40px rgba(168,85,247,0.5)",
                  animation: timerRunning ? "pulse 2s infinite" : "none",
                }}>
                  <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 40px rgba(168,85,247,0.5)} 50%{box-shadow:0 0 70px rgba(168,85,247,0.8)} }`}</style>
                  <div style={{ fontSize: 40, fontWeight: "bold" }}>{formatTime(timer)}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>restantes</div>
                </div>
                {timer === 0 && <div style={{ color: "#4ade80", fontSize: 18, marginBottom: 16 }}>✅ Exercício concluído!</div>}
                <button onClick={stopExercicio} style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#f0e6ff", borderRadius: 24, padding: "12px 32px", cursor: "pointer", fontFamily: "inherit", fontSize: 16
                }}>← Voltar</button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Exercícios de Vocalização</div>
                  <div style={{ color: "#a085cc", fontSize: 14 }}>Toque para iniciar com timer</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {EXERCICIOS.map(ex => (
                    <div key={ex.id} onClick={() => startExercicio(ex)} style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(180,120,255,0.15)",
                      borderRadius: 16,
                      padding: "16px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    >
                      <span style={{ fontSize: 32 }}>{ex.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: "#e0c8ff", marginBottom: 2 }}>{ex.nome}</div>
                        <div style={{ color: "#a085cc", fontSize: 13 }}>{ex.descricao}</div>
                      </div>
                      <div style={{ background: "rgba(124,58,237,0.3)", color: "#c0a0e0", borderRadius: 12, padding: "4px 12px", fontSize: 13, whiteSpace: "nowrap" }}>
                        {formatTime(ex.duracao)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== AFINADOR ===== */}
        {section === "Afinador" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Afinador de Voz</div>
              <div style={{ color: "#a085cc", fontSize: 14 }}>Cante uma nota e veja se está afinado</div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(180,120,255,0.2)",
              borderRadius: 28,
              padding: 32,
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 80, fontWeight: "bold", color: pitch ? centsColor(pitch.cents) : "#3a3050", marginBottom: 8, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.15s" }}>
                {pitch ? pitch.note : "—"}
              </div>
              {pitch && (
                <div style={{ color: "#a085cc", fontSize: 14, marginBottom: 4 }}>
                  Oitava {pitch.octave} • {Math.round(pitch.frequency)} Hz
                </div>
              )}
              <div style={{ color: centsColor(pitch?.cents), fontSize: 16, minHeight: 28, fontWeight: "bold" }}>
                {pitch ? centsLabel(pitch.cents) : (afinando ? "Aguardando nota..." : "Inicie o afinador")}
              </div>

              {pitch && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b5080", fontSize: 11, marginBottom: 8 }}>
                    <span>-50¢</span><span>0</span><span>+50¢</span>
                  </div>
                  <div style={{ position: "relative", height: 16, background: "rgba(255,255,255,0.08)", borderRadius: 8, overflow: "visible" }}>
                    <div style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      width: 4,
                      height: "100%",
                      background: "rgba(255,255,255,0.25)",
                      transform: "translateX(-50%)",
                    }} />
                    <div style={{
                      position: "absolute",
                      left: `${50 + (Math.max(-50, Math.min(50, pitch.cents)) / 50) * 50}%`,
                      top: -4,
                      width: 24,
                      height: 24,
                      background: centsColor(pitch.cents),
                      borderRadius: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: `0 0 12px ${centsColor(pitch.cents)}`,
                      transition: "left 0.15s ease-out, background 0.15s",
                    }} />
                  </div>
                </div>
              )}
            </div>

            <button onClick={afinando ? stopAfinador : startAfinador} style={{
              background: afinando ? "rgba(248,113,113,0.2)" : "linear-gradient(135deg,#7c3aed,#a855f7)",
              border: afinando ? "1px solid rgba(248,113,113,0.5)" : "none",
              color: "#fff",
              borderRadius: 28,
              padding: "16px 48px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 18,
              boxShadow: afinando ? "none" : "0 8px 24px rgba(168,85,247,0.4)",
            }}>
              {afinando ? "⏹ Parar" : "🎙 Iniciar Afinador"}
            </button>
            <div style={{ color: "#6b5080", fontSize: 12, marginTop: 12 }}>
              Requer permissão de microfone
            </div>
          </div>
        )}

        {/* ===== ROTINA VOCAL ===== */}
        {section === "Rotina Vocal" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Rotina Vocal Diária</div>
              <div style={{ color: "#a085cc", fontSize: 14, lineHeight: 1.6 }}>
                Mais importante do que a intensidade dos exercícios é a constância da prática. Dedique alguns minutos diariamente ao cuidado da sua voz.
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: "bold", color: "#e0c8ff", marginBottom: 10 }}>Pilares de uma Voz Saudável</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {PILARES.map((p, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(180,120,255,0.15)", borderRadius: 14, padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold", color: "#e0c8ff", fontSize: 14, marginBottom: 2 }}>{p.titulo}</div>
                    <div style={{ color: "#a085cc", fontSize: 13, lineHeight: 1.5 }}>{p.texto}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 15, fontWeight: "bold", color: "#e0c8ff", marginBottom: 10 }}>Rotina por Período</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {PERIODOS.map(p => (
                <button key={p.nome} onClick={() => setPeriodoAtivo(p.nome)} style={{
                  flex: 1,
                  background: periodoAtivo === p.nome ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.06)",
                  color: periodoAtivo === p.nome ? "#fff" : "#c0a0e0",
                  border: periodoAtivo === p.nome ? "none" : "1px solid rgba(180,120,255,0.2)",
                  borderRadius: 16,
                  padding: "10px 8px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: "bold",
                }}>{p.emoji} {p.nome}</button>
              ))}
            </div>

            {PERIODOS.filter(p => p.nome === periodoAtivo).map(p => (
              <div key={p.nome} style={{ marginBottom: 24 }}>
                <div style={{ color: "#a085cc", fontSize: 13, marginBottom: 12, fontStyle: "italic" }}>{p.subtitulo}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {p.blocos.map((b, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(180,120,255,0.15)", borderRadius: 16, padding: 18 }}>
                      <div style={{ fontWeight: "bold", color: "#e0c8ff", fontSize: 14, marginBottom: 8 }}>{b.titulo}</div>
                      {b.texto && <div style={{ color: "#c0b0d8", fontSize: 13, lineHeight: 1.6, marginBottom: b.lista || b.sons ? 10 : 0 }}>{b.texto}</div>}
                      {b.lista && (
                        <div style={{ marginBottom: 10 }}>
                          {b.lista.map((l, j) => (
                            <div key={j} style={{ display: "flex", gap: 8, color: "#c0b0d8", fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>
                              <span style={{ color: "#a855f7" }}>•</span><span>{l}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {b.sons && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                          {b.sons.map((s, j) => (
                            <div key={j} style={{ background: "rgba(124,58,237,0.2)", color: "#e0c8ff", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "monospace" }}>{s}</div>
                          ))}
                        </div>
                      )}
                      {b.obs && <div style={{ color: "#7c6a94", fontSize: 12, lineHeight: 1.5 }}>{b.obs}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ fontSize: 15, fontWeight: "bold", color: "#e0c8ff", marginBottom: 10 }}>Hábitos que Fortalecem sua Voz</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {CUIDADOS.map((c, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(180,120,255,0.15)", borderRadius: 14, padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold", color: "#e0c8ff", fontSize: 14, marginBottom: 2 }}>{c.titulo}</div>
                    <div style={{ color: "#a085cc", fontSize: 13, lineHeight: 1.5 }}>{c.texto}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: 18, marginBottom: 24 }}>
              <div style={{ fontWeight: "bold", color: "#f87171", fontSize: 14, marginBottom: 10 }}>⚠️ Quando Procurar Ajuda Profissional</div>
              {ALERTAS.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 8, color: "#e8b8b8", fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>
                  <span>•</span><span>{a}</span>
                </div>
              ))}
              <div style={{ color: "#e8b8b8", fontSize: 12, marginTop: 10 }}>Profissionais indicados: Otorrinolaringologista · Fonoaudiólogo especializado em voz</div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))", border: "1px solid rgba(180,120,255,0.3)", borderRadius: 20, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>♥</div>
              <div style={{ color: "#e0c8ff", fontSize: 14, lineHeight: 1.8 }}>
                A voz é a expressão sonora da sua identidade. Cultive hábitos saudáveis, pratique com regularidade e desenvolva sua técnica com paciência.
                <br /><br />
                <strong>Cuide da sua voz. Ela é única.</strong>
              </div>
            </div>
          </div>
        )}

        {/* ===== CONSOANTES ===== */}
        {section === "Consoantes" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Tabela de Consoantes</div>
              <div style={{ color: "#a085cc", fontSize: 14 }}>Funcionalidade das consoantes no fluxo vocal</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(180,120,255,0.15)", borderRadius: 16, overflow: "hidden", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr>
                    {CONSOANTES_TABELA.colunas.map((c, i) => (
                      <th key={i} style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "#fff", textAlign: "left", padding: "14px 16px", fontSize: 13, letterSpacing: 0.5 }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONSOANTES_TABELA.linhas.map((linha, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "rgba(124,58,237,0.08)" : "transparent" }}>
                      {linha.map((valor, j) => (
                        <td key={j} style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: j === 0 ? "#e0c8ff" : "#c0b0d8",
                          fontWeight: j === 0 ? "bold" : "normal",
                          borderTop: "1px solid rgba(180,120,255,0.1)",
                        }}>{valor}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ color: "#7c6a94", fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
              PV = pregas vocais. Fricativas facilitam o fluxo aéreo e relaxam a musculatura; consoantes duras/plosivas exigem mais fechamento glótico.
            </div>
          </div>
        )}

        {/* ===== ÁREA DO ALUNO ===== */}
        {section === "Área do Aluno" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Área do Aluno</div>
              <div style={{ color: "#a085cc", fontSize: 14 }}>Acompanhe sua jornada vocal — do primeiro aquecimento à voz que você quer ter.</div>
            </div>

            {/* Perfil */}
            <div style={voxCardStyle}>
              <div style={voxEyebrowStyle}>PERFIL</div>
              <div style={voxCardTitleStyle}>Sobre você e seus objetivos</div>

              <div style={{ marginBottom: 16 }}>
                <span style={voxFieldLabelStyle}>Nome</span>
                <input style={voxInputStyle} placeholder="Seu nome" value={alunoProfile.nome} onChange={e => setAlunoProfile({ ...alunoProfile, nome: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <span style={voxFieldLabelStyle}>Início dos estudos</span>
                  <input type="date" style={{ ...voxInputStyle, colorScheme: "dark" }} value={alunoProfile.inicio} onChange={e => setAlunoProfile({ ...alunoProfile, inicio: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={voxFieldLabelStyle}>Nível</span>
                  <CustomSelectVox value={alunoProfile.nivel} onChange={v => setAlunoProfile({ ...alunoProfile, nivel: v })} options={NIVEL_OPTIONS} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={voxFieldLabelStyle}>O que você quer melhorar na voz?</span>
                <textarea style={{ ...voxInputStyle, minHeight: 80, resize: "none" }} placeholder="Ex: projeção, afinação, alcance de notas agudas..." value={alunoProfile.objetivo} onChange={e => setAlunoProfile({ ...alunoProfile, objetivo: e.target.value })} />
              </div>

              <div>
                <span style={voxFieldLabelStyle}>Estilos que mais gosta de cantar</span>
                <input style={voxInputStyle} placeholder="Ex: pop, MPB, gospel..." value={alunoProfile.estilos} onChange={e => setAlunoProfile({ ...alunoProfile, estilos: e.target.value })} />
              </div>
            </div>

            {/* Saúde vocal */}
            <div style={voxCardStyle}>
              <div style={voxEyebrowStyle}>SAÚDE VOCAL</div>
              <div style={voxCardTitleStyle}>Dores e queixas</div>

              <div style={{ marginBottom: 16 }}>
                <span style={voxFieldLabelStyle}>Descreva o que está sentindo</span>
                <textarea style={{ ...voxInputStyle, minHeight: 80, resize: "none" }} placeholder="Ex: rouquidão, cansaço ao cantar, falta de ar..." value={alunoSaude.queixas} onChange={e => setAlunoSaude({ ...alunoSaude, queixas: e.target.value })} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={voxFieldLabelStyle}>Com que frequência isso acontece?</span>
                <CustomSelectVox value={alunoSaude.frequencia} onChange={v => setAlunoSaude({ ...alunoSaude, frequencia: v })} options={FREQ_OPTIONS} />
              </div>

              <div>
                <span style={voxFieldLabelStyle}>Observações (opcional)</span>
                <textarea style={{ ...voxInputStyle, minHeight: 60, resize: "none" }} placeholder="Algo mais que queira contar sobre sua voz?" value={alunoSaude.observacoes} onChange={e => setAlunoSaude({ ...alunoSaude, observacoes: e.target.value })} />
              </div>
            </div>

            {/* Evolução */}
            <div style={voxCardStyle}>
              <div style={voxEyebrowStyle}>EVOLUÇÃO</div>
              <div style={voxCardTitleStyle}>Como você sente sua voz agora?</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {EVOLUCAO_OPTIONS.map(opt => (
                  <button key={opt.v} onClick={() => setAlunoEvolucao(opt.v)} style={{
                    background: alunoEvolucao === opt.v ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.06)",
                    color: alunoEvolucao === opt.v ? "#fff" : "#a085cc",
                    border: alunoEvolucao === opt.v ? "none" : "1px solid rgba(180,120,255,0.2)",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: alunoEvolucao === opt.v ? "bold" : "normal",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}>{opt.label}</button>
                ))}
              </div>

              <div>
                <span style={voxFieldLabelStyle}>Conte um pouco mais: o que tem cantado, como foi a semana</span>
                <textarea style={{ ...voxInputStyle, minHeight: 90, resize: "none" }} placeholder="Relate livremente seu progresso, dificuldades ou conquistas..." value={alunoRelato} onChange={e => setAlunoRelato(e.target.value)} />
              </div>
            </div>

            {/* Repertório */}
            <div style={voxCardStyle}>
              <div style={voxEyebrowStyle}>REPERTÓRIO</div>
              <div style={voxCardTitleStyle}>Músicas em estudo</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {repertorio.map(m => (
                  <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input style={{ ...voxInputStyle, flex: 1 }} placeholder="Nome da música" value={m.musica} onChange={e => updateMusica(m.id, "musica", e.target.value)} />
                    <div style={{ width: 150, flexShrink: 0 }}>
                      <CustomSelectVox value={m.status} onChange={v => updateMusica(m.id, "status", v)} options={STATUS_OPTIONS} />
                    </div>
                    {repertorio.length > 1 && (
                      <button onClick={() => removeMusica(m.id)} style={{ background: "none", border: "none", color: "#a085cc", fontSize: 16, cursor: "pointer", padding: 8, flexShrink: 0 }}>✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addMusica} style={{ background: "none", border: "none", color: "#a855f7", fontSize: 14, cursor: "pointer", padding: 0, textAlign: "left", marginTop: 4, fontFamily: "inherit", fontWeight: "bold" }}>
                  + Adicionar música
                </button>
              </div>
            </div>

            {/* Salvar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button onClick={handleSalvarAluno} style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                border: "none",
                color: "#fff",
                borderRadius: 24,
                padding: "14px 32px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: "bold",
                boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
              }}>Salvar registro</button>
              {alunoSalvo && <span style={{ color: "#4ade80", fontSize: 14, fontWeight: "bold" }}>Registro salvo ✓</span>}
            </div>

            {/* Histórico de registros */}
            <div style={voxCardStyle}>
              <div style={voxEyebrowStyle}>HISTÓRICO</div>
              <div style={voxCardTitleStyle}>
                {historico.length > 0 ? `Registros salvos (${historico.length})` : "Nenhum registro ainda"}
              </div>
              {historico.length === 0 ? (
                <div style={{ color: "#a085cc", fontSize: 13, lineHeight: 1.6 }}>
                  Assim que você clicar em "Salvar registro", cada anotação fica guardada aqui — assim dá pra acompanhar sua evolução ao longo do tempo.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {historico.map(r => (
                    <div key={r.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,120,255,0.12)", borderRadius: 14, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#a085cc", fontSize: 12 }}>{formatDataRegistro(r.data)}</span>
                        <button onClick={() => removeRegistro(r.id)} style={{ background: "none", border: "none", color: "#a085cc", cursor: "pointer", fontSize: 14, padding: 4 }}>✕</button>
                      </div>
                      <div style={{ color: "#e0c8ff", fontSize: 13, fontWeight: "bold", marginBottom: 6 }}>
                        {EVOLUCAO_OPTIONS.find(o => o.v === r.evolucao)?.label || ""}
                      </div>
                      {r.relato && <div style={{ color: "#c0b0d8", fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{r.relato}</div>}
                      {r.queixas && <div style={{ color: "#c0b0d8", fontSize: 12, lineHeight: 1.5, marginBottom: 6 }}>🩺 {r.queixas}</div>}
                      {r.repertorio.length > 0 && (
                        <div style={{ color: "#7c6a94", fontSize: 12, marginTop: 4 }}>
                          🎵 {r.repertorio.map(m => m.musica).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== IA PROFESSORA ===== */}
        {section === "IA Professora" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 2 }}>🎤 Professora Maria Diniz</div>
              <div style={{ color: "#a085cc", fontSize: 13 }}>IA especialista em técnica vocal</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "assistant" && (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 8, flexShrink: 0 }}>🎤</div>
                  )}
                  <div style={{
                    background: m.role === "user" ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.07)",
                    color: "#f0e6ff",
                    borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    padding: "12px 16px",
                    maxWidth: "78%",
                    fontSize: 14,
                    lineHeight: 1.6,
                    border: m.role === "assistant" ? "1px solid rgba(180,120,255,0.15)" : "none",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>🎤</div>
                  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "20px 20px 20px 4px", padding: "12px 20px", border: "1px solid rgba(180,120,255,0.15)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", animation: `bounce 1s ${i * 0.2}s infinite` }} />
                      ))}
                      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: "1px solid rgba(180,120,255,0.15)" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Pergunte sobre técnica vocal..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(180,120,255,0.2)",
                  borderRadius: 24,
                  padding: "12px 20px",
                  color: "#f0e6ff",
                  fontFamily: "inherit",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                fontSize: 20,
                flexShrink: 0,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}>➤</button>
            </div>
          </div>
        )}

        {/* ===== SOBRE MIM ===== */}
        {section === "Sobre Mim" && (
          <div>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(180,120,255,0.15)",
              borderRadius: 24,
              padding: 28,
              textAlign: "center",
              marginBottom: 20,
            }}>
              <div style={{
                width: 112, height: 112, borderRadius: "50%", margin: "0 auto 16px",
                overflow: "hidden",
                border: "3px solid rgba(180,120,255,0.4)",
                boxShadow: "0 8px 30px rgba(168,85,247,0.4)",
              }}>
                <img src="/maria-diniz.jpg" alt="Maria Diniz" style={{
                  width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%",
                }} />
              </div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#e0c8ff", marginBottom: 4 }}>Maria Diniz</div>
              <div style={{ color: "#a085cc", fontSize: 13, letterSpacing: 1 }}>CANTORA & PROFESSORA DE CANTO</div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(180,120,255,0.15)",
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "#e0c8ff", marginBottom: 14 }}>Sobre mim</div>
              <p style={{ color: "#c0b0d8", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                Sou cantora e professora de canto há mais de 20 anos. Já trabalhei com grandes artistas nacionais e internacionais.
              </p>

              <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>📺</div>
                <div style={{ color: "#c0b0d8", lineHeight: 1.7, fontSize: 15 }}>
                  Por 8 anos ensaiei os elencos das novelas infanto-juvenis do SBT: <strong style={{ color: "#e0c8ff" }}>Chiquititas, Carrossel, As Aventuras de Poliana</strong> e <strong style={{ color: "#e0c8ff" }}>Carinha de Anjo</strong>.
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>🌍</div>
                <div style={{ color: "#c0b0d8", lineHeight: 1.7, fontSize: 15 }}>
                  Dou aulas online e presenciais para alunos do Brasil e do exterior <span style={{ color: "#a085cc" }}>(Suíça, Miami, Texas, Canadá…)</span>.
                </div>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))",
              border: "1px solid rgba(180,120,255,0.3)",
              borderRadius: 20,
              padding: 28,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#e0c8ff", marginBottom: 16 }}>Quer ter aula comigo?</div>
              <a href="https://instagram.com/mariadinizcantora" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "#fff",
                borderRadius: 24,
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: "bold",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
              }}>
                📷 @mariadinizcantora
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div style={{
        borderTop: "1px solid rgba(180,120,255,0.12)",
        padding: "20px 24px 28px",
        textAlign: "center",
      }}>
        <div style={{ color: "#6b5080", fontSize: 12, marginBottom: 10 }}>
          App desenvolvido por Caique Feitosa
        </div>
        <a href="https://wa.link/dgrrj8" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(180,120,255,0.15)",
          color: "#a085cc",
          borderRadius: 20,
          padding: "7px 16px",
          fontSize: 12,
          textDecoration: "none",
          fontFamily: "inherit",
        }}>
          💬 Falar com o desenvolvedor
        </a>
      </div>
    </div>
  );
}
