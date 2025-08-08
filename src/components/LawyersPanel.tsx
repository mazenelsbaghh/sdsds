import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Fab,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Add,
  Search,
  Edit,
  Delete,
  Refresh,
  Person,
  Phone,
  Work,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { Lawyer } from '../types';

interface LawyersPanelProps {
  lawyers: Lawyer[];
  onUpdateLawyer: (lawyer: Lawyer) => void;
  onDeleteLawyer: (id: string) => void;
  onAddLawyer: (lawyer: Omit<Lawyer, 'id'>) => void;
}

const LawyersPanel: React.FC<LawyersPanelProps> = ({
  lawyers,
  onUpdateLawyer,
  onDeleteLawyer,
  onAddLawyer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: '',
    status: 'نشط' as Lawyer['status'],
    notes: '',
    joinDate: new Date().toISOString().split('T')[0],
    maxCases: 10,
    currentCases: 0,
    isSubscribed: false,
    subscriptionEndDate: '',
    subscriptionType: 'مجاني' as Lawyer['subscriptionType'],
  });

  const filteredLawyers = useMemo(() => {
    return lawyers.filter(
      (lawyer) =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.phone.includes(searchTerm) ||
        lawyer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lawyers, searchTerm]);

  const handleSubmit = () => {
    if (editingLawyer) {
      onUpdateLawyer({ ...editingLawyer, ...formData });
    } else {
      onAddLawyer(formData);
    }
    handleCloseDialog();
  };

  const handleEdit = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setFormData({
      name: lawyer.name,
      phone: lawyer.phone,
      specialty: lawyer.specialty,
      status: lawyer.status,
      notes: lawyer.notes,
      joinDate: lawyer.joinDate || new Date().toISOString().split('T')[0],
      maxCases: lawyer.maxCases || 10,
      currentCases: lawyer.currentCases || 0,
      isSubscribed: lawyer.isSubscribed || false,
      subscriptionEndDate: lawyer.subscriptionEndDate || '',
      subscriptionType: lawyer.subscriptionType || 'مجاني',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLawyer(null);
    setFormData({
      name: '',
      phone: '',
      specialty: '',
      status: 'نشط',
      notes: '',
      joinDate: new Date().toISOString().split('T')[0],
      maxCases: 10,
      currentCases: 0,
      isSubscribed: false,
      subscriptionEndDate: '',
      subscriptionType: 'مجاني',
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'الاسم',
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person fontSize="small" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'الهاتف',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone fontSize="small" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'specialty',
      headerName: 'التخصص',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Work fontSize="small" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 120,
      renderCell: (params) => {
        const status = params.value as Lawyer['status'];
        const isActive = status === 'نشط';
        return (
          <Chip
            label={status}
            color={isActive ? 'success' : 'error'}
            size="small"
            icon={isActive ? <CheckCircle /> : <Cancel />}
          />
        );
      },
    },
    {
      field: 'joinDate',
      headerName: 'تاريخ الانضمام',
      width: 140,
      type: 'date',
      valueGetter: (value) => value ? new Date(value) : null,
    },
    {
      field: 'caseProgress',
      headerName: 'القضايا',
      width: 150,
      renderCell: (params) => {
        const lawyer = params.row as Lawyer;
        const current = lawyer.currentCases || 0;
        const max = lawyer.maxCases || 0;
        const remaining = max - current;
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color={remaining > 0 ? 'success.main' : 'error.main'}>
              {current}/{max}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              متبقي: {remaining}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'subscription',
      headerName: 'الاشتراك',
      width: 140,
      renderCell: (params) => {
        const lawyer = params.row as Lawyer;
        const isSubscribed = lawyer.isSubscribed || false;
        const subscriptionType = lawyer.subscriptionType || 'مجاني';
        return (
          <Chip
            label={isSubscribed ? subscriptionType : 'غير مشترك'}
            color={isSubscribed ? 'primary' : 'default'}
            size="small"
            variant={isSubscribed ? 'filled' : 'outlined'}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row as Lawyer)}
            sx={{ 
              minWidth: 'auto', 
              p: 1,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c41e3a, #e63946)',
              '&:hover': {
                background: 'linear-gradient(135deg, #a01729, #c41e3a)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <Edit fontSize="small" />
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
              if (window.confirm('هل أنت متأكد من حذف هذا المحامي؟')) {
                onDeleteLawyer(params.row.id);
              }
            }}
            sx={{ 
              minWidth: 'auto', 
              p: 1,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <Delete fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            إدارة المحامين
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="البحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search />,
              }}
              sx={{ minWidth: 200, flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              إضافة محامي
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setSearchTerm('')}
            >
              إعادة تعيين
            </Button>
          </Box>

          <DataGrid
            rows={filteredLawyers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-root': {
                direction: 'rtl',
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLawyer ? 'تعديل المحامي' : 'إضافة محامي جديد'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="الاسم"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="رقم الهاتف"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="التخصص"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={formData.status}
                label="الحالة"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Lawyer['status'] })}
              >
                <MenuItem value="نشط">نشط</MenuItem>
                <MenuItem value="موقوف">موقوف</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="تاريخ الانضمام"
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="الحد الأقصى للقضايا"
                type="number"
                value={formData.maxCases}
                onChange={(e) => setFormData({ ...formData, maxCases: parseInt(e.target.value) || 0 })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="القضايا الحالية"
                type="number"
                value={formData.currentCases}
                onChange={(e) => setFormData({ ...formData, currentCases: parseInt(e.target.value) || 0 })}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>نوع الاشتراك</InputLabel>
                <Select
                  value={formData.subscriptionType}
                  label="نوع الاشتراك"
                  onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value as Lawyer['subscriptionType'] })}
                >
                  <MenuItem value="مجاني">مجاني</MenuItem>
                  <MenuItem value="شهري">شهري</MenuItem>
                  <MenuItem value="سنوي">سنوي</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="تاريخ انتهاء الاشتراك"
                type="date"
                value={formData.subscriptionEndDate}
                onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value, isSubscribed: !!e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="ملاحظات"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingLawyer ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LawyersPanel;