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
  Gavel,
  AttachMoney,
  MoneyOff,
} from '@mui/icons-material';
import { Case, Sponsor, Lawyer } from '../types';

interface CasesPanelProps {
  cases: Case[];
  sponsors: Sponsor[];
  lawyers: Lawyer[];
  onUpdateCase: (caseData: Case) => void;
  onDeleteCase: (id: string) => void;
  onAddCase: (caseData: Omit<Case, 'id'>) => void;
}

const CasesPanel: React.FC<CasesPanelProps> = ({
  cases,
  sponsors,
  lawyers,
  onUpdateCase,
  onDeleteCase,
  onAddCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState<Omit<Case, 'id'>>({
    title: '',
    type: '',
    status: 'جديدة',
    isFree: true,
    createdAt: new Date().toISOString().split('T')[0],
    sponsorId: '',
    lawyerId: '',
    description: '',
  });

  const filteredCases = useMemo(() => {
    return cases.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsors.find(s => s.id === caseItem.sponsorId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyers.find(l => l.id === caseItem.lawyerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm, sponsors, lawyers]);

  const handleSubmit = () => {
    if (editingCase) {
      onUpdateCase({ ...editingCase, ...formData });
    } else {
      onAddCase(formData);
    }
    handleCloseDialog();
  };

  const handleEdit = (caseItem: Case) => {
    setEditingCase(caseItem);
    setFormData({
      title: caseItem.title,
      type: caseItem.type,
      status: caseItem.status,
      isFree: caseItem.isFree,
      createdAt: caseItem.createdAt,
      sponsorId: caseItem.sponsorId || '',
      lawyerId: caseItem.lawyerId || '',
      description: caseItem.description || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCase(null);
    setFormData({
      title: '',
      type: '',
      status: 'جديدة',
      isFree: true,
      createdAt: new Date().toISOString().split('T')[0],
      sponsorId: '',
      lawyerId: '',
      description: '',
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'عنوان القضية',
      width: 200,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'النوع',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 120,
      renderCell: (params) => {
        const status = params.value as Case['status'];
        const color = status === 'مكتملة' ? 'success' : status === 'قيد المعالجة' ? 'warning' : 'info';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'isFree',
      headerName: 'النوع',
      width: 100,
      renderCell: (params) => {
        const isFree = params.value as boolean;
        return (
          <Chip
            label={isFree ? 'مجانية' : 'مدفوعة'}
            color={isFree ? 'default' : 'success'}
            size="small"
            icon={isFree ? <MoneyOff /> : <AttachMoney />}
          />
        );
      },
    },
    {
      field: 'sponsorId',
      headerName: 'الراعي',
      width: 150,
      valueGetter: (value) => {
        const sponsor = sponsors.find(s => s.id === value);
        return sponsor ? sponsor.name : 'غير محدد';
      },
    },
    {
      field: 'lawyerId',
      headerName: 'المحامي المسؤول',
      width: 150,
      valueGetter: (value) => {
        const lawyer = lawyers.find(l => l.id === value);
        return lawyer ? lawyer.name : 'غير محدد';
      },
    },
    {
      field: 'createdAt',
      headerName: 'تاريخ الإنشاء',
      width: 120,
      type: 'date',
      valueGetter: (value) => value ? new Date(value) : null,
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
            onClick={() => handleEdit(params.row as Case)}
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
              if (window.confirm('هل أنت متأكد من حذف هذه القضية؟')) {
                onDeleteCase(params.row.id);
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
            <Gavel />
            إدارة القضايا
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
              onClick={() => setOpenDialog(true)}
            >
              إضافة قضية
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
            rows={filteredCases}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCase ? 'تعديل القضية' : 'إضافة قضية جديدة'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="عنوان القضية"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="نوع القضية"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={formData.status}
                label="الحالة"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Case['status'] })}
              >
                <MenuItem value="جديدة">جديدة</MenuItem>
                <MenuItem value="قيد المعالجة">قيد المعالجة</MenuItem>
                <MenuItem value="مكتملة">مكتملة</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>نوع القضية</InputLabel>
              <Select
                value={formData.isFree ? 'free' : 'paid'}
                label="نوع القضية"
                onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'free' })}
              >
                <MenuItem value="free">مجانية</MenuItem>
                <MenuItem value="paid">مدفوعة</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>الراعي</InputLabel>
              <Select
                value={formData.sponsorId}
                label="الراعي"
                onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
              >
                {sponsors.map((sponsor) => (
                  <MenuItem key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>المحامي المسؤول</InputLabel>
              <Select
                value={formData.lawyerId}
                label="المحامي المسؤول"
                onChange={(e) => setFormData({ ...formData, lawyerId: e.target.value })}
              >
                {lawyers.map((lawyer) => (
                  <MenuItem key={lawyer.id} value={lawyer.id}>
                    {lawyer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="تاريخ الإنشاء"
              type="date"
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="الوصف"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCase ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CasesPanel;