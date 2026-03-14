import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Toast from '@/components/Toast';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const reportTypes = [
    { value: 'batch-audit', label: 'Batch Audit Report' },
    { value: 'scan-summary', label: 'Scan Summary Report' },
    { value: 'user-activity', label: 'User Activity Report' },
    { value: 'risk-analysis', label: 'Risk Analysis Report' }
  ];

  const generateReport = () => {
    if (!reportType) {
      setToast({ message: 'Please select a report type', type: 'error' });
      return;
    }

    // Simulate report generation
    setTimeout(() => {
      setToast({ message: 'Report generated successfully!', type: 'success' });
      
      // Create a sample CSV
      const headers = ['Date', 'Type', 'Details', 'Status'];
      const rows = [
        ['2024-01-10', reportType, 'Sample report data', 'Generated']
      ];
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }, 1000);
  };

  const recentReports = [
    { id: '1', type: 'Batch Audit', date: '2024-01-09', status: 'Completed' },
    { id: '2', type: 'Scan Summary', date: '2024-01-08', status: 'Completed' },
    { id: '3', type: 'Risk Analysis', date: '2024-01-07', status: 'Completed' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Reports
        </h1>
        <p className="text-muted-foreground mt-2">Generate and download comprehensive reports</p>
      </div>

      {/* Generate Report */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="rounded-xl">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <input
                id="start-date"
                type="date"
                className="w-full h-10 px-3 rounded-xl border border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <input
                id="end-date"
                type="date"
                className="w-full h-10 px-3 rounded-xl border border-input bg-background"
              />
            </div>
          </div>

          <Button
            onClick={generateReport}
            className="w-full h-12 rounded-xl gradient-primary text-white shadow-hover hover:scale-[1.02] transition-smooth"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate & Download Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map(report => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{report.type}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    {report.status}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Reports;
