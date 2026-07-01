// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const SECTIONS = ["Aulas", "Exercícios", "Afinador", "IA Professora"];

const AULAS = [
  {
    id: 1,
    titulo: "Respiração Diafragmática",
    nivel: "Iniciante",
    duracao: "15 min",
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
    duracao: "20 min",
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
    duracao: "30 min",
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
    duracao: "25 min",
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
  { id: 1, nome: "Sirene", descricao: "Glissando do grave ao agudo em 'wooo'", duracao: 30, emoji: "🚨", instrucao: "Faça um som de sirene, subindo do grave ao agudo e voltando suavemente. Mantenha a boca relaxada." },
  { id: 2, nome: "Lip Trill", descricao: "Vibração dos lábios em escala", duracao: 45, emoji: "💋", instrucao: "Solte os lábios vibrando como um motor enquanto canta uma escala. Ajuda a relaxar a laringe." },
  { id: 3, nome: "Vocalise Mi-Ma-Mo", descricao: "Articulação e abertura da boca", duracao: 60, emoji: "🗣️", instrucao: "Cante 'mi-ma-mo' em cada nota de uma escala. Exagere na abertura da boca no 'ma'." },
  { id: 4, nome: "Escala de Dó", descricao: "Escala maior ascendente e descendente", duracao: 90, emoji: "🎼", instrucao: "Sobe: Dó Ré Mi Fá Sol Lá Si Dó. Desce: Dó Si Lá Sol Fá Mi Ré Dó. Use vogal 'A' aberta." },
  { id: 5, nome: "Staccato", descricao: "Notas curtas e articuladas em 'ha'", duracao: 45, emoji: "⚡", instrucao: "Cante 'ha-ha-ha-ha-ha' rápido e articulado, cada nota separada. Fortalece o suporte do diafragma." },
  { id: 6, nome: "Messa di Voce", descricao: "Crescendo e decrescendo em uma nota", duracao: 60, emoji: "🌊", instrucao: "Sustente uma nota começando suave (piano), aumente até forte (forte), depois volte ao suave. Controle total do fôlego." },
];

const NOTAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FREQ_BASE = { A4: 440 };

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

  // Afinador
  const startAfinador = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);
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
    setAfinando(false);
    setPitch(null);
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    const tick = () => {
      analyser.getFloatTimeDomainData(buffer);
      const freq = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
      setPitch(freq > 0 ? detectNote(freq) : null);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  function autoCorrelate(buffer, sampleRate) {
    let SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;
    let r1 = 0, r2 = SIZE - 1;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < 0.2) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < 0.2) { r2 = SIZE - i; break; }
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length;
    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - i; j++) c[i] += buffer[j] * buffer[j + i];
    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    let T0 = maxpos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2, b = (x3 - x1) / 2;
    if (a) T0 -= b / (2 * a);
    return sampleRate / T0;
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
      <div style={{ display: "flex", gap: 8, padding: "16px 24px", overflowX: "auto" }}>
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
                  <div style={{ fontSize: 48, fontWeight: "bold" }}>{timer}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>segundos</div>
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
                        {ex.duracao}s
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

            {/* Display principal */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(180,120,255,0.2)",
              borderRadius: 28,
              padding: 32,
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 80, fontWeight: "bold", color: pitch ? centsColor(pitch.cents) : "#3a3050", marginBottom: 8, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.3s" }}>
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

              {/* Barra de cents */}
              {pitch && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b5080", fontSize: 11, marginBottom: 8 }}>
                    <span>-50¢</span><span>0</span><span>+50¢</span>
                  </div>
                  <div style={{ position: "relative", height: 16, background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
                    <div style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      width: 4,
                      height: "100%",
                      background: "rgba(255,255,255,0.2)",
                      transform: "translateX(-50%)",
                    }} />
                    <div style={{
                      position: "absolute",
                      left: `${50 + Math.max(-50, Math.min(50, pitch.cents))}%`,
                      top: -4,
                      width: 24,
                      height: 24,
                      background: centsColor(pitch.cents),
                      borderRadius: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: `0 0 12px ${centsColor(pitch.cents)}`,
                      transition: "left 0.1s",
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

        {/* ===== IA PROFESSORA ===== */}
        {section === "IA Professora" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e0c8ff", marginBottom: 2 }}>🎤 Professora Maria Diniz</div>
              <div style={{ color: "#a085cc", fontSize: 13 }}>IA especialista em técnica vocal</div>
            </div>

            {/* Chat */}
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

            {/* Input */}
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
      </div>
    </div>
  );
}
