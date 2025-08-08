import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Warning,
  TrendingUp,
} from '@mui/icons-material';
import { AppData, Sponsor } from '../types';
import { DataService } from '../services/DataService';

interface SponsorsPanelProps {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
}

export const SponsorsPanel: React.FC<SponsorsPanelProps> = ({ data, updateData }) => {
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedSponsorForReorder, setSelectedSponsorForReorder] = useState<string>('');
  const [reorderAmount, setReorderAmount] = useState(10);
  const [reorderNote, setReorderNote] = useState('');

  const filteredSponsors = data.sponsors.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddSponsor = () => {
    setEditingSponsor({
      id: DataService.generateId(),
      name: '',
      packageSize: 0,
      used: 0,
      replies: 0,
      lastReply: new Date().toISOString().slice(0, 10),
      notes: '',
      subscriptionDate: new Date().toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor({ ...sponsor });
    setDialogOpen(true);
  };

  const handleDeleteSponsor = (id: string) => {
    if (window.confirm('هل تريد حذف هذا السبونسر؟')) {
      const newSponsors = data.sponsors.filter(s => s.id !== id);
      updateData({ sponsors: newSponsors });
    }
  };

  const handleSaveSponsor = () => {
    if (!editingSponsor) return;

    const existingIndex = data.sponsors.findIndex(s => s.id === editingSponsor.id);
    let newSponsors;

    if (existingIndex >= 0) {
      newSponsors = [...data.sponsors];
      newSponsors[existingIndex] = editingSponsor;
    } else {
      newSponsors = [...data.sponsors, editingSponsor];
    }

    updateData({ sponsors: newSponsors });
    setDialogOpen(false);
    setEditingSponsor(null);
  };

  const handleReorder = (sponsorId: string) => {
    setSelectedSponsorForReorder(sponsorId);
    setReorderDialogOpen(true);
  };

  const handleSaveReorder = () => {
    const sponsor = data.sponsors.find(s => s.id === selectedSponsorForReorder);
    if (!sponsor) return;

    const updatedSponsor = {
      ...sponsor,
      packageSize: sponsor.packageSize + reorderAmount,
    };

    const newSponsors = data.sponsors.map(s =>
      s.id === selectedSponsorForReorder ? updatedSponsor : s
    );

    const newReorder = {
      id: DataService.generateId(),
      sponsorId: selectedSponsorForReorder,
      delta: reorderAmount,
      note: reorderNote || 'تجديد الباقة',
      at: new Date().toISOString(),
    };

    updateData({
      sponsors: newSponsors,
      reorders: [...data.reorders, newReorder],
    });

    setReorderDialogOpen(false);
    setSelectedSponsorForReorder('');
    setReorderAmount(10);
    setReorderNote('');
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'اسم السبونسر',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'packageSize',
      headerName: 'الباقة',
      width: 100,
      type: 'number',
    },
    {
      field: 'used',
      headerName: 'المستخدم',
      width: 100,
      type: 'number',
    },
    {
      field: 'remaining',
      headerName: 'المتبقي',
      width: 100,
      valueGetter: (value, row) => {
        const sponsor = row as Sponsor;
        return Math.max(0, sponsor.packageSize - sponsor.used);
      },
      renderCell: (params) => {
        const remaining = params.value as number;
        const color = remaining <= 5 ? 'error' : remaining <= 10 ? 'warning' : 'success';
        return (
          <Chip
            label={remaining}
            color={color}
            size="small"
            icon={remaining <= 5 ? <Warning /> : <TrendingUp />}
          />
        );
      },
    },
    {
      field: 'replies',
      headerName: 'الردود',
      width: 100,
      type: 'number',
    },
    {
      field: 'lastReply',
      headerName: 'آخر رد',
      width: 120,
      type: 'date',
      valueGetter: (value) => value ? new Date(value) : null,
    },
    {
      field: 'subscriptionDate',
      headerName: 'تاريخ الاشتراك',
      width: 120,
      type: 'date',
      valueGetter: (value) => value ? new Date(value) : null,
    },
    {
      field: 'notes',
      headerName: 'ملاحظات',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'الإجراءات',
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="تجديد الباقة">
              <Refresh />
            </Tooltip>
          }
          label="تجديد"
          onClick={() => handleReorder(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="تعديل"
          onClick={() => handleEditSponsor(params.row as Sponsor)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="حذف"
          onClick={() => handleDeleteSponsor(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box>
      {/* شريط الأدوات */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSponsor}
        >
          إضافة سبونسر
        </Button>
        <TextField
          label="البحث"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="البحث بالاسم..."
        />
      </Box>

      {/* تنبيهات */}
      {data.sponsors.some(s => (s.packageSize - s.used) <= 5) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ يوجد سبونسر أو أكثر يحتاج لتجديد الباقة (متبقي 5 قضايا أو أقل)
        </Alert>
      )}

      {/* جدول البيانات */}
      <DataGrid
        rows={filteredSponsors}
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

      {/* حوار إضافة/تعديل السبونسر */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSponsor?.name ? 'تعديل السبونسر' : 'إضافة سبونسر جديد'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="اسم السبونسر"
              value={editingSponsor?.name || ''}
              onChange={(e) =>
                setEditingSponsor(prev => prev ? { ...prev, name: e.target.value } : null)
              }
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="حجم الباقة (عدد القضايا)"
                type="number"
                value={editingSponsor?.packageSize || 0}
                onChange={(e) =>
                  setEditingSponsor(prev => prev ? { ...prev, packageSize: parseInt(e.target.value) || 0 } : null)
                }
              />
              <TextField
                fullWidth
                label="المستخدم"
                type="number"
                value={editingSponsor?.used || 0}
                onChange={(e) =>
                  setEditingSponsor(prev => prev ? { ...prev, used: parseInt(e.target.value) || 0 } : null)
                }
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="إجمالي الردود"
                type="number"
                value={editingSponsor?.replies || 0}
                onChange={(e) =>
                  setEditingSponsor(prev => prev ? { ...prev, replies: parseInt(e.target.value) || 0 } : null)
                }
              />
              <TextField
                fullWidth
                label="آخر رد"
                type="date"
                value={editingSponsor?.lastReply || ''}
                onChange={(e) =>
                  setEditingSponsor(prev => prev ? { ...prev, lastReply: e.target.value } : null)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              fullWidth
              label="تاريخ الاشتراك"
              type="date"
              value={editingSponsor?.subscriptionDate || ''}
              onChange={(e) =>
                setEditingSponsor(prev => prev ? { ...prev, subscriptionDate: e.target.value } : null)
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="ملاحظات"
              multiline
              rows={3}
              value={editingSponsor?.notes || ''}
              onChange={(e) =>
                setEditingSponsor(prev => prev ? { ...prev, notes: e.target.value } : null)
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleSaveSponsor} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار تجديد الباقة */}
      <Dialog open={reorderDialogOpen} onClose={() => setReorderDialogOpen(false)}>
        <DialogTitle>تجديد/إعادة شحن الباقة</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="زيادة عدد القضايا"
              type="number"
              value={reorderAmount}
              onChange={(e) => setReorderAmount(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="ملاحظة"
              multiline
              rows={2}
              value={reorderNote}
              onChange={(e) => setReorderNote(e.target.value)}
              placeholder="تجديد الباقة الشهرية"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReorderDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleSaveReorder} variant="contained">
            تجديد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};