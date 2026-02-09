import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Brain, Calculator, User, ArrowRight, Activity, AlertCircle } from 'lucide-react';

const App = () => {
  // Model state (Simulated Weights based on the provided logic)
  const [weights, setWeights] = useState({ w1: 0.15, w2: -12.5, b: 18.2 });
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  // User inputs
  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(1.75);

  // Historical data for charts
  const [history, setHistory] = useState([]);

  // Training Data (from provided Python code)
  const trainingData = [
    { x: [50.0, 1.50], y: 22.22 },
    { x: [60.0, 1.60], y: 23.44 },
    { x: [70.0, 1.70], y: 24.22 },
    { x: [80.0, 1.80], y: 24.69 },
    { x: [90.0, 1.90], y: 24.93 },
    { x: [45.0, 1.55], y: 18.73 },
    { x: [65.0, 1.65], y: 23.88 },
    { x: [75.0, 1.75], y: 24.49 },
    { x: [85.0, 1.85], y: 24.84 },
    { x: [100.0, 1.70], y: 34.60 }
  ];

  // Logic: Traditional Formula
  const calcularTradicional = (p, a) => {
    if (a === 0) return 0;
    return p / (a * a);
  };

  // Logic: AI Model (Linear Regression: y = x1*w1 + x2*w2 + b)
  const calcularIA = (p, a) => {
    return (p * weights.w1) + (a * weights.w2) + weights.b;
  };

  const tradicionalActual = calcularTradicional(peso, altura);
  const iaActual = calcularIA(peso, altura);
  const diferencia = Math.abs(tradicionalActual - iaActual);

  // Simulation of Training (to update weights visually)
  const runTraining = () => {
    setIsTraining(true);
    setProgress(0);
    
    // Initial random-ish weights
    let w1 = Math.random();
    let w2 = -Math.random() * 10;
    let b = Math.random() * 20;
    
    let step = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      step++;
      setProgress(step);
      
      // Gradually move towards values that approximate IMC for the sample data
      // Target values found via gradient descent in the original script
      w1 += (0.33 - w1) * 0.1; 
      w2 += (-16.5 - w2) * 0.1;
      b += (25.4 - b) * 0.1;

      setWeights({ w1, w2, b });

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 30);
  };

  // Update history when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(prev => {
        const newData = [...prev, {
          name: `${peso}kg/${altura}m`,
          ia: parseFloat(iaActual.toFixed(2)),
          tradicional: parseFloat(tradicionalActual.toFixed(2))
        }].slice(-10); // Keep last 10
        return newData;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [peso, altura]);

  const barData = [
    { name: 'Tradicional', valor: tradicionalActual, color: '#3b82f6' },
    { name: 'IA (Modelo)', valor: iaActual, color: '#8b5cf6' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-500" />
              Simulador IMC: IA vs Tradicional
            </h1>
            <p className="text-slate-500">Comparativa de cálculo matemático frente a regresión lineal de TensorFlow.</p>
          </div>
          <button 
            onClick={runTraining}
            disabled={isTraining}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              isTraining ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            <Brain size={18} />
            {isTraining ? `Entrenando ${progress}%...` : 'Re-entrenar Modelo'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
              <User size={20} className="text-slate-400" />
              Parámetros de Entrada
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Peso: {peso} kg</label>
                <input 
                  type="range" min="30" max="150" step="1"
                  value={peso} onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Altura: {altura} m</label>
                <input 
                  type="range" min="1.0" max="2.2" step="0.01"
                  value={altura} onChange={(e) => setAltura(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8">
              <h3 className="text-blue-800 font-semibold text-sm mb-2 flex items-center gap-1">
                <Brain size={14} /> Estado del Modelo (Pesos)
              </h3>
              <div className="text-xs font-mono text-blue-700 space-y-1">
                <p>W1 (Peso): {weights.w1.toFixed(4)}</p>
                <p>W2 (Altura): {weights.w2.toFixed(4)}</p>
                <p>b (Sesgo): {weights.b.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Real-time Comparison */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Traditional Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calculator size={80} />
              </div>
              <span className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-2">Fórmula Tradicional</span>
              <div className="text-5xl font-black text-slate-800 mb-2">
                {tradicionalActual.toFixed(2)}
              </div>
              <p className="text-slate-400 text-sm italic">P / Altura²</p>
            </div>

            {/* AI Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={80} />
              </div>
              <span className="text-purple-500 font-bold uppercase tracking-wider text-xs mb-2">IA (TensorFlow)</span>
              <div className="text-5xl font-black text-slate-800 mb-2">
                {iaActual.toFixed(2)}
              </div>
              <p className="text-slate-400 text-sm italic">W · X + b</p>
            </div>

            {/* Analysis Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
              <h3 className="text-slate-700 font-semibold mb-6 flex justify-between items-center">
                Comparativa Visual
                <span className={`text-xs px-2 py-1 rounded-full ${diferencia < 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  Diferencia: {diferencia.toFixed(4)}
                </span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 45]} hide />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={40}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* History Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-6">Historial de Predicciones</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="tradicional" 
                  name="Tradicional" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="ia" 
                  name="IA (TensorFlow)" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#8b5cf6' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Section */}
        <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-500 pb-10">
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <AlertCircle className="shrink-0 text-blue-400" size={20} />
            <p>
              <strong>Fórmula Tradicional:</strong> Es exacta y no lineal (cuadrática respecto a la altura). El IMC es siempre el mismo para los mismos valores.
            </p>
          </div>
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <Brain className="shrink-0 text-purple-400" size={20} />
            <p>
              <strong>Modelo IA:</strong> Al ser una regresión lineal (W·X + b), intenta "dibujar" un plano que pase por los puntos de entrenamiento. Presentará errores en valores extremos porque la relación real del IMC no es lineal.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
