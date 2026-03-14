import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GeographicMap from '@/components/GeographicMap';
import { analysisAPI } from '@/lib/api';


const Analytics = () => {
  const [analysis, setAnalysis] = useState<{ anomalies: string[]; prediction: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hotspots = [
    { position: [6.5244, 3.3792] as [number, number], name: 'Lagos', risk: 'High', incidents: 12 },
    { position: [9.0820, 8.6753] as [number, number], name: 'Abuja', risk: 'Medium', incidents: 5 },
    { position: [7.3775, 3.9470] as [number, number], name: 'Ibadan', risk: 'Low', incidents: 2 },
    { position: [11.9987, 8.5211] as [number, number], name: 'Kano', risk: 'High', incidents: 8 }
  ];

  const riskData = [
    { region: 'Northern', risk: 0.65 },
    { region: 'Southern', risk: 0.4 },
    { region: 'Eastern', risk: 0.25 },
    { region: 'Western', risk: 0.55 }
  ];


  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    const response = await analysisAPI.analyze();
    
    if (response.success && response.analysis) {
      setAnalysis({
        anomalies: response.analysis.anomalies,
        prediction: `Risk Level: ${response.analysis.riskLevel.toUpperCase()} (${Math.round(response.analysis.confidence * 100)}% confidence). ${response.analysis.predictions.join(' ')}`
      });
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground mt-2">AI-powered analysis and risk assessment</p>
      </div>

      {/* AI Analysis */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="w-full h-12 rounded-xl gradient-primary text-white shadow-hover hover:scale-[1.02] transition-smooth"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing data...
              </span>
            ) : (
              'Run AI Analysis'
            )}
          </Button>

          {analysis && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-orange-900 dark:text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  Detected Anomalies
                </h3>
                <ul className="space-y-2">
                  {analysis.anomalies.map((anomaly, idx) => (
                    <li key={idx} className="text-sm text-orange-800 dark:text-orange-300">
                      • {anomaly}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-900 dark:text-blue-400">
                  <TrendingUp className="h-4 w-4" />
                  Prediction
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">{analysis.prediction}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regional Risk Assessment */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle>Regional Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="region" />
                <YAxis domain={[0, 1]} />
                <RechartsTooltip />
                <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle>Geographic Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <GeographicMap hotspots={hotspots} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
