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
  IconButton,
  Tooltip,
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
  Brightness4,
  Brightness7,
  Settings,
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
      fontSize: '3.2rem',
      background: 'linear-gradient(135deg, #e94560, #533483)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 4px 8px rgba(233, 69, 96, 0.3)',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.6rem',
      background: 'linear-gradient(135deg, #e94560, #533483)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.2rem',
      color: '#1a1a2e',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.8rem',
      color: '#1a1a2e',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#1a1a2e',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.3rem',
      color: '#1a1a2e',
    },
  },
  palette: {
    primary: {
      main: '#e94560',
      dark: '#d63851',
      light: '#f06b7a',
    },
    secondary: {
      main: '#533483',
      dark: '#4a2d75',
      light: '#6b4ba0',
    },
    info: {
      main: '#ffd700',
      dark: '#e6c200',
      light: '#ffeb3b',
    },
    background: {
      default: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
      paper: 'rgba(255, 255, 255, 0.98)',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#533483',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
          minHeight: '100vh',
          fontFamily: '"Cairo", "Amiri", "Segoe UI", sans-serif',
          direction: 'rtl',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 80%, rgba(233, 69, 96, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(83, 52, 131, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          },
        },
        '@import': 'url("https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap")',
      },
    },
  },
});

function App() {
  const [data, setData] = useLocalStorage<AppData>('smartlaw-crm-data', DataService.getInitialData());
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [stats, setStats] = useState<Stats>(DataService.calculateStats(data));
  const [darkMode, setDarkMode] = useState(false);

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
          className="glow-effect"
        >
          <Toolbar sx={{ py: 3, justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, minHeight: '80px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box className="animate-float">
                <Campaign sx={{ 
                  fontSize: '3.5rem', 
                  color: '#ffd700', 
                  filter: 'drop-shadow(0 6px 12px rgba(255,215,0,0.4))',
                  animation: 'pulse 2s infinite'
                }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'white',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                    fontFamily: '"Cairo", sans-serif',
                    background: 'linear-gradient(135deg, #ffffff, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  نظام سمارت لو للمحاماة
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: 500,
                    fontFamily: '"Cairo", sans-serif',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  إدارة شاملة للقضايا والعملاء
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Tooltip title="تبديل الوضع المظلم">
                <IconButton 
                  color="inherit" 
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{ 
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
              <Button 
                color="inherit" 
                startIcon={<FileDownload />} 
                onClick={handleExport}
                className="interactive-element"
                sx={{ 
                  mx: 1, 
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                تصدير
              </Button>
              <Button 
                color="inherit" 
                startIcon={<FileUpload />} 
                onClick={() => setImportDialogOpen(true)}
                className="interactive-element"
                sx={{ 
                  mx: 1, 
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                استيراد
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Refresh />} 
                onClick={handleReset}
                className="interactive-element"
                sx={{ 
                  mx: 1, 
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                إعادة تعيين
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 5, position: 'relative', zIndex: 1 }}>
          {/* KPI Cards */}
          <Box sx={{ mb: 5 }} className="animate-fadeInUp">
            <KPICards stats={stats} />
          </Box>

          {/* Main Sections */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Top Row - Cases and Lawyers */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 5 }} className="animate-fadeInUp">
              {/* Cases Section */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: 'fit-content', minHeight: '600px' }} className="glow-effect">
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Box className="animate-pulse" sx={{ mr: 2, p: 1.5, borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #533483)', color: 'white' }}>
                        <Gavel sx={{ fontSize: '2rem' }} />
                      </Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a2e' }}>
                        إدارة القضايا
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, #e94560, #533483)', height: '2px' }} />
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
                <Card sx={{ height: 'fit-content', minHeight: '600px' }} className="glow-effect">
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Box className="animate-pulse" sx={{ mr: 2, p: 1.5, borderRadius: '50%', background: 'linear-gradient(135deg, #533483, #ffd700)', color: 'white' }}>
                        <People sx={{ fontSize: '2rem' }} />
                      </Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a2e' }}>
                        إدارة المحامين
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, #533483, #ffd700)', height: '2px' }} />
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
            <Box className="animate-fadeInUp">
              <Card className="glow-effect">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box className="animate-pulse" sx={{ mr: 2, p: 1.5, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                      <TrendingUp sx={{ fontSize: '2rem' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a2e' }}>
                      التسويق والإحصائيات
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, #10b981, #059669)', height: '2px' }} />
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
              borderRadius: '32px',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.6rem', textAlign: 'center' }}>
            استيراد البيانات
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
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
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 4, gap: 2 }}>
            <Button 
              onClick={() => setImportDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: '20px', px: 3 }}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleImport} 
              variant="contained"
              sx={{ borderRadius: '20px', px: 3 }}
            >
              استيراد
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          className="animate-float"
          sx={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #e94560, #533483)',
            boxShadow: '0 15px 40px rgba(233, 69, 96, 0.4), 0 5px 20px rgba(83, 52, 131, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d63851, #4a2d75)',
              transform: 'scale(1.15) rotate(10deg)',
              boxShadow: '0 20px 50px rgba(233, 69, 96, 0.5), 0 8px 25px rgba(83, 52, 131, 0.4)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Add sx={{ fontSize: '2rem' }} />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
