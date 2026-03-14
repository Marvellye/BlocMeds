import { useState, useEffect } from 'react';
import { Plus, Search, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Batch } from '@/lib/mockData';
import Toast from '@/components/Toast';

const ManageBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    batchId: '',
    drugName: '',
    manufacturer: '',
    walletAddress: '',
    expiry: '',
    quantity: '',
    status: 'pending' as 'verified' | 'pending' | 'flagged'
  });
  const itemsPerPage = 10;

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    const filtered = batches.filter(batch => 
      batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBatches(filtered);
    setCurrentPage(1);
  }, [searchQuery, batches]);

  const loadBatches = () => {
    const data = JSON.parse(localStorage.getItem('batches') || '[]');
    setBatches(data);
    setFilteredBatches(data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      const updated = batches.filter(b => b.id !== id);
      localStorage.setItem('batches', JSON.stringify(updated));
      setBatches(updated);
      setToast({ message: 'Batch deleted successfully', type: 'success' });
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      batchId: batch.batchId,
      drugName: batch.drugName,
      manufacturer: batch.manufacturer,
      walletAddress: (batch as any).walletAddress || '',
      expiry: batch.expiry,
      quantity: batch.quantity.toString(),
      status: batch.status
    });
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingBatch(null);
    setFormData({
      batchId: '',
      drugName: '',
      manufacturer: '',
      walletAddress: '',
      expiry: '',
      quantity: '',
      status: 'pending'
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.drugName || !formData.manufacturer || !formData.walletAddress || !formData.expiry || !formData.quantity) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    // Check if manufacturer is verified
    const verifiedManufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
    if (!verifiedManufacturers.includes(formData.walletAddress)) {
      setToast({ message: 'Manufacturer wallet address is not verified. Please verify first.', type: 'error' });
      return;
    }

    if (editingBatch) {
      // Edit existing batch
      const updated = batches.map(b => 
        b.id === editingBatch.id 
          ? { ...b, ...formData, quantity: parseInt(formData.quantity), walletAddress: formData.walletAddress }
          : b
      );
      localStorage.setItem('batches', JSON.stringify(updated));
      setBatches(updated);
      setToast({ message: 'Batch updated successfully', type: 'success' });
    } else {
      // Add new batch
      const newBatch: any = {
        id: `batch-${Date.now()}`,
        batchId: formData.batchId,
        drugName: formData.drugName,
        manufacturer: formData.manufacturer,
        walletAddress: formData.walletAddress,
        expiry: formData.expiry,
        quantity: parseInt(formData.quantity),
        status: formData.status,
        location: { lat: 9.0820, lng: 8.6753 } // Default location
      };
      const updated = [...batches, newBatch];
      localStorage.setItem('batches', JSON.stringify(updated));
      setBatches(updated);
      setToast({ message: 'Batch added successfully', type: 'success' });
    }

    setDialogOpen(false);
  };

  const exportToCSV = () => {
    const headers = ['Batch ID', 'Drug Name', 'Manufacturer', 'Expiry', 'Quantity', 'Status'];
    const rows = filteredBatches.map(b => [
      b.batchId, b.drugName, b.manufacturer, b.expiry, b.quantity, b.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batches-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    setToast({ message: 'Batches exported successfully', type: 'success' });
  };

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'flagged': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Manage Batches
          </h1>
          <p className="text-muted-foreground mt-2">Track and manage pharmaceutical batch records</p>
        </div>
      </div>

      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Batch Inventory</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" className="rounded-xl gradient-primary text-white" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Batch
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch ID, drug name, or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Batch ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Drug Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Manufacturer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Expiry</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{batch.batchId}</td>
                      <td className="px-4 py-3 text-sm">{batch.drugName}</td>
                      <td className="px-4 py-3 text-sm">{batch.manufacturer}</td>
                      <td className="px-4 py-3 text-sm">{batch.expiry}</td>
                      <td className="px-4 py-3 text-sm">{batch.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleEdit(batch)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                            onClick={() => handleDelete(batch.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBatches.length)} of {filteredBatches.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID *</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                placeholder="RX-2024-001A"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drugName">Drug Name *</Label>
              <Input
                id="drugName"
                value={formData.drugName}
                onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                placeholder="Paracetamol 500mg"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="PharmaCorp"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Manufacturer Wallet Address *</Label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="0.0.XXXXX"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="1000"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl gradient-primary text-white">
                {editingBatch ? 'Update' : 'Add'} Batch
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

export default ManageBatches;
