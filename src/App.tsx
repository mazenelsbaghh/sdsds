import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Divider,
  Fab,
} from '@mui/material';
import {
  Campaign,
  FileDownload,
  FileUpload,
  Refresh,
  Dashboard,
  Gavel,
  People,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import { DataService } from './services/DataService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppData, Stats, Case, Lawyer } from './types';
import KPICards from './components/KPICards';
import CasesPanel from './components/CasesPanel';
import LawyersPanel from './components/LawyersPanel';
import MarketingPanel from './components/MarketingPanel';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Cairo", "Amiri", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.8rem',
      color: '#c41e3a',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      color: '#c41e3a',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.9rem',
      color: '#c41e3a',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.6rem',
      color: '#c41e3a',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.3rem',
      color: '#c41e3a',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: '#c41e3a',
    },
  },
  palette: {
    primary: {
      main: '#c41e3a',
      dark: '#a01729',
      light: '#e63946',
    },
    secondary: {
      main: '#ffd700',
      dark: '#e6c200',
      light: '#ffeb3b',
    },
    background: {
      default: '#1a1a1a',
      paper: 'rgba(255, 255, 255, 0.98)',
    },
    text: {
      primary: '#c41e3a',
      secondary: '#000000',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #c41e3a 0%, #ffd700 50%, #000000 100%)',
          minHeight: '100vh',
          fontFamily: '"Cairo", "Amiri", "Segoe UI", sans-serif',
          direction: 'rtl',
        },
        '@import': 'url("https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap")',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 220, 0.9))',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(196, 30, 58, 0.15), 0 5px 15px rgba(255, 215, 0, 0.1)',
          backdropFilter: 'blur(25px)',
          border: '3px solid rgba(255, 215, 0, 0.4)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #c41e3a, #ffd700, #c41e3a)',
            zIndex: 1,
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 30px 80px rgba(196, 30, 58, 0.25), 0 10px 25px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #c41e3a, #e63946)',
          color: 'white',
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 700,
          padding: '12px 30px',
          fontSize: '1.1rem',
          fontFamily: '"Cairo", sans-serif',
          boxShadow: '0 8px 25px rgba(196, 30, 58, 0.3)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #a01729, #c41e3a)',
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 35px rgba(196, 30, 58, 0.4)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 193, 7, 0.9))',
          color: '#c41e3a',
          border: '2px solid #c41e3a',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffd700, #ffb300)',
            color: '#a01729',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #c41e3a 0%, #000000 50%, #ffd700 100%)',
          boxShadow: '0 10px 30px rgba(196, 30, 58, 0.3)',
          borderBottom: '3px solid rgba(255, 215, 0, 0.5)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '15px 20px',
        },
      },
    },
  },
});

function App() {
  const [data, setData] = useLocalStorage<AppData>('smartlaw-crm-data', DataService.getInitialData());
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [stats, setStats] = useState<Stats>(DataService.calculateStats(data));

  useEffect(() => {
    setStats(DataService.calculateStats(data));
  }, [data]);

  const handleUpdateCase = (caseData: Case) => {
    const updatedCases = data.cases.map((c: Case) => c.id === caseData.id ? caseData : c);
    setData({ ...data, cases: updatedCases });
  };

  const handleDeleteCase = (id: string) => {
    const updatedCases = data.cases.filter((c: Case) => c.id !== id);
    setData({ ...data, cases: updatedCases });
  };

  const handleAddCase = (caseData: Omit<Case, 'id'>) => {
    const newCase = { ...caseData, id: Date.now().toString() };
    setData({ ...data, cases: [...data.cases, newCase] });
  };

  const handleUpdateLawyer = (lawyer: Lawyer) => {
    const updatedLawyers = data.lawyers.map((l: Lawyer) => l.id === lawyer.id ? lawyer : l);
    setData({ ...data, lawyers: updatedLawyers });
  };

  const handleDeleteLawyer = (id: string) => {
    const updatedLawyers = data.lawyers.filter((l: Lawyer) => l.id !== id);
    setData({ ...data, lawyers: updatedLawyers });
  };

  const handleAddLawyer = (lawyer: Omit<Lawyer, 'id'>) => {
    const newLawyer = { ...lawyer, id: Date.now().toString() };
    setData({ ...data, lawyers: [...data.lawyers, newLawyer] });
  };

  const handleExport = () => {
    const exportData = DataService.exportData(data);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartlaw-crm-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const importedData = DataService.importData(importData);
      setData(importedData);
      setImportDialogOpen(false);
      setImportData('');
    } catch (error) {
      alert('خطأ في استيراد البيانات. تأكد من صحة تنسيق الملف.');
    }
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟')) {
      setData(DataService.getInitialData());
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
        >
          <Toolbar sx={{ py: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Campaign sx={{ fontSize: '3rem', color: '#ffd700', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
              <Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    fontFamily: '"Cairo", sans-serif',
                  }}
                >
                  نظام سمارت لو للمحاماة
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                    fontFamily: '"Cairo", sans-serif',
                  }}
                >
                  إدارة شاملة للقضايا والعملاء
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              color="inherit" 
              startIcon={<FileDownload />} 
              onClick={handleExport}
              sx={{ 
                mx: 1, 
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              تصدير
            </Button>
            <Button 
              color="inherit" 
              startIcon={<FileUpload />} 
              onClick={() => setImportDialogOpen(true)}
              sx={{ 
                mx: 1, 
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              استيراد
            </Button>
            <Button 
              color="inherit" 
              startIcon={<Refresh />} 
              onClick={handleReset}
              sx={{ 
                mx: 1, 
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              إعادة تعيين
            </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* KPI Cards */}
          <Box sx={{ mb: 4 }}>
            <KPICards stats={stats} />
          </Box>

          {/* Main Sections */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Top Row - Cases and Lawyers */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
              {/* Cases Section */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: 'fit-content', minHeight: '600px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Gavel sx={{ mr: 2, fontSize: '2rem', color: theme.palette.primary.main }} />
                      <Typography variant="h5" fontWeight={700}>
                        إدارة القضايا
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <CasesPanel
                      cases={data.cases}
                      sponsors={data.sponsors}
                      lawyers={data.lawyers}
                      onUpdateCase={handleUpdateCase}
                      onDeleteCase={handleDeleteCase}
                      onAddCase={handleAddCase}
                    />
                  </CardContent>
                </Card>
              </Box>

              {/* Lawyers Section */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: 'fit-content', minHeight: '600px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <People sx={{ mr: 2, fontSize: '2rem', color: theme.palette.secondary.main }} />
                      <Typography variant="h5" fontWeight={700}>
                        إدارة المحامين
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <LawyersPanel
                      lawyers={data.lawyers}
                      onUpdateLawyer={handleUpdateLawyer}
                      onDeleteLawyer={handleDeleteLawyer}
                      onAddLawyer={handleAddLawyer}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Marketing Section */}
            <Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ mr: 2, fontSize: '2rem', color: '#10b981' }} />
                    <Typography variant="h5" fontWeight={700}>
                      التسويق والإحصائيات
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <MarketingPanel sponsors={data.sponsors} />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>

        {/* Import Dialog */}
        <Dialog 
          open={importDialogOpen} 
          onClose={() => setImportDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            استيراد البيانات
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="البيانات (JSON)"
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setImportDialogOpen(false)}
              sx={{ borderRadius: '15px' }}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleImport} 
              variant="contained"
              sx={{ borderRadius: '15px' }}
            >
              استيراد
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Add />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
